import gql from "graphql-tag";

export default gql`
  scalar Upload
  scalar FileUpload

  input FileInput {
    id: String
    url: String
    contentType: String
    fileSize: Int
  }

  type File {
    id: String
    url: String
    contentType: String
    fileSize: Int
  }

  type Mutation {
    FileUpload(files: FileUpload!): [File]
  }

  input FileMetaInput {
    file: FileInput
    videoUrl: String
    title: String
    description: String
  }

  type FileMeta {
    file: File
    videoUrl: String
    title: String
    description: String
  }
`;
