import { ApolloClient, ApolloLink } from '@apollo/client';
import { errorLink } from './apollo/error-link';
import { createHttpLink } from './apollo/http-link';
import { initialLocalCache, localCache } from './apollo/local-cache';

export function createApolloClient() {
  const httpLink = createHttpLink();

  const apolloClient = new ApolloClient({
    link: ApolloLink.from([errorLink, httpLink]),
    connectToDevTools: process.env.NODE_ENV !== 'production',
    cache: localCache,
    assumeImmutableResults: true,
  });

  return apolloClient;
}

initialLocalCache();
