import { Text, Button, HStack, VStack } from "@chakra-ui/react";
import wordExtractor from "../../../utils/wordExtractor";
import SectionCard from "../fragments/SectionCard";
import { RiEdit2Line } from "react-icons/ri";
import IdentityBiographySectionViewer from "./IdentityBiographySectionViewer";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import IdentityBiographySectionEditor from "./IdentityBiographySectionEditor";

const IdentityBiographySection = () => {
  const { page, editSection, setEditSection } =
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
