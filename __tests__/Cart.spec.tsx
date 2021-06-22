import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import Cart from '../src/screens/Cart';

const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockedNavigate }),
}));

describe('Cart component', () => {
  it('should render with empty cart and navigate on click', async () => {
    const resolvers = {
      Query: {
        shoppingCart: jest.fn().mockReturnValue(null),
      },
    };

    const wrapper = render(
      <MockedProvider resolvers={resolvers} addTypename={false} mocks={[]}>
        <Cart />
      </MockedProvider>,
    );

    await waitFor(() => [
      expect(wrapper.queryByTestId('empty-cart')).toBeTruthy(),
      expect(wrapper.queryByTestId('fulfilled-cart')).toBeFalsy(),
    ]);

    fireEvent.press(wrapper.getByRole('button'));
    expect(mockedNavigate).toHaveBeenCalledWith('Home');
  });
  it('should render when the shoppingCart cart is fulfilled', async () => {
    const resolvers = {
      Query: {
        shoppingCart: jest.fn().mockReturnValue({
          id: 'any_id',
          totalPrice: 10,
          numActionFigures: 10,
        }),
      },
    };

    const wrapper = render(
      <MockedProvider resolvers={resolvers} addTypename={false} mocks={[]}>
        <Cart />
      </MockedProvider>,
    );

    await waitFor(() => [
      expect(wrapper.queryByTestId('empty-cart')).toBeFalsy(),
      expect(wrapper.queryByTestId('fulfilled-cart')).toBeTruthy(),
    ]);
  });
});
