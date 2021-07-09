import { GraphQLClient } from "graphql-request";

export const getGraphQLClient = () => {
  const domain =
    typeof window === "undefined"
      ? process.env.HOST_URL ?? "http://127.0.0.1:3000"
      : window.location.origin;
  return new GraphQLClient(`${domain}/api/graphql`, {});
};
