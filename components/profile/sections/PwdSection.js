import { VStack } from "@chakra-ui/react";
import BannerFragment from "../fragments/BannerFragment";
import SectionCard from "../fragments/SectionCard";
import PwdSectionEditor from "./PwdSectionEditor";
import PwdSectionViewer from "./PwdSectionViewer";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import React from "react";

const PwdSection = () => {
  const { page, identity, saveIdentity, editSection, editable } =
    IdentityProfileStore.useContext();
  const isEditing = editSection === "profile";
  return (
    <SectionCard>
      <VStack spacing={1} align="stretch" overflow="hidden" borderRadius="10px">
        <BannerFragment
          {...{ page, entity: identity, save: saveIdentity, editable }}
        />
        {isEditing ? <PwdSectionEditor /> : <PwdSectionViewer />}
      </VStack>
    </SectionCard>
  );
};

export default PwdSection;
