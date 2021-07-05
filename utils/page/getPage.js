import { gql } from "graphql-request";
import { getGraphQLClient } from "../../utils/apollo";

export const getPage = async ({ key, lang }) => {
  let res = undefined;
  const query = gql`
    query PageGet($key: String!, $lang: Language!) {
      PageGet(key: $key, lang: $lang) {
        key
        lang
        content
      }
    }
  `;
  const variables = {
    key,
    lang,
  };

  res = (await getGraphQLClient().request(query, variables)).PageGet;
  if (!res)
    // handle no lang
    res = (
      await getGraphQLClient().request(query, {
        ...variables,
        lang: "zh",
      })
    ).PageGet;

  return res;
};
