import { gql } from "graphql-request";
import { getGraphQLClient } from "../../utils/apollo";

export const getPage = async ({ key, lang }) => {
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

  const { PageGet: page } = await getGraphQLClient().request(query, variables);
  return page;
};
