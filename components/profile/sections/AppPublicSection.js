import { VStack } from "@chakra-ui/react";
import React from "react";
import AppBannerFragment from "../fragments/AppBannerFragment";
import SectionCard from "../fragments/SectionCard";
import PublicSectionEditor from "./PublicSectionEditor";
import PublicSectionViewer from "./PublicSectionViewer";
import IdentityProfileStore from "../../../store/IdentityProfileStore";

const AppPublicSection = () => {
  const { page, identity, saveIdentity, editSection, editable } =
    IdentityProfileStore.useContext();
  const isEditing = editSection === "profile";
  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        <AppBannerFragment
          {...{ page, entity: identity, save: saveIdentity, editable }}
        />
        {isEditing ? <PublicSectionEditor /> : <PublicSectionViewer />}
      </VStack>
    </SectionCard>
  );
};

export default AppPublicSection;
