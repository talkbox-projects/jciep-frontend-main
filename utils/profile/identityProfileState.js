import { gql } from "graphql-request";
import constate from "constate";
import { useCallback } from "react";
import { getGraphQLClient } from "../apollo";

const [IdentityProfileProvider, useIdentityProfileContext] = constate(
  ({ page, enums, editable, identity, setIdentity }) => {
    const onIdentityUpdate = useCallback(
      async (partialIdentity) => {
        try {
          const mutation = gql`
            mutation IdentityUpdate($input: IdentityUpdateInput!) {
              IdentityUpdate(input: $input) {
                id
              }
            }
          `;
          const variables = {
            input: {
              id: identity?.id,
              ...partialIdentity,
            },
          };

          const data = await getGraphQLClient().request(mutation, variables);
          console.log(partialIdentity);
          setIdentity((_) => {
            return { ..._, ...partialIdentity };
          });
        } catch (e) {
          console.error(e);
        }
      },
      [setIdentity, identity]
    );
    return { page, enums, editable, identity, onIdentityUpdate };
  }
);

export { IdentityProfileProvider, useIdentityProfileContext };
