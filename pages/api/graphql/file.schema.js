import gql from "graphql-tag";

export default gql`
  scalar Upload
  scalar FileInput

  type File {
    id: String!
    url: String!
    contentType: String!
    fileSize: Int!
  }

  type Mutation {
    FileUpload(files: FileInput!): [File]
  }

  type FileMetaInput {
    id: String!
    url: String!
    title: String
    description: String
  }
`;
