import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

export const getConfiguration = async ({ key, lang }) => {
  let res = undefined;
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

  res = (await getGraphQLClient().request(query, variables)).ConfigurationGet;
  if (!res)
    // handle no lang
    res = (
      await getGraphQLClient().request(query, {
        ...variables,
        lang: "zh",
      })
    ).ConfigurationGet;

  return res;
};
