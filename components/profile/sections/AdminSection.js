import { VStack } from "@chakra-ui/react";
import BannerFragment from "../fragments/BannerFragment";
import SectionCard from "../fragments/SectionCard";
import StaffSectionEditor from "./StaffSectionEditor";
import StaffSectionViewer from "./StaffSectionViewer";
import IdentityProfileStore from "../../../store/IdentityProfileStore";

const StaffSection = () => {
  const { page, identity, saveIdentity, editSection, editable } =
    IdentityProfileStore.useContext();
  const isEditing = editSection === "profile";
  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        <BannerFragment
          {...{ page, entity: identity, save: saveIdentity, editable }}
        />
        {isEditing ? <StaffSectionEditor /> : <StaffSectionViewer />}
      </VStack>
    </SectionCard>
  );
};

export default StaffSection;
