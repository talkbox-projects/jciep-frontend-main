import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

export const updateReadCount = async (id, context) => {
  try {
    const mutation = gql`
      mutation PostRead($id: ID) {
        PostRead(id: $id)
      }
    `;

    const variables = {
      id,
    };
    await getGraphQLClient(context).request(mutation, variables);
    return;
  } catch (err) {
    console.error("Error updating count", err);
  }
};
