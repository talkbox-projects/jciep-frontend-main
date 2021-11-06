import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const UserLogout = async (params, context) => {
  const mutation = gql`
    mutation UserLogout {
      UserLogout
    }
  `;

  const data = await getGraphQLClient(context).request(mutation);

  return data?.UserLogout;
};

export default UserLogout;
