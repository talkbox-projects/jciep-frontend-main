import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const PortfolioUnpublish = async ({ id }, context) => {
  const query = gql`
    mutation PortfolioUnpublish($id: ID!) {
      PortfolioUnpublish(id: $id)
    }
  `;

  const data = await getGraphQLClient(context).request(query, { id });

  return data?.PortfolioPublishUnpublish;
};

export default PortfolioUnpublish;
