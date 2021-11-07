import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const PortfolioPublishReject = async ({ organizationId, identityId }, context) => {
  const query = gql`
    mutation PortfolioPublishReject($organizationId: ID!, $identityId: ID!) {
      PortfolioPublishReject(organizationId: $organizationId, identityId: $identityId)
    }
  `;

  const data = await getGraphQLClient(context).request(query, { organizationId, identityId });

  return data?.PortfolioPublishReject;
};

export default PortfolioPublishReject;
