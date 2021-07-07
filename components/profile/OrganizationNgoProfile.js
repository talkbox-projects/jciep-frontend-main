import BiographySection from "./sections/BiographySection";
import ExperienceSection from "./sections/ExperienceSection";
import NgoSection from "./sections/NgoSection";
import PortfolioSection from "./sections/PortfolioSection";

const OrganizationNgoProfile = ({ organization, page, enums, editable }) => {
  const props = { organization, page, enums, editable };

  return (
    <VStack>
      <NgoSection {...props} />
      <BiographySection {...props} />
      <PortfolioSection {...props} />
      <ExperienceSection {...props} />
    </VStack>
  );
};

export default OrganizationNgoProfile;
