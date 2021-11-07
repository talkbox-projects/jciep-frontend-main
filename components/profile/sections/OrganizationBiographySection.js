import React from "react";
import { VStack } from "@chakra-ui/react";
import SectionCard from "../fragments/SectionCard";
import OrganizationBiographySectionViewer from "./OrganizationBiographySectionViewer";
import OrganizationProfileStore from "../../../store/OrganizationProfileStore";
import OrganizationBiographySectionEditor from "./OrganizationBiographySectionEditor";

const OrganizationBiographySection = () => {
  const { editSection } =
    OrganizationProfileStore.useContext();
  const isEditing = editSection === "biography";

  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        {isEditing ? (
          <OrganizationBiographySectionEditor />
        ) : (
          <OrganizationBiographySectionViewer />
        )}
      </VStack>
    </SectionCard>
  );
};

export default OrganizationBiographySection;
