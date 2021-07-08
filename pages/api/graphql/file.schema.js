import gql from "graphql-tag";

export default gql`
  scalar Upload
  type File {
    id: String!
    url: String!
    contentType: String!
    fileSize: Int!
  }

  scalar FileInput

  type Mutation {
    FileUpload(files: FileInput!): [File]
  }
`;
