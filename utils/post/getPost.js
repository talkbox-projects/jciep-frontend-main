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

export const getHottestPosts = async ({ limit }) => {
  console.log("sending data", limit);
  const query = gql`
    query PostGetHotest($limit: Int!) {
      PostGetHotest(limit: $limit) {
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
    limit,
  };

  const { PostGetHotest: posts } = await getGraphQLClient().request(
    query,
    variables
  );
  return posts;
};

export const getFilteredPosts = async ({ lang, limit, page, category }) => {
  console.log("sending data", limit);
  const query = gql`
    query PostSearch(
      $limit: Int!
      $lang: Language
      $page: Int!
      $category: String
    ) {
      PostSearch(limit: $limit, lang: $lang, page: $page, category: $category) {
        totalRecords
        data {
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
    }
  `;

  const variables = {
    limit,
    lang,
    page,
    category,
  };

  const { PostSearch: posts } = await getGraphQLClient().request(
    query,
    variables
  );
  return posts;
};

export const getRelatedPosts = async ({ limit = 3, category, id }) => {
  console.log("sending data", limit);
  const query = gql`
    query PostGetRelated($limit: Int!, $category: String, $id: ID!) {
      PostGetRelated(limit: $limit, category: $category, id: $id) {
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
    limit,
    category,
    id,
  };

  const { PostGetRelated: posts } = await getGraphQLClient().request(
    query,
    variables
  );
  return posts;
};
