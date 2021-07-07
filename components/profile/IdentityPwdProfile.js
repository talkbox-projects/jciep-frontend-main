import { Box } from "@chakra-ui/react";
import Container from "../Container";
import BiographySection from "./sections/BiographySection";
import ExperienceSection from "./sections/ExperienceSection";
import PortfolioSection from "./sections/PortfolioSection";
import PwdSection from "./sections/PwdSection";

const IdentityPwdProfile = ({ identity, page, enums, editable }) => {
  const props = { identity, page, enums, editable };

  return (
    <Box pt={48} pb={36}>
      <Container>
        <VStack align="stretch">
          <PwdSection {...props} />
          <BiographySection {...props} />
          <PortfolioSection {...props} />
          <ExperienceSection {...props} />
        </VStack>
      </Container>
    </Box>
  );
};

export default IdentityPwdProfile;
