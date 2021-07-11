import { Box, Stack, VStack } from "@chakra-ui/react";
import Container from "../Container";
import OrganizationBiographySection from "./sections/OrganizationBiographySection";
import NgoSection from "./sections/NgoSection";
import OrganizationPortfolioSection from "./sections/OrganizationPortfolioSection";

const OrganizationCompanyProfile = () => {
  return (
    <Box pt={[24, 48]} pb={36}>
      <Container>
        <Stack align="stretch" direction={["column", "column", "row"]}>
          <VStack align="stretch" flex={1} minW={0} w="100%">
            <NgoSection />
            <OrganizationBiographySection />
            <OrganizationPortfolioSection />
          </VStack>
          <VStack w={["100%", "100%", "33%"]}>
            <Box></Box>
          </VStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default OrganizationCompanyProfile;
