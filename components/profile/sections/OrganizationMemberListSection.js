import {
  Box,
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

const OrganizationMemberListSection = () => {
  const { organization, page, enums } = OrganizationProfileStore.useContext();

  const router = useRouter();

  return (
    <SectionCard>
      <HStack px={4} py={4} align="center">
        <Text flex={1} minW={0} w="100%" fontSize="2xl">
          {wordExtractor(
            page?.content?.wordings,
            "related_member_header_label"
          )}
        </Text>
      </HStack>
      <VStack pb={4} align="stretch" px={1} direction={"column"} spacing={4}>
        {(organization?.member ?? []).map(
          ({ identity, email, role, status }) => {
            return (
              <HStack
                {...(identity?.id && {
                  onClick: () => {
                    router.push(`/user/identity/${identity.id}`);
                  },
                  _hover: {
                    bg: "#fafafa",
                  },
                  cursor: "pointer",
                })}
                px={4}
                py={2}
              >
                <Avatar
                  {...(identity?.profilePic?.url && { bgColor: "white" })}
                  size="sm"
                  src={identity?.profilePic?.url}
                ></Avatar>
                <VStack align="start" spacing={0} flex={1} minW={0} w="100%">
                  <Text textOverflow="ellipsis">
                    {identity?.chineseName ?? email}
                  </Text>
                  <Text color="#999" fontSize="sm">
                    {
                      enums?.EnumJoinRoleList?.find((x) => x.key === role)
                        ?.value?.[router?.locale]
                    }
                  </Text>
                </VStack>
                <Tag>
                  {
                    enums?.EnumJoinStatusList?.find((x) => x.key === status)
                      ?.value?.[router?.locale]
                  }
                </Tag>
              </HStack>
            );
          }
        )}
      </VStack>
    </SectionCard>
  );
};

export default OrganizationMemberListSection;
