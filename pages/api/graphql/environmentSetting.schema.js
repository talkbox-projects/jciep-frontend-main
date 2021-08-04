import gql from "graphql-tag";

export default gql`
  type EnvironmentSetting {
    facebookAppId: String
    facebookAppRedirectUri: String
    googleClientId: String
  }

  type Query {
    EnvironmentSettingGet: EnvironmentSetting
  }
`;
