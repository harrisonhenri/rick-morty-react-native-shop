import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { useUpdateChosenQuantity } from '../src/common/hooks/use-update-chosen-quantity';
import { Button } from 'react-native';
import {
  CharacterDataFragment,
  CharacterDataFragmentDoc,
  GetShoppingCartDocument,
  GetShoppingCartQuery,
} from '../src/common/generated/graphql';

describe('useUpdateChosenQuantity hook', () => {
  let cache: InMemoryCache;
  let client: ApolloClient<any>;

  beforeEach(() => {
    cache = new InMemoryCache();

    cache.writeQuery({
      query: mockCharactersQuery,
      data: mockCharactersData,
    });

    client = new ApolloClient({
      cache,
    });
  });

  it('should increase the quantity correctly', async () => {
    const MockComponent = () => {
      const { onIncreaseChosenQuantity } = useUpdateChosenQuantity();

      return (
        <Button
          title="any_title"
          onPress={() => onIncreaseChosenQuantity('1')}
        />
      );
    };

    const wrapper = render(
      <MockedProvider cache={cache}>
        <MockComponent />
      </MockedProvider>,
    );

    fireEvent.press(wrapper!.getByRole('button')!);
    fireEvent.press(wrapper!.getByRole('button')!);

    const shoopingCart = client.readQuery<GetShoppingCartQuery>({
      query: GetShoppingCartDocument,
    });

    const character = client.readFragment<CharacterDataFragment>({
      fragment: CharacterDataFragmentDoc,
      id: 'Character:1',
    });

    expect(shoopingCart?.shoppingCart?.numActionFigures).toBe(2);
    expect(shoopingCart?.shoppingCart?.totalPrice).toBe(20);
    expect(character?.chosenQuantity).toBe(2);
  });
  it('should decrease the quantity correctly', async () => {
    cache.writeQuery({
      query: mockShoppingCartQuery,
      data: mockShoppinData,
    });

    client = new ApolloClient({
      cache,
    });

    const MockComponent = () => {
      const { onDecreaseChosenQuantity } = useUpdateChosenQuantity();

      return (
        <Button
          title="any_title"
          onPress={() => onDecreaseChosenQuantity('2')}
        />
      );
    };

    const wrapper = render(
      <MockedProvider cache={cache}>
        <MockComponent />
      </MockedProvider>,
    );

    fireEvent.press(wrapper!.getByRole('button')!);
    fireEvent.press(wrapper!.getByRole('button')!);
    fireEvent.press(wrapper!.getByRole('button')!);
    fireEvent.press(wrapper!.getByRole('button')!);
    fireEvent.press(wrapper!.getByRole('button')!);

    const shoopingCart = client.readQuery<GetShoppingCartQuery>({
      query: GetShoppingCartDocument,
    });

    const character = client.readFragment<CharacterDataFragment>({
      fragment: CharacterDataFragmentDoc,
      id: 'Character:2',
    });

    expect(shoopingCart?.shoppingCart?.numActionFigures).toBe(0);
    expect(shoopingCart?.shoppingCart?.totalPrice).toBe(0);
    expect(character?.chosenQuantity).toBe(0);
  });
});

const mockCharactersQuery = gql`
  fragment characterData on Character {
    id
    __typename
    name
    unitPrice @client
    chosenQuantity @client
  }

  query GetCharacters {
    characters {
      __typename
      results {
        ...characterData
        image
        species
        origin {
          id
          __typename
          name
        }
        location {
          id
          __typename
          name
        }
      }
    }
  }
`;

const mockCharactersData = {
  characters: {
    __typename: 'Characters',
    results: [
      {
        id: '1',
        __typename: 'Character',
        name: 'Rick Sanchez',
        image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
        species: 'Human',
        unitPrice: 10,
        chosenQuantity: 0,
        origin: {
          id: '1',
          __typename: 'Location',
          name: 'Earth (C-137)',
        },
        location: {
          id: '20',
          __typename: 'Location',
          name: 'Earth (Replacement Dimension)',
        },
      },
      {
        id: '2',
        __typename: 'Character',
        name: 'Rick Sanchez',
        image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
        species: 'Human',
        unitPrice: 10,
        chosenQuantity: 1,
        origin: {
          id: '1',
          __typename: 'Location',
          name: 'Earth (C-137)',
        },
        location: {
          id: '20',
          __typename: 'Location',
          name: 'Earth (Replacement Dimension)',
        },
      },
    ],
  },
};

const mockShoppingCartQuery = gql`
  query GetShoppingCart {
    shoppingCart @client {
      id
      totalPrice
      numActionFigures
    }
  }
`;

const mockShoppinData = {
  shoppingCart: {
    id: 'ShoppingCart:1',
    totalPrice: 10,
    numActionFigures: 1,
  },
};
