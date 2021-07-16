import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const OrganizationInvitationCodeValidity = async (params, context) => {
  const { invitationCode, organizationType } = params;
  const query = gql`
    query OrganizationInvitationCodeValidity(
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

  return data?.OrganizationInvitationCodeValidity;
};

export default OrganizationInvitationCodeValidity;
