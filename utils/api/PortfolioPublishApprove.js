import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const PortfolioPublishApprove = async ({ id }, context) => {
  const query = gql`
    mutation PortfolioPublishApprove($id: ID!) {
      PortfolioPublishApprove(id: $id)
    }
  `;

  const data = await getGraphQLClient(context).request(query, { id });

  return data?.PortfolioPublishApprove;
};

export default PortfolioPublishApprove;
