import { Box, Stack, VStack } from "@chakra-ui/react";
import Container from "../Container";
import OrganizationBiographySection from "./sections/OrganizationBiographySection";
import EmploymentSection from "./sections/EmploymentSection";
import OrganizationPortfolioSection from "./sections/OrganizationPortfolioSection";
import OrganizationMemberListSection from "./sections/OrganizationMemberListSection";
import InvitationCodeSection from "./sections/InvitationCodeSection";
import OrganizationSubmissionSection from "./sections/OrganizationSubmissionSection";
import OrganizationOperationSection from "./sections/OrganizationOperationSection";
import OrganizationProfileStore from "../../store/OrganizationProfileStore";

const OrganizationEmploymentProfile = () => {
  const { isAdmin, editable } = OrganizationProfileStore.useContext();
  return (
    <Box pt={[24, 48]} pb={36}>
      <Container>
        <Stack align="stretch" direction={["column", "column", "row"]}>
          <VStack align="stretch" flex={1} minW={0} w="100%">
            <EmploymentSection />
            <OrganizationBiographySection />
          </VStack>
          <VStack w={["100%", "100%", "33%"]} align="stretch">
            {(isAdmin || editable) && (
              <>
                <OrganizationOperationSection />
                <OrganizationSubmissionSection />
              </>
            )}
            <OrganizationMemberListSection />
          </VStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default OrganizationEmploymentProfile;
