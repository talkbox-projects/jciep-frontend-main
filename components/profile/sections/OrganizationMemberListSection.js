import {
  Box,
  VStack,
  Tag,
  Text,
  HStack,
  Avatar,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { MdDelete } from "react-icons/md";
import OrganizationProfileStore from "../../../store/OrganizationProfileStore";
import wordExtractor from "../../../utils/wordExtractor";
import SectionCard from "../fragments/SectionCard";
import OrganizationMemberRemove from "../../../utils/api/OrganizationMemberRemove";
import { useDisclosureWithParams } from "../../../store/AppStore";
import OrganizationMemberRemoveModal from "../fragments/OrganizationMemberRemoveModal";

const OrganizationMemberListSection = () => {
  const { organization, page, enums, editable, refreshOrganization, isAdmin } =
    OrganizationProfileStore.useContext();

  const router = useRouter();

  const removeDisclosure = useDisclosureWithParams();

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
        {(organization?.member ?? [])
          .filter((m) => (!(isAdmin || editable) ? m?.role === "member" : true))
          .map(({ identityId, identity, email, role, status }) => {
            return (
              <HStack
                {...(identity?.id && {
                  onClick: () => {
                    router.push(`/user/identity/${identity.id}`);
                  },
                  _hover: {
                    bg: "#fafafa",
                    [Button]: {
                      d: "none",
                    },
                  },
                  cursor: "pointer",
                })}
                pl={4}
                pr={2}
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
                {(isAdmin || editable) && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDisclosure.onOpen({
                        page,
                        onSubmit: async (e) => {
                          try {
                            const data = await OrganizationMemberRemove({
                              organizationId: organization?.id,
                              identityId: identityId,
                            });
                            await refreshOrganization();
                            removeDisclosure.onClose();
                          } catch (error) {
                            console.error(error);
                          }
                        },
                      });
                    }}
                    icon={<MdDelete />}
                    variant="link"
                  ></IconButton>
                )}
              </HStack>
            );
          })}
      </VStack>
      <OrganizationMemberRemoveModal {...removeDisclosure} />
    </SectionCard>
  );
};

export default OrganizationMemberListSection;
