import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';
import { useGetShoppingCartQuery } from '../common/generated/graphql';

const Cart = () => {
  const navigation = useNavigation();
  const { data } = useGetShoppingCartQuery();

  const handleNavigation = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {data?.shoppingCart?.numActionFigures ? (
        <>
          <View style={styles.content}>
            <Text style={styles.emoji}>🤗</Text>
            <Text
              style={
                styles.subtitle
              }>{`Total number of items: ${data?.shoppingCart.numActionFigures}`}</Text>
            <Text
              style={
                styles.subtitle
              }>{`Total price: U$ ${data?.shoppingCart.totalPrice}`}</Text>
          </View>
        </>
      ) : (
        <>
          <View style={styles.content}>
            <Text style={styles.emoji}>😢</Text>
            <Text style={styles.title}>Empty cart!</Text>
            <View style={styles.footer}>
              <Button title="Go back to shop" onPress={handleNavigation} />
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    marginTop: 15,
    lineHeight: 32,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 32,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emoji: {
    fontSize: 44,
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    paddingHorizontal: 20,
  },
});
