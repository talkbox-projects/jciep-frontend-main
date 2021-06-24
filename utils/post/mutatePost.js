import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

export const updateReadCount = async (id) => {
  console.log("%%%% using id", id)
  try {
    const mutation = gql`
      mutation PostRead($id: ID) {
        PostRead(id: $id) 
      }
    `;

    const variables = {
      id
    };
    await getGraphQLClient().request(mutation, variables);
    return
  } catch (err) {
    console.log("Error updating count", err);
  }
}