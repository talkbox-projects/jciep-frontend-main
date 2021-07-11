import { Text, Button, HStack, VStack } from "@chakra-ui/react";
import wordExtractor from "../../../utils/wordExtractor";
import SectionCard from "../fragments/SectionCard";
import { RiEdit2Line } from "react-icons/ri";
import OrganizationBiographySectionViewer from "./OrganizationBiographySectionViewer";
import OrganizationProfileStore from "../../../store/OrganizationProfileStore";
import OrganizationBiographySectionEditor from "./OrganizationBiographySectionEditor";

const OrganizationBiographySection = () => {
  const { page, editSection, setEditSection } =
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
