import { Box, Stack, VStack } from "@chakra-ui/react";
import Container from "../Container";
import OrganizationBiographySection from "./sections/OrganizationBiographySection";
import NgoSection from "./sections/NgoSection";
import OrganizationPortfolioSection from "./sections/OrganizationPortfolioSection";
import OrganizationProfileStore from "../../store/OrganizationProfileStore";
import OrganizationMemberListSection from "./sections/OrganizationMemberListSection";
import InvitationCodeSection from "./sections/InvitationCodeSection";
import OrganizationSubmissionSection from "./sections/OrganizationSubmissionSection";
import OrganizationOperationSection from "./sections/OrganizationOperationSection";

const OrganizationNgoProfile = () => {
  const { organization, isAdmin, editable } =
    OrganizationProfileStore.useContext();
  return (
    <Box pt={[24, 48]} pb={36}>
      <Container>
        <Stack align="stretch" direction={["column", "column", "row"]}>
          <VStack align="stretch" flex={1} minW={0} w="100%">
            <NgoSection />
            <OrganizationBiographySection />
            <OrganizationPortfolioSection />
          </VStack>
          <VStack w={["100%", "100%", "33%"]} align="stretch">
            {(isAdmin || editable) && (
              <>
                <OrganizationOperationSection />
                <OrganizationSubmissionSection />
                {organization?.status === "approved" && (
                  <InvitationCodeSection />
                )}
              </>
            )}
            <OrganizationMemberListSection />
          </VStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default OrganizationNgoProfile;
