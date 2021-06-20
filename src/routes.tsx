import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useGetShoppingCartQuery } from './common/generated/graphql';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Home from './screens/Home';
import Cart from './screens/Cart';

const TabRoutes = createBottomTabNavigator();

const Routes: React.FC = () => {
  const { data } = useGetShoppingCartQuery();

  return (
    <TabRoutes.Navigator
      tabBarOptions={{
        labelPosition: 'beside-icon',
        style: {
          height: 64,
          alignItems: 'center',
        },
      }}>
      <TabRoutes.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons size={size * 1.2} color={color} name="home" />
          ),
        }}
      />
      <TabRoutes.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarIcon: ({ size, color }) =>
            data?.shoppingCart?.numActionFigures ? (
              <View style={styles.badgeIconView}>
                <Text style={styles.badge}>
                  {data?.shoppingCart?.numActionFigures}
                </Text>
                <MaterialIcons
                  size={size * 1.2}
                  color={color}
                  name="shopping-cart"
                />
              </View>
            ) : (
              <MaterialIcons
                size={size * 1.2}
                color={color}
                name="shopping-cart"
              />
            ),
        }}
      />
    </TabRoutes.Navigator>
  );
};
export default Routes;

const styles = StyleSheet.create({
  badgeIconView: {
    position: 'relative',
  },
  badge: {
    color: '#fff',
    position: 'absolute',
    zIndex: 10,
    left: 24,
    bottom: 20,
    padding: 1,
    backgroundColor: 'red',
    borderRadius: 20,
    fontSize: 14,
  },
});
