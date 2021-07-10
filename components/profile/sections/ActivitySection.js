import { VStack } from "@chakra-ui/react";
import ProfileStore from "../../../store/ProfileStore";
import SectionCard from "../fragments/SectionCard";
import ActivitySectionEditor from "./ActivitySectionEditor";
import ActivitySectionViewer from "./ActivitySectionViewer";

const ActivitySection = () => {
  const { editSection } = ProfileStore.useContext();

  const isEditing = editSection === "activity";
  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        {isEditing ? <ActivitySectionEditor /> : <ActivitySectionViewer />}
      </VStack>
    </SectionCard>
  );
};

export default ActivitySection;
