import { VStack } from "@chakra-ui/react";
import BannerFragment from "../fragments/BannerFragment";
import SectionCard from "../fragments/SectionCard";
import PublicSectionEditor from "./PublicSectionEditor";
import PublicSectionViewer from "./PublicSectionViewer";
import ProfileStore from "../../../store/ProfileStore";

const PublicSection = () => {
  const { editSection } = ProfileStore.useContext();
  const isEditing = editSection === "profile";
  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        <BannerFragment />
        {isEditing ? <PublicSectionEditor /> : <PublicSectionViewer />}
      </VStack>
    </SectionCard>
  );
};

export default PublicSection;
