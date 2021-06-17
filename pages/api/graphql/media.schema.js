import gql from "graphql-tag";

export default gql`
  scalar Upload
  type File {
    filename: String!
    contentType: String!
    directory: String!
  }

  type MediaListOutput {
    data: [File]
    count: Int
  }

  type Query {
    MediaList(directory: String!, offset: Int!, limit: Int!): MediaListOutput
  }

  type Mutation {
    MediaUpload(file: Upload!, directory: String!): File!
    MediaDelete(path: String!): Boolean
  }
`;
