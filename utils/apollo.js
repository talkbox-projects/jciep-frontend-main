import { GraphQLClient } from "graphql-request";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export const getGraphQLClient = (context) => {
  const domain =
    typeof window === "undefined"
      ? publicRuntimeConfig.HOST_URL ?? "http://127.0.0.1:3000"
      : window.location.origin;
  return new GraphQLClient(`${domain}/api/graphql`, {
    ...(context?.req?.headers && { headers: context?.req?.headers }),
  });
};
