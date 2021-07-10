import { Text, Button, HStack, VStack } from "@chakra-ui/react";
import wordExtractor from "../../../utils/wordExtractor";
import SectionCard from "../fragments/SectionCard";
import { RiEdit2Line } from "react-icons/ri";
import BiographySectionViewer from "./BiographySectionViewer";
import ProfileStore from "../../../store/ProfileStore";
import BiographySectionEditor from "./BiographySectionEditor";

const BiographySection = () => {
  const { page, editSection, setEditSection } = ProfileStore.useContext();
  const isEditing = editSection === "biography";

  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        {isEditing ? <BiographySectionEditor /> : <BiographySectionViewer />}
      </VStack>
    </SectionCard>
  );
};

export default BiographySection;
