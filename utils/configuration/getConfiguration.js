import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

export const getConfiguration = async ({ key, lang }) => {
  const query = gql`
    query ConfigurationGet($key: String!, $lang: Language!) {
      ConfigurationGet(key: $key, lang: $lang) {
        id
        lang
        key
        value
      }
    }
  `;
  const variables = {
    key,
    lang,
  };

  const { ConfigurationGet: configuration } = await getGraphQLClient().request(
    query,
    variables
  );
  return configuration;
};
