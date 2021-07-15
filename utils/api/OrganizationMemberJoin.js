import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const OrganizationMemberJoin = async (params, context) => {
  const { invitationCode, identityId } = params;
  console.error({ invitationCode, identityId });
  const query = gql`
    mutation OrganizationMemberJoin(
      $invitationCode: String!
      $identityId: ID!
    ) {
      OrganizationMemberJoin(
        invitationCode: $invitationCode
        identityId: $identityId
      )
    }
  `;

  const data = await getGraphQLClient(context).request(query, {
    invitationCode,
    identityId,
  });

  return data?.OrganizationMemberJoin;
};

export default OrganizationMemberJoin;
