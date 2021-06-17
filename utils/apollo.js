import { GraphQLClient } from "graphql-request";

let _client = null;

export const getGraphQLClient = () =>
  (_client = new GraphQLClient(process.env.GRAPHQL_ENDPOINT, {
    headers: {
      authorization: "Bearer MY_TOKEN",
    },
  }));
