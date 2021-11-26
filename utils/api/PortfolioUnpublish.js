import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const PortfolioUnpublish = async ({ organizationId, identityId }, context) => {
  const query = gql`
    mutation PortfolioUnpublish($organizationId: ID, $identityId: ID!) {
      PortfolioUnpublish(organizationId: $organizationId, identityId: $identityId)
    }
  `;

  const data = await getGraphQLClient(context).request(query, { organizationId, identityId });

  return data?.PortfolioUnpublish;
};

export default PortfolioUnpublish;
