import gql from "graphql-tag";

export default gql`
  scalar Upload
  type MediaFile {
    id: String!
    url: String!
    filename: String!
    contentType: String!
    directory: String!
  }

  type MediaListOutput {
    data: [MediaFile]
    count: Int
  }

  type Query {
    MediaList(directory: String!, offset: Int!, limit: Int!): MediaListOutput
  }

  type Mutation {
    MediaUpload(file: Upload!, directory: String!): MediaFile!
    MediaDelete(path: String!): Boolean
  }
`;
