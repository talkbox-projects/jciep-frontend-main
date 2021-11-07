import { VStack } from "@chakra-ui/react";
import React from "react";
import BannerFragment from "../fragments/BannerFragment";
import SectionCard from "../fragments/SectionCard";
import NgoSectionEditor from "./NgoSectionEditor";
import NgoSectionViewer from "./NgoSectionViewer";
import OrganizationProfileStore from "../../../store/OrganizationProfileStore";

const NgoSection = () => {
  const {
    page,
    organization,
    saveOrganization,
    editSection,
    isAdmin,
    editable,
  } = OrganizationProfileStore.useContext();
  const isEditing = editSection === "profile";
  return (
    <SectionCard>
      <VStack spacing={1} align="stretch" overflow="hidden" borderRadius="10px">
        <BannerFragment
          {...{
            enableBannerMedia: false,
            page,
            entity: organization,
            save: saveOrganization,
            profilePicPropName: "logo",
            editable: isAdmin || editable,
          }}
        />
        {isEditing ? <NgoSectionEditor /> : <NgoSectionViewer />}
      </VStack>
    </SectionCard>
  );
};

export default NgoSection;
