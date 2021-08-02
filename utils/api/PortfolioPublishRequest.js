import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const PortfolioPublishRequest = async ({ id }, context) => {
  const query = gql`
    mutation PortfolioPublishRequest($id: ID!) {
      PortfolioPublishRequest(id: $id)
    }
  `;

  const data = await getGraphQLClient(context).request(query, { id });

  return data?.PortfolioPublishRequest;
};

export default PortfolioPublishRequest;
