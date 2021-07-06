import gql from "graphql-tag";

export default gql`
  """
  Restricted to particular identity type(s) of user
  If identityTypes is empty, check whether user is logged in
  """
  directive @auth(
    identityTypes: [EnumIdentityType]
  ) on OBJECT | FIELD_DEFINITION

  enum Role {
    staff
    pwd
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
    centralAndWestern
    eastern
    southern
    wanChai
    shamShuiPo
    kowloonCity
    kwunTong
    wongTaiSin
    yauTsimMong
    islands
    kwaiTsing
    north
    saiKung
    shaTin
    taiPo
    tsuenWan
    tuenMun
    yuenLong
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
