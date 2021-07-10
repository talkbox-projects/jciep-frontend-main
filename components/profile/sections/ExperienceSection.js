import { VStack } from "@chakra-ui/react";
import ProfileStore from "../../../store/ProfileStore";
import SectionCard from "../fragments/SectionCard";
import ExperienceSectionEditor from "./ExperienceSectionEditor";
import ExperienceSectionViewer from "./ExperienceSectionViewer";

const ExperienceSection = () => {
  const { editSection } = ProfileStore.useContext();

  const isEditing = editSection === "experience";
  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        {isEditing ? <ExperienceSectionEditor /> : <ExperienceSectionViewer />}
      </VStack>
    </SectionCard>
  );
};

export default ExperienceSection;
