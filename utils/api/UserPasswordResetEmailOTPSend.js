import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const UserPasswordResetEmailOTPSend = async ({ email }, context) => {
  const query = gql`
    mutation UserPasswordResetEmailOTPSend($email: String!) {
        UserPasswordResetEmailOTPSend(email: $email)
    }
  `;

  const data = await getGraphQLClient(context).request(query, { email });

  return data?.UserPasswordResetEmailOTPSend;
};

export default UserPasswordResetEmailOTPSend;
