import { VStack } from "@chakra-ui/react";
import BannerFragment from "../fragments/BannerFragment";
import SectionCard from "../fragments/SectionCard";
import PublicSectionEditor from "./PublicSectionEditor";
import PublicSectionViewer from "./PublicSectionViewer";
import IdentityProfileStore from "../../../store/IdentityProfileStore";

const PublicSection = () => {
  const { page, identity, saveIdentity, editSection, editable } =
    IdentityProfileStore.useContext();
  const isEditing = editSection === "profile";
  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        <BannerFragment
          {...{ page, entity: identity, save: saveIdentity, editable }}
        />
        {isEditing ? <PublicSectionEditor /> : <PublicSectionViewer />}
      </VStack>
    </SectionCard>
  );
};

export default PublicSection;
