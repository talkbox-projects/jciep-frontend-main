import gql from "graphql-tag";

export default gql`
  type Authur {
    id: ID!
    name: MultiLangString!
    description: String!
    avatar: File!
  }

  type Category {
    id: ID!
    icon: File!
    color: String!
    name: MultiLangString!
  }

  enum PostStatus {
    DRAFT
    PUBLISHED
    REMOVED
  }

  "An post (unique key = id + lang)"
  type Post {
    id: ID!
    lang: Language!
    publishDate: String
    title: String
    excerpt: String
    coverImage: File
    authur: Authur
    category: [Category]!
    tag: [String]!
    status: PostStatus!
    content: JsonContent
    viewCount: Int!
  }

  input PostCreateInput {
    lang: Language!
    id: ID
    title: String
    publishDate: String
    excerpt: String
    coverImage: FileInput
    authur: ID
    category: [ID]
    status: PostStatus!
    content: JsonContent
  }

  input PostUpdateInput {
    id: ID!
    lang: Language!
    title: String
    publishDate: String
    excerpt: String
    coverImage: FileInput
    authur: ID
    category: [ID]
    status: PostStatus!
    content: JsonContent
  }

  type Query {
    PostSearch(
      lang: Language!
      status: [PostStatus]
      authur: [ID]
      category: [ID]!
      limit: Int!
      afterId: ID
    ): [Post]

    PostGet(ids: [ID]!): Post
    "get related posts for post specfiied by id. 延伸閱讀"
    PostGetRelated(id: ID): [Post]
    "熱門文章 limit default = 3"
    PostGetLatest(limit: Int): [Post]
  }

  type Mutation {
    PostCreate(data: PostCreateInput): Post @auth(roles: [staff])
    PostUpdate(data: PostUpdateInput): Post @auth(roles: [staff])
    PostDelete(id: ID): Boolean @auth(roles: [staff])

    PostRead(id: ID): Boolean
    PostCategoryList: [Category]
  }
`;
