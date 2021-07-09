import { Box, Stack, VStack } from "@chakra-ui/react";
import Container from "../Container";
import BiographySection from "./sections/BiographySection";
import ExperienceSection from "./sections/ExperienceSection";
import PortfolioSection from "./sections/PortfolioSection";
import PublicSection from "./sections/PublicSection";

const IdentityPublicProfile = ({ identity, page, enums, editable }) => {
  const props = { identity, page, enums, editable };

  return (
    <Box pt={48} pb={36}>
      <Container>
        <Stack align="stretch" direction={["column", "column", "row"]}>
          <VStack align="stretch" flex={1} minW={0} w="100%">
            <PublicSection {...props} />
          </VStack>
          <VStack w={["100%", "100%", "33%"]}>
            <Box>Testing</Box>
          </VStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default IdentityPublicProfile;
