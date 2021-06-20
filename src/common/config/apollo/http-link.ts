import { HttpLink } from '@apollo/client/link/http';

export function createHttpLink() {
  return new HttpLink({
    uri: 'https://rickandmortyapi.com/graphql',
  });
}
