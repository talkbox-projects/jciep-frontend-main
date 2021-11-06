import gql from "graphql-tag";

export default gql`
  "unique key = key + lang"
  type Page {
    id: ID!
    "unique page key"
    key: String!
    lang: Language

    "follow page structure (defined in tinaCMS)"
    content: JsonContent
  }

  input PageUpdateInput {
    key: String!
    lang: Language
    content: JsonContent
  }

  type Query {
    PageGet(key: String!, lang: Language!): Page
  }
  type Mutation {
    PageUpdate(input: PageUpdateInput): Page
  }
`;
