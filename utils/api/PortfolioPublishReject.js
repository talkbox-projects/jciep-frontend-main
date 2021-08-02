import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const PortfolioPublishReject = async ({ id }, context) => {
  const query = gql`
    mutation PortfolioPublishReject($id: ID!) {
      PortfolioPublishReject(id: $id)
    }
  `;

  const data = await getGraphQLClient(context).request(query, { id });

  return data?.PortfolioPublishReject;
};

export default PortfolioPublishReject;
