import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  VStack,
  Tag,
  Text,
  HStack,
  Avatar,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { AiOutlinePlus } from "react-icons/ai";
import { useDisclosureWithParams } from "../../../store/AppStore";
import OrganizationProfileStore from "../../../store/OrganizationProfileStore";
import wordExtractor from "../../../utils/wordExtractor";
import OrganzationMemberInviteModal from "../fragments/OrganzationMemberInviteModal";
import SectionCard from "../fragments/SectionCard";

const InvitationCodeSection = () => {
  const { organization, page } = OrganizationProfileStore.useContext();

  const inviteDisclosure = useDisclosureWithParams();

  return (
    <SectionCard>
      <HStack px={4} py={4} align="center">
        <Text flex={1} minW={0} w="100%" fontSize="2xl">
          {wordExtractor(
            page?.content?.wordings,
            "invigation_code_header_label"
          )}
        </Text>
        <Button
          leftIcon={<AiOutlinePlus />}
          variant="link"
          onClick={() => inviteDisclosure.onOpen({ id: organization.id })}
        >
          {wordExtractor(page?.content?.wordings, "button_label_invite")}
        </Button>
      </HStack>
      <VStack px={4} pb={4} align="stretch" direction={"column"} spacing={4}>
        <Stat>
          <StatLabel>
            {wordExtractor(page?.content?.wordings, "inivation_code_label")}
          </StatLabel>
          <StatNumber>{organization?.invitationCode ?? "000000"}</StatNumber>
          <StatHelpText></StatHelpText>
        </Stat>
      </VStack>
      <OrganzationMemberInviteModal
        params={inviteDisclosure.params}
        isOpen={inviteDisclosure.isOpen}
        onClose={inviteDisclosure.onClose}
      />
    </SectionCard>
  );
};

export default InvitationCodeSection;
