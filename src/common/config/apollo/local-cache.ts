import { gql, InMemoryCache } from '@apollo/client';

export const localCache = new InMemoryCache({
  typePolicies: {
    Character: {
      fields: {
        chosenQuantity: {
          read(chosenQuantity) {
            if (chosenQuantity === undefined || chosenQuantity === null) {
              return 0;
            }
            return chosenQuantity;
          },
        },
        unitPrice: {
          read(_, { readField }) {
            const charName = readField('name');
            switch (charName) {
              case 'Albert Einstein':
                return 25;
              case 'Rick Sanchez':
              case 'Morty Smith':
                return 10;

              default:
                return 5;
            }
          },
        },
      },
    },
  },
});

export const LocalCacheInitQuery = gql`
  query LocalCacheInit {
    shoppingCart
  }
`;

export function initialLocalCache() {
  localCache.writeQuery({
    query: LocalCacheInitQuery,
    data: {
      shoppingCart: null,
    },
  });
}
