import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { Character, useGetCharactersQuery } from '../common/generated/graphql';

import CharacterCard from '../common/components/CharacterCard';

const Home = () => {
  const { data, loading } = useGetCharactersQuery();

  if (loading) {
    return (
      <View testID="progress" style={styles.container}>
        <ActivityIndicator color="#32B768" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="container">
      <FlatList
        data={data?.characters?.results}
        renderItem={({ item }) => <CharacterCard data={item as Character} />}
        contentContainerStyle={styles.characterList}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  characterList: {
    padding: 16,
  },
});
