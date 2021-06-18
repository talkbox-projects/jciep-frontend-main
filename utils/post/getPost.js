import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

export const getPost = async ({ idOrSlug, lang }) => {
  const query = gql`
    query PostGet($idOrSlug: String!, $lang: Language!) {
      PostGet(idOrSlug: $idOrSlug, lang: $lang) {
        id
        slug
        lang
        title
        excerpt
        content
      }
    }
  `;
  const variables = {
    idOrSlug,
    lang,
  };

  const { PostGet: post } = await getGraphQLClient().request(query, variables);
  return post;
};
