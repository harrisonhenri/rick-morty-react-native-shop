import { onError } from '@apollo/client/link/error';

export const errorLink = onError(
  ({ graphQLErrors, networkError, response, operation }) => {
    if (graphQLErrors) {
      for (const error of graphQLErrors) {
        console.error(
          `[GraphQL error]: Message: ${error.message}, Location: ${error.locations}, Path: ${error.path}`,
          operation,
          response,
        );
      }
    }
    if (networkError) {
      if (networkError?.message.includes('Timeout')) {
        console.warn(networkError);
        return;
      }

      console.error(`[Network error]: ${networkError}`, operation, response);
    }
  },
);
