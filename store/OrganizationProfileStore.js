import constate from "constate";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import organizationGet from "../utils/api/organizationGet";
import organizationUpdate from "../utils/api/OrganizationUpdate";
import { useAppContext } from "./AppStore";

const [Provider, useContext] = constate(
  ({ organization: _organization, page, enums, editable = true }) => {
    const [organization, setOrganization] = useState(_organization);
    const [editSection, setEditSection] = useState(null);

    const removeEditSection = useCallback(() => {
      setEditSection(null);
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

    const refreshOrganization = useCallback(async () => {
      const organization = await organizationGet({ id: router.query.id });
      setOrganization(organization);
    }, []);

    return {
      editSection,
      setEditSection,
      removeEditSection,

      organization,
      saveOrganization,
      setOrganization,
      refreshOrganization,

      editable,

      page,
      enums,
    };
  }
);

const OrganizationProfileStore = { Provider, useContext };

export default OrganizationProfileStore;
