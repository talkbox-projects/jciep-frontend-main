import { Box, Stack, VStack } from "@chakra-ui/react";
import Container from "../Container";
import OrganizationBiographySection from "./sections/OrganizationBiographySection";
import EmploymentSection from "./sections/EmploymentSection";
import OrganizationPortfolioSection from "./sections/OrganizationPortfolioSection";

const OrganizationEmploymentProfile = () => {
  return (
    <Box pt={[24, 48]} pb={36}>
      <Container>
        <Stack align="stretch" direction={["column", "column", "row"]}>
          <VStack align="stretch" flex={1} minW={0} w="100%">
            <EmploymentSection />
            <OrganizationBiographySection />
            <OrganizationPortfolioSection />
          </VStack>
          <VStack w={["100%", "100%", "33%"]} align="stretch">
            <OrganizationMemberListSection />
          </VStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default OrganizationEmploymentProfile;
