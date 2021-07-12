import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const OrganizationMemberInvite = async ({ input }, context) => {
  const query = gql`
    mutation OrganizationMemberInvite($input: OrganizationMemberInviteInput!) {
      OrganizationMemberInvite(input: $input)
    }
  `;

  const data = await getGraphQLClient(context).request(query, { input });

  return data?.OrganizationMemberInvite;
};

export default OrganizationMemberInvite;
