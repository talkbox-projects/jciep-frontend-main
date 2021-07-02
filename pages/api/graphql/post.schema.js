import gql from "graphql-tag";

export default gql`
  enum PostStatus {
    draft
    published
    removed
  }

  type PostReference {
    label: String
    url: String
  }

  "An post (unique key = id + lang)"
  type Post {
    id: ID!
    lang: Language!
    slug: String
    publishDate: Timestamp
    title: String
    excerpt: String
    coverImage: String
    category: String
    tags: [String]
    references: [PostReference]
    status: PostStatus!
    featureDisplay: Boolean
    content: JsonContent
    viewCount: Int!
  }

  input PostReferenceInput {
    label: String
    url: String
  }

  input PostCreateInput {
    lang: Language!
    slug: String
    title: String
    publishDate: Timestamp
    excerpt: String
    coverImage: String
    category: String
    featureDisplay: Boolean
    content: JsonContent
    tags: [String]
    references: [PostReferenceInput]
  }

  input PostUpdateInput {
    id: ID!
    lang: Language!
    slug: String
    title: String
    publishDate: Timestamp
    excerpt: String
    coverImage: String
    category: String
    featureDisplay: Boolean
    content: JsonContent
    status: PostStatus
    tags: [String]
    references: [PostReferenceInput]
  }

  type FilteredPosts {
    data: [Post]
    totalRecords: Int
  }

  type Query {
    PostSearch(
      lang: Language
      status: [PostStatus]
      featureDisplay: Boolean
      category: String
      limit: Int!
      page: Int!
    ): FilteredPosts

    PostGet(idOrSlug: String!, lang: Language!): Post
    "get related posts for post specfiied by id. 延伸閱讀"
    PostGetRelated(id: ID!, category: String, limit: Int!): [Post]
    "熱門文章 limit default = 3"
    PostGetHotest(limit: Int!): [Post]
  }

  type Mutation {
    PostCreate(input: PostCreateInput): Post @auth(identityTypes: [staff])
    PostUpdate(input: PostUpdateInput): Post @auth(identityTypes: [staff])
    PostDelete(id: ID): Boolean @auth(identityTypes: [staff])

    PostRead(id: ID): Boolean
  }
`;
