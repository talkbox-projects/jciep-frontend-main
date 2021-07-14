import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const IdentityRemove = async ({ id }, context) => {
  const query = gql`
    mutation IdentityRemove($id: ID!) {
      IdentityRemove(id: $id)
    }
  `;

  const data = await getGraphQLClient(context).request(query, { id });

  return data?.IdentityRemove;
};

export default IdentityRemove;
