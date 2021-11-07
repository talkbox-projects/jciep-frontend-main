import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const PortfolioPublishApprove = async ({ organizationId, identityId }, context) => {
  const query = gql`
    mutation PortfolioPublishApprove($organizationId: ID!, $identityId: ID!) {
      PortfolioPublishApprove(organizationId: $organizationId, identityId: $identityId)
    }
  `;

  const data = await getGraphQLClient(context).request(query, { organizationId, identityId });

  return data?.PortfolioPublishApprove;
};

export default PortfolioPublishApprove;
