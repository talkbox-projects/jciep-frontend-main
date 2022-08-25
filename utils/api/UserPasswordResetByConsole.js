import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const UserPasswordResetByConsole = async ({ email, phone, password }, context) => {
  const query = gql`
    mutation UserPasswordResetByConsole($email: String!, $phone: String!, $password: String!) {
        UserPasswordResetByConsole(email: $email, phone: $phone, password: $password)
    }
  `;

  const data = await getGraphQLClient(context).request(query, {
    email,
    phone,
    password,
  });

  return data?.UserPasswordResetByConsole;
};

export default UserPasswordResetByConsole;
