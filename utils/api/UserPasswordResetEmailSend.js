import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const UserPasswordResetEmailSend = async ({ email }, context) => {
  const query = gql`
    mutation UserPasswordResetEmailSend($email: String!) {
      UserPasswordResetEmailSend(email: $email)
    }
  `;

  const data = await getGraphQLClient(context).request(query, { email });

  return data?.UserPasswordResetEmailSend;
};

export default UserPasswordResetEmailSend;
