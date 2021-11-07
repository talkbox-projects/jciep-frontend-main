import { VStack } from "@chakra-ui/react";
import SectionCard from "../fragments/SectionCard";
import React from "react";
import IdentityBiographySectionViewer from "./IdentityBiographySectionViewer";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import IdentityBiographySectionEditor from "./IdentityBiographySectionEditor";

const IdentityBiographySection = () => {
  const { editSection } =
    IdentityProfileStore.useContext();
  const isEditing = editSection === "biography";

  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        {isEditing ? (
          <IdentityBiographySectionEditor />
        ) : (
          <IdentityBiographySectionViewer />
        )}
      </VStack>
    </SectionCard>
  );
};

export default IdentityBiographySection;
