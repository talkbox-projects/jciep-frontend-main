import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const UserPasswordReset = async ({ token, password }, context) => {
  const query = gql`
    mutation UserPasswordReset($token: String!, $password: String!) {
      UserPasswordReset(token: $token, password: $password)
    }
  `;

  const data = await getGraphQLClient(context).request(query, {
    token,
    password,
  });

  return data?.UserPasswordReset;
};

export default UserPasswordReset;
