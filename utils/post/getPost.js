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
        category
        tags
        references {
          label
          url
        }
        coverImage
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

export const getLatestPosts = async ({ page, limit }) => {
  console.log("sending data", page, limit);
  const query = gql`
    query PostGetLatest($offset: Int!, $limit: Int!) {
      PostGetLatest(offset: $offset, limit: $limit) {
        id
        slug
        lang
        title
        excerpt
        category
        tags
        publishDate
        coverImage
      }
    }
  `;

  const variables = {
    offset: page,
    limit
  };

  const { PostGetLatest: posts } = await getGraphQLClient().request(query, variables);
  return posts;
};
