import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const OrganizationRemove = async ({ id }, context) => {
  const query = gql`
    mutation OrganizationRemove($id: ID!) {
      OrganizationRemove(id: $id)
    }
  `;

  const data = await getGraphQLClient(context).request(query, { id });

  return data?.OrganizationRemove;
};

export default OrganizationRemove;
