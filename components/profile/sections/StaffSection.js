import { VStack } from "@chakra-ui/react";
import BannerFragment from "../fragments/BannerFragment";
import SectionCard from "../fragments/SectionCard";
import StaffSectionEditor from "./StaffSectionEditor";
import StaffSectionViewer from "./StaffSectionViewer";
import ProfileStore from "../../../store/ProfileStore";

const StaffSection = () => {
  const { editSection } = ProfileStore.useContext();
  const isEditing = editSection === "profile";
  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        <BannerFragment />
        {isEditing ? <StaffSectionEditor /> : <StaffSectionViewer />}
      </VStack>
    </SectionCard>
  );
};

export default StaffSection;
