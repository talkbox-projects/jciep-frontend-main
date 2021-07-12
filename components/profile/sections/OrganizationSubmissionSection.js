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
  Tooltip,
  Icon,
  Box,
} from "@chakra-ui/react";
import moment from "moment";
import { useRouter } from "next/router";
import {
  AiFillInfoCircle,
  AiOutlineInfoCircle,
  AiOutlinePlus,
} from "react-icons/ai";
import { useDisclosureWithParams } from "../../../store/AppStore";
import OrganizationProfileStore from "../../../store/OrganizationProfileStore";
import wordExtractor from "../../../utils/wordExtractor";
import OrganzationMemberInviteModal from "../fragments/OrganzationMemberInviteModal";
import SectionCard from "../fragments/SectionCard";

const OrganizationSubmissionSection = () => {
  const { organization, page, enums } = OrganizationProfileStore.useContext();

  const inviteDisclosure = useDisclosureWithParams();

  const router = useRouter();
  return (
    <SectionCard>
      <HStack px={4} py={4} align="center">
        <Text fontSize="2xl">
          {wordExtractor(page?.content?.wordings, "submission_header_label")}
        </Text>

        <Box flex={1} minW={0} w="100%" />
      </HStack>
      <VStack pb={4} align="stretch" direction={"column"} spacing={4}>
        <Text px={4} fontSize="sm" color="#aaa">
          {wordExtractor(
            page?.content?.wordings,
            "submission_header_tooltip_label"
          )}
        </Text>
        <VStack align="stretch" direction={"column"} spacing={4}>
          {(organization?.submission ?? []).map((submission) => {
            const { id, createdAt, approvedAt, status } = submission;
            console.log(submission);
            return (
              <HStack
                onClick={() => {
                  // router.push(`/user/identity/${id}`);
                }}
                _hover={{
                  bg: "#fafafa",
                }}
                cursor="pointer"
                px={4}
                py={2}
              >
                <VStack align="start" spacing={0} flex={1} minW={0} w="100%">
                  <Text textOverflow="ellipsis">
                    {moment(createdAt).format("YYYY-MM-DD hh:mm a")}
                  </Text>
                  <Text color="#999" fontSize="sm"></Text>
                </VStack>
                <Tag>
                  {
                    enums?.EnumOrganizationStatusList?.find(
                      (x) => x.key === status
                    )?.value?.[router?.locale]
                  }
                </Tag>
              </HStack>
            );
          })}
        </VStack>
      </VStack>
    </SectionCard>
  );
};

export default OrganizationSubmissionSection;
