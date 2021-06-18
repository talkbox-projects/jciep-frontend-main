import gql from "graphql-tag";

export default gql`
  directive @auth(roles: [Role]) on OBJECT | FIELD_DEFINITION

  enum Role {
    staff
    pwd
    employer
    ngo
    public
  }
  enum EmploymentType {
    freelance
    contract
    fullTime
    partTime
  }
  enum Industry {
    designArt
    graphicDesign
    illustrationDrawing
    animationDesign
    webDesign
  }
  enum School {
    hku
  }
  enum Degree {
    bba
  }
  enum Language {
    en
    zh
  }

  scalar Upload
  scalar FileInput
  scalar Timestamp
  scalar JsonContent
  scalar Timestamp

  enum District {
    central_east
  }

  input MediaInput {
    input: Upload
    title: String
    description: String
  }

  type Media {
    id: String!
    url: String!
    title: String
    description: String
  }

  type File {
    id: String!
    url: String!
  }

  type MultiLangString {
    en: String
    cn: String
    zh: String
  }
`;
