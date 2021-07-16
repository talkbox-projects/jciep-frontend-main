import gql from "graphql-tag";

export default gql`
  """
  Restricted to particular identity type(s) of user
  If identityTypes is empty, check whether user is logged in
  """
  directive @auth(
    identityTypes: [EnumIdentityType]
  ) on OBJECT | FIELD_DEFINITION

  enum Language {
    en
    zh
  }

  scalar Timestamp
  scalar JsonContent

  type MultiLangString {
    en: String
    cn: String
    zh: String
  }
`;
