import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const OrganizationMemberRemove = async (
  { organizationId, identityId },
  context
) => {
  const query = gql`
    mutation OrganizationMemberRemove($organizationId: ID!, $identityId: ID!) {
      OrganizationMemberRemove(
        organizationId: $organizationId
        identityId: $identityId
      )
    }
  `;

  const data = await getGraphQLClient(context).request(query, {
    organizationId,
    identityId,
  });

  return data?.OrganizationMemberRemove;
};

export default OrganizationMemberRemove;
