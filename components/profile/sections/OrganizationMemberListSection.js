import {
  VStack,
  Tag,
  Text,
  HStack,
  Avatar,
  Button,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import OrganizationProfileStore from "../../../store/OrganizationProfileStore";
import wordExtractor from "../../../utils/wordExtractor";
import SectionCard from "../fragments/SectionCard";
import OrganizationMemberRemove from "../../../utils/api/OrganizationMemberRemove";
import { useDisclosureWithParams } from "../../../store/AppStore";
import OrganizationMemberRemoveModal from "../fragments/OrganizationMemberRemoveModal";
import { IoEllipsisVertical } from "react-icons/io5";
import OrganizationMemberApproveModal from "../fragments/OrganizationMemberApproveModal";
import OrganizationMemberApprove from "../../../utils/api/OrganizationMemberApprove";

const OrganizationMemberListSection = () => {
  const { organization, page, enums, editable, refreshOrganization, isAdmin } =
    OrganizationProfileStore.useContext();

  const router = useRouter();

  const removeDisclosure = useDisclosureWithParams();
  const approveDisclosure = useDisclosureWithParams();

  const hasOnlyOneStaff =
    (organization?.member ?? []).filter(
      (m) => m?.role === "staff" && m?.status === "joined"
    )?.length === 1;

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
            const availableOperations = [];

            if (isAdmin || editable) {
              if (status === "pendingApproval") {
                availableOperations.push(
                  <MenuItem
                    color="red"
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
                  >
                    {wordExtractor(
                      page?.content?.wordings,
                      "reject_organization_member_label"
                    )}
                  </MenuItem>
                );
                availableOperations.push(
                  <MenuItem
                    color="green"
                    onClick={(e) => {
                      e.stopPropagation();
                      approveDisclosure.onOpen({
                        page,
                        onSubmit: async (e) => {
                          try {
                            const data = await OrganizationMemberApprove({
                              organizationId: organization?.id,
                              identityId: identityId,
                            });
                            await refreshOrganization();
                            approveDisclosure.onClose();
                          } catch (error) {
                            console.error(error);
                          }
                        },
                      });
                    }}
                  >
                    {wordExtractor(
                      page?.content?.wordings,
                      "approve_organization_member_label"
                    )}
                  </MenuItem>
                );
              }
              if (
                status === "joined" &&
                !(role === "staff" && hasOnlyOneStaff)
              ) {
                availableOperations.push(
                  <MenuItem
                    color="red"
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
                  >
                    {wordExtractor(
                      page?.content?.wordings,
                      "remove_organization_member_label"
                    )}
                  </MenuItem>
                );
              }
            }

            return (
              <HStack
                {...(identity?.id && {
                  onClick: () => {
                    if (editable) {
                      router.push(`/user/identity/${identity.id}`);
                    } else {
                      router.push(
                        `/talants/individuals?identityId=${identity.id}&organizationId=${organization.id}`
                      );
                    }
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
                {availableOperations.length > 0 && (
                  <Box>
                    <Menu size="sm">
                      <MenuButton onClick={(e) => e.stopPropagation()}>
                        <IconButton
                          fontSize="xs"
                          variant="link"
                          as={IoEllipsisVertical}
                          size="xs"
                          fontSize="xs"
                        />
                      </MenuButton>
                      <MenuList>{availableOperations}</MenuList>
                    </Menu>
                  </Box>
                )}
              </HStack>
            );
          })}
      </VStack>
      <OrganizationMemberRemoveModal {...removeDisclosure} />
      <OrganizationMemberApproveModal {...approveDisclosure} />
    </SectionCard>
  );
};

export default OrganizationMemberListSection;
