import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { GetCharactersDocument } from '../src/common/generated/graphql';
import Home from '../src/screens/Home';

describe('Home component', () => {
  it('should render and show progress on loading', () => {
    const wrapper = render(
      <MockedProvider addTypename={false} mocks={[mock]}>
        <Home />
      </MockedProvider>,
    );

    expect(wrapper.queryByTestId('progress')).toBeTruthy();
  });
  it('should render the flatlist when whe loading is false', async () => {
    const wrapper = render(
      <MockedProvider addTypename={false} mocks={[mock]}>
        <Home />
      </MockedProvider>,
    );

    await waitFor(() => [
      expect(wrapper.queryByTestId('progress')).toBeFalsy(),
    ]);

    expect(wrapper.queryByTestId('container')?.children.length).toBe(1);
  });
});

const mock = {
  request: {
    query: GetCharactersDocument,
  },
  result: {
    data: {
      characters: {
        __typename: 'Characters',
        results: [
          {
            id: '1',
            __typename: 'Character',
            name: 'Rick Sanchez',
            image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
            species: 'Human',
            unitPrice: 1,
            chosenQuantity: 10,
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
    },
  },
};
