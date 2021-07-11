import { VStack } from "@chakra-ui/react";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import SectionCard from "../fragments/SectionCard";
import ExperienceSectionEditor from "./ExperienceSectionEditor";
import ExperienceSectionViewer from "./ExperienceSectionViewer";

const ExperienceSection = () => {
  const { editSection } = IdentityProfileStore.useContext();

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
