import constate from "constate";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import identityGet from "../utils/api/IdentityGet";
import identityUpdate from "../utils/api/IdentityUpdate";
import { useAppContext } from "./AppStore";

const [Provider, useContext] = constate(
  ({
    identity: _identity,
    page,
    enums,
    userFieldVisible = false,
    editable = true,
  }) => {
    const [identity, setIdentity] = useState(_identity);
    const [editSection, setEditSection] = useState(null);
    const { identity: myIdentity } = useAppContext();
    const isAdmin = myIdentity?.type === "admin";
    const router = useRouter();

    const removeEditSection = useCallback(() => {
      setEditSection(null);
    }, []);

    const saveIdentity = useCallback(
      async (partialIdentity) => {
        try {
          const data = await identityUpdate({ input: partialIdentity });
          console.error(partialIdentity);
          setIdentity(data);
        } catch (e) {
          console.error(e);
        }
      },
      [setIdentity, identity]
    );

    const refreshIdentity = useCallback(async () => {
      const identity = await identityGet({ id: router.query.id });
      setIdentity(identity);
    }, []);

    useEffect(() => {
      setIdentity(_identity);
    }, [_identity]);

    return {
      editSection,
      setEditSection,
      removeEditSection,

      identity,
      saveIdentity,
      refreshIdentity,

      editable,
      isAdmin,
      userFieldVisible,

      page,
      enums,
    };
  }
);

const IdentityProfileStore = { Provider, useContext };

export default IdentityProfileStore;
