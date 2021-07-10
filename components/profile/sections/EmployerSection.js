import { VStack } from "@chakra-ui/react";
import BannerFragment from "../fragments/BannerFragment";
import SectionCard from "../fragments/SectionCard";
import EmployerSectionEditor from "./EmployerSectionEditor";
import EmployerSectionViewer from "./EmployerSectionViewer";
import ProfileStore from "../../../store/ProfileStore";

const EmployerSection = () => {
  const { editSection } = ProfileStore.useContext();
  const isEditing = editSection === "profile";
  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        <BannerFragment />
        {isEditing ? <EmployerSectionEditor /> : <EmployerSectionViewer />}
      </VStack>
    </SectionCard>
  );
};

export default EmployerSection;
