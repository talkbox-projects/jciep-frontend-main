import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const PortfolioPublishRequest = async ({ organizationId, identityId }, context) => {
  const query = gql`
    mutation PortfolioPublishRequest($organizationId: ID, $identityId: ID!) {
      PortfolioPublishRequest(organizationId: $organizationId, identityId: $identityId)
    }
  `;

  const data = await getGraphQLClient(context).request(query, { organizationId, identityId });

  return data?.PortfolioPublishRequest;
};

export default PortfolioPublishRequest;
