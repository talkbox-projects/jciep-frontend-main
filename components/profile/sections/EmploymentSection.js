import { VStack } from "@chakra-ui/react";
import BannerFragment from "../fragments/BannerFragment";
import SectionCard from "../fragments/SectionCard";
import EmploymentSectionEditor from "./EmploymentSectionEditor";
import EmploymentSectionViewer from "./EmploymentSectionViewer";
import OrganizationProfileStore from "../../../store/OrganizationProfileStore";

const EmploymentSection = () => {
  const { page, organization, saveOrganization, editSection, editable } =
    OrganizationProfileStore.useContext();
  const isEditing = editSection === "profile";
  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        <BannerFragment
          {...{
            enableBannerMedia: false,
            page,
            entity: organization,
            save: saveOrganization,
            profilePicPropName: "logo",
            editable,
          }}
        />
        {isEditing ? <EmploymentSectionEditor /> : <EmploymentSectionViewer />}
      </VStack>
    </SectionCard>
  );
};

export default EmploymentSection;
