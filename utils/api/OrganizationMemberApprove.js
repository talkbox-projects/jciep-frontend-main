import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const OrganizationMemberApprove = async (
  { organizationId, identityId },
  context
) => {
  const query = gql`
    mutation OrganizationMemberApprove($organizationId: ID!, $identityId: ID!) {
      OrganizationMemberApprove(
        organizationId: $organizationId
        identityId: $identityId
      )
    }
  `;

  const data = await getGraphQLClient(context).request(query, {
    organizationId,
    identityId,
  });

  return data?.OrganizationMemberApprove;
};

export default OrganizationMemberApprove;
