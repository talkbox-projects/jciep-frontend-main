import { Stack, VStack, Box } from "@chakra-ui/react";
import Container from "../Container";
import IdentityBiographySection from "./sections/IdentityBiographySection";
import ExperienceSection from "./sections/ExperienceSection";
import IdentityPortfolioSection from "./sections/IdentityPortfolioSection";
import IdentityOrganizationListSection from "./sections/IdentityOrganizationListSection";
import PwdSection from "./sections/PwdSection";
import ActivitySection from "./sections/ActivitySection";
import IdentityOperationSection from "./sections/IdentityOperationSection";
import IdentityProfileStore from "../../store/IdentityProfileStore";

const IdentityPwdProfile = () => {
  const { isAdmin, editable } = IdentityProfileStore.useContext();

  return (
    <Box pt={[24, 48]} pb={36}>
      <Container>
        <Stack align="stretch" direction={["column", "column", "row"]}>
          <VStack align="stretch" flex={1} minW={0} w="100%">
            <PwdSection />
            <IdentityPortfolioSection />
            <IdentityBiographySection />
            <ExperienceSection />
            <ActivitySection />
          </VStack>
          <VStack align="stretch" w={["100%", "100%", "33%"]}>
            {(isAdmin || editable) && <IdentityOperationSection />}

            <IdentityOrganizationListSection />
          </VStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default IdentityPwdProfile;
