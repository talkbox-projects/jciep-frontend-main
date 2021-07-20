import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

export const getPost = async ({ idOrSlug, lang }, context) => {
  const query = gql`
    query PostGet($idOrSlug: String!, $lang: Language!) {
      PostGet(idOrSlug: $idOrSlug, lang: $lang) {
        id
        slug
        lang
        title
        excerpt
        featureDisplay
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

  const { PostGet: post } = await getGraphQLClient(context).request(
    query,
    variables
  );
  return post;
};

export const getHottestPosts = async ({ limit }, context) => {
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

  const { PostGetHotest: posts } = await getGraphQLClient(context).request(
    query,
    variables
  );
  return posts;
};

export const getFilteredPosts = async (
  { lang, limit, featureDisplay = false, page, category },
  context
) => {
  const query = gql`
    query PostSearch(
      $limit: Int!
      $lang: Language
      $featureDisplay: Boolean
      $page: Int!
      $category: String
    ) {
      PostSearch(
        limit: $limit
        lang: $lang
        featureDisplay: $featureDisplay
        page: $page
        category: $category
      ) {
        totalRecords
        data {
          id
          slug
          lang
          title
          excerpt
          category
          content
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
    featureDisplay,
  };

  const { PostSearch: posts } = await getGraphQLClient(context).request(
    query,
    variables
  );
  return posts;
};

export const getRelatedPosts = async ({ limit = 3, category, id }, context) => {
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

  const { PostGetRelated: posts } = await getGraphQLClient(context).request(
    query,
    variables
  );
  return posts;
};
