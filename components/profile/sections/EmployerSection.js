import { VStack } from "@chakra-ui/react";
import BannerFragment from "../fragments/BannerFragment";
import SectionCard from "../fragments/SectionCard";
import EmployerSectionEditor from "./EmployerSectionEditor";
import EmployerSectionViewer from "./EmployerSectionViewer";
import IdentityProfileStore from "../../../store/IdentityProfileStore";

const EmployerSection = () => {
  const { page, identity, saveIdentity, editSection } =
    IdentityProfileStore.useContext();
  const isEditing = editSection === "profile";
  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        <BannerFragment {...{ page, entity: identity, save: saveIdentity }} />
        {isEditing ? <EmployerSectionEditor /> : <EmployerSectionViewer />}
      </VStack>
    </SectionCard>
  );
};

export default EmployerSection;
