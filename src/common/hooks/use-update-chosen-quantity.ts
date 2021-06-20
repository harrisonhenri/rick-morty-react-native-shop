import { useApolloClient } from '@apollo/client';
import { useCallback } from 'react';
import {
  CharacterDataFragment,
  CharacterDataFragmentDoc,
  GetShoppingCartDocument,
  GetShoppingCartQuery,
} from '../generated/graphql';

interface UpdateChosenQuantity {
  (): {
    onIncreaseChosenQuantity: (id: string) => void;
    onDecreaseChosenQuantity: (id: string) => void;
  };
}

export const useUpdateChosenQuantity: UpdateChosenQuantity = () => {
  const client = useApolloClient();

  const getCharacter = useCallback(
    (id: string) =>
      client.readFragment<CharacterDataFragment>({
        fragment: CharacterDataFragmentDoc,
        id: `Character:${id}`,
      }),
    [client],
  );

  const getShoppingCartParams = useCallback(() => {
    const shoppingCart = client.readQuery<GetShoppingCartQuery>({
      query: GetShoppingCartDocument,
    })?.shoppingCart;

    if (!shoppingCart) {
      return {
        id: 'ShoppingCart:1',
        totalPrice: 0,
        numActionFigures: 0,
      };
    }

    return {
      ...shoppingCart,
    };
  }, [client]);

  const increaseShoppingCart = useCallback(
    (unitPrice: number) => {
      let { id, totalPrice, numActionFigures } = getShoppingCartParams();

      totalPrice = totalPrice + unitPrice;
      numActionFigures = numActionFigures + 1;

      client.writeQuery<GetShoppingCartQuery>({
        query: GetShoppingCartDocument,
        data: {
          shoppingCart: {
            id,
            numActionFigures,
            totalPrice,
          },
        },
      });
    },
    [client, getShoppingCartParams],
  );

  const decreaseShoppingCart = useCallback(
    (unitPrice: number) => {
      let { id, totalPrice, numActionFigures } = getShoppingCartParams();

      totalPrice = totalPrice - unitPrice;
      numActionFigures = numActionFigures - 1;

      if (totalPrice < 0) {
        totalPrice = 0;
      }
      if (numActionFigures < 0) {
        numActionFigures = 0;
      }

      client.writeQuery<GetShoppingCartQuery>({
        query: GetShoppingCartDocument,
        data: {
          shoppingCart: {
            id,
            numActionFigures,
            totalPrice,
          },
        },
      });
    },
    [client, getShoppingCartParams],
  );

  const onIncreaseChosenQuantity = useCallback(
    (id: string) => {
      const character = getCharacter(id);

      client.writeFragment<CharacterDataFragment>({
        fragment: CharacterDataFragmentDoc,
        id: `Character:${id}`,
        data: {
          ...(character as CharacterDataFragment),
          chosenQuantity: (character?.chosenQuantity ?? 0) + 1,
        },
      });
      increaseShoppingCart(character?.unitPrice as number);
    },
    [client, getCharacter, increaseShoppingCart],
  );

  const onDecreaseChosenQuantity = useCallback(
    (id: string) => {
      const character = getCharacter(id);

      let chosenQuantity = (character?.chosenQuantity ?? 0) - 1;

      if (chosenQuantity < 0) {
        chosenQuantity = 0;
      }

      client.writeFragment<CharacterDataFragment>({
        fragment: CharacterDataFragmentDoc,
        id: `Character:${id}`,
        data: {
          ...(character as CharacterDataFragment),
          chosenQuantity,
        },
      });
      decreaseShoppingCart(character?.unitPrice as number);
    },
    [client, getCharacter, decreaseShoppingCart],
  );

  return {
    onIncreaseChosenQuantity,
    onDecreaseChosenQuantity,
  };
};
