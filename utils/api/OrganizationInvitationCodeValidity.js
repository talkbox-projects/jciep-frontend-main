import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const OrganizationInvitationCodeValidity = async (params, context) => {
  const { invitationCode, organizationType } = params;
  console.error({ invitationCode, identityId });
  const query = gql`
    mutation OrganizationInvitationCodeValidity(
      $invitationCode: String!
      $organizationType: EnumOrganizationType!
    ) {
      OrganizationInvitationCodeValidity(
        invitationCode: $invitationCode
        organizationType: $organizationType
      )
    }
  `;

  const data = await getGraphQLClient(context).request(query, {
    invitationCode,
    organizationType,
  });

  return data?.OrganizationMemberJoin;
};

export default OrganizationInvitationCodeValidity;
