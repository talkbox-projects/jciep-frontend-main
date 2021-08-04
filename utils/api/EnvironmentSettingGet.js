import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const environmentSettingGet = async (params = null, context = null) => {
  const query = gql`
    query {
      EnvironmentSettingGet {
        facebookAppId
        facebookAppRedirectUri
        googleClientId
      }
    }
  `;

  const data = await getGraphQLClient(context).request(query);

  return data?.EnvironmentSettingGet;
};

export default environmentSettingGet;
