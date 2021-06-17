import gql from "graphql-tag";

export default gql`
  type Configuration {
    id: ID!
    key: String!
    lang: Language!
    value: JsonContent
  }

  input ConfigurationUpdateInput {
    key: String!
    lang: Language!
    value: JsonContent
  }

  type Query {
    ConfigurationGet(key: String!, lang: Language!): Configuration
  }

  type Mutation {
    ConfigurationUpdate(input: ConfigurationUpdateInput): Configuration
  }
`;
