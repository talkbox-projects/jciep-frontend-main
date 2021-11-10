import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const UserPasswordResetPhoneSend = async ({ phone }, context) => {
  const query = gql`
    mutation UserPasswordResetPhoneSend($phone: String!) {
      UserPasswordResetPhoneSend(phone: $phone)
    }
  `;

  const data = await getGraphQLClient(context).request(query, { phone });

  return data?.UserPasswordResetPhoneSend;
};

export default UserPasswordResetPhoneSend;
