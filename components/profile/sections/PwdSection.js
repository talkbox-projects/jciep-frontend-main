import { VStack } from "@chakra-ui/react";
import BannerFragment from "../fragments/BannerFragment";
import SectionCard from "../fragments/SectionCard";
import PwdSectionEditor from "./PwdSectionEditor";
import PwdSectionViewer from "./PwdSectionViewer";
import ProfileStore from "../../../store/ProfileStore";

const PwdSection = () => {
  const { editSection } = ProfileStore.useContext();
  const isEditing = editSection === "profile";
  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        <BannerFragment />
        {isEditing ? <PwdSectionEditor /> : <PwdSectionViewer />}
      </VStack>
    </SectionCard>
  );
};

export default PwdSection;
