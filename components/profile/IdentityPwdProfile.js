import { Stack, VStack, Box } from "@chakra-ui/react";
import Container from "../Container";
import BiographySection from "./sections/BiographySection";
import ExperienceSection from "./sections/ExperienceSection";
import PortfolioSection from "./sections/PortfolioSection";
import PwdSection from "./sections/PwdSection";
import ActivitySection from "./sections/ActivitySection";
const IdentityPwdProfile = ({ identity, page, enums, editable }) => {
  const props = { identity, page, enums, editable };

  return (
    <Box pt={[24, 48]} pb={36}>
      <Container>
        <Stack align="stretch" direction={["column", "column", "row"]}>
          <VStack align="stretch" flex={1} minW={0} w="100%">
            <PwdSection {...props} />
            <PortfolioSection {...props} />
            <BiographySection {...props} />
            <ExperienceSection {...props} />
            <ActivitySection {...props} />
          </VStack>
          <VStack w={["100%", "100%", "33%"]}>
            <Box></Box>
          </VStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default IdentityPwdProfile;
