import gql from "graphql-tag";

export default gql`
  enum PostStatus {
    draft
    published
    removed
  }

  "An post (unique key = id + lang)"
  type Post {
    id: ID!
    lang: Language!
    slug: String
    publishDate: Timestamp
    title: String
    excerpt: String
    coverImage: File
    category: String
    tag: [String]
    status: PostStatus!
    content: JsonContent
    viewCount: Int!
  }

  input PostCreateInput {
    lang: Language!
    slug: String
    title: String
    publishDate: Timestamp
    excerpt: String
    coverImage: FileInput
    category: String
    content: JsonContent
  }

  input PostUpdateInput {
    id: ID!
    lang: Language!
    slug: String
    title: String
    publishDate: Timestamp
    excerpt: String
    coverImage: FileInput
    category: String
    content: JsonContent
    status: PostStatus
  }

  type Query {
    PostSearch(
      lang: Language!
      status: [PostStatus]
      category: String
      limit: Int!
      offset: Int!
    ): [Post]

    PostGet(idOrSlug: String!, lang: Language!): Post
    "get related posts for post specfiied by id. 延伸閱讀"
    PostGetRelated(id: ID): [Post]
    "熱門文章 limit default = 3"
    PostGetLatest(limit: Int): [Post]
  }

  type Mutation {
    PostCreate(input: PostCreateInput): Post @auth(roles: [staff])
    PostUpdate(input: PostUpdateInput): Post @auth(roles: [staff])
    PostDelete(id: ID): Boolean @auth(roles: [staff])

    PostRead(id: ID): Boolean
  }
`;
