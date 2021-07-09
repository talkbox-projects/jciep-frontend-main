import constate from "constate";
import { useCallback, useMemo, useState } from "react";
import { useAppContext } from "./AppStore";

const [Provider, useContext] = constate(
  ({ identity: _identity, page, enums }) => {
    const { user } = useAppContext();
    const [identity, setIdentity] = useState(_identity);
    const [editSection, setEditSection] = useState(null);

    const removeEditSection = useCallback(() => {
      setEditSection(null);
    }, []);

    const editable = useMemo(() => {
      return true;
    }, []);

    const saveIdentity = useCallback(
      async (partialIdentity) => {
        try {
          const mutation = gql`
            mutation IdentityUpdate($input: IdentityUpdateInput!) {
              IdentityUpdate(input: $input) {
                id
              }
            }
          `;

          const data = await getGraphQLClient().request(mutation, {
            input: {
              id: identity?.id,
              ...partialIdentity,
            },
          });
          setIdentity((_) => ({ ..._, ...(data?.IdentityUpdate ?? {}) }));
        } catch (e) {
          console.error(e);
        }
      },
      [setIdentity, identity]
    );

    return {
      editSection,
      setEditSection,
      removeEditSection,

      identity,
      saveIdentity,

      editable,

      page,
      enums,
    };
  }
);

const ProfileStore = { Provider, useContext };

export default ProfileStore;
