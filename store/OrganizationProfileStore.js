import constate from "constate";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import organizationGet from "../utils/api/organizationGet";
import organizationUpdate from "../utils/api/OrganizationUpdate";
import { useAppContext } from "./AppStore";

const [Provider, useContext] = constate(
  ({ organization: _organization, page, enums }) => {
    const [organization, setOrganization] = useState(_organization);
    const [editSection, setEditSection] = useState(null);

    const removeEditSection = useCallback(() => {
      setEditSection(null);
    }, []);

    const editable = useMemo(() => {
      return true;
    }, []);

    const router = useRouter();
    const saveOrganization = useCallback(
      async (partialOrganization) => {
        try {
          const data = await organizationUpdate({ input: partialOrganization });
          setOrganization(data);
        } catch (e) {
          console.error(e);
        }
      },
      [setOrganization, organization]
    );

    useEffect(() => {
      (async () => {
        const data = await organizationGet({ id: router.query.id });
        setOrganization(data);
      })();
    }, [router.query.id]);

    return {
      editSection,
      setEditSection,
      removeEditSection,

      organization,
      saveOrganization,

      editable,

      page,
      enums,
    };
  }
);

const OrganizationProfileStore = { Provider, useContext };

export default OrganizationProfileStore;
