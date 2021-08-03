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
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import OrganizationProfileStore from "../../../store/OrganizationProfileStore";
import wordExtractor from "../../../utils/wordExtractor";
import SectionCard from "../fragments/SectionCard";
import OrganizationMemberRemove from "../../../utils/api/OrganizationMemberRemove";
import { useDisclosureWithParams } from "../../../store/AppStore";
import OrganizationMemberRemoveModal from "../fragments/OrganizationMemberRemoveModal";
import { IoEllipsisVertical, IoWarning } from "react-icons/io5";
import OrganizationMemberApproveModal from "../fragments/OrganizationMemberApproveModal";
import OrganizationMemberApprove from "../../../utils/api/OrganizationMemberApprove";
import { useAppContext } from "../../../store/AppStore";

const OrganizationMemberListSection = ({ path }) => {
  const { organization, page, enums, editable, refreshOrganization, isAdmin } =
    OrganizationProfileStore.useContext();

  const { identity: { id, type } = {} } = useAppContext();

  const router = useRouter();

  const removeDisclosure = useDisclosureWithParams();
  const approveDisclosure = useDisclosureWithParams();
  const [hasStaffAccess, setHasStaffAccess] = useState(false);

  useEffect(() => {
    if (path !== undefined && id) {
      console.log(organization.member);
      if (type === "admin") {
        setHasStaffAccess(true);
        return;
      }

      let hasStaff =
        (organization?.member ?? []).filter((m) => {
          return (
            m.identityId === id && m.role === "staff" && m.status === "joined"
          );
        }).length === 1;

      setHasStaffAccess(hasStaff);
    }
  }, [path, id, organization.member, type]);

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
          .filter((m) =>
            !(isAdmin || hasStaffAccess || editable)
              ? m.role === "member" && m.status === "joined"
              : true
          )
          //  .filter((m) => (!(isAdmin || editable) ? m?.role === "member" : true))
          .map(({ identityId, identity, role, status }) => {
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
                        onSubmit: async () => {
                          try {
                            await OrganizationMemberRemove({
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
                            await OrganizationMemberApprove({
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
                            await OrganizationMemberRemove({
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
                key={identity?.id}
                {...(identity?.id && {
                  onClick: () => {
                    if (isAdmin || editable) {
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
                  <Text textOverflow="ellipsis">{identity?.chineseName}</Text>
                  <Text color="#999" fontSize="sm">
                    {
                      enums?.EnumJoinRoleList?.find((x) => x.key === role)
                        ?.value?.[router?.locale]
                    }
                    {identity?.publishStatus === "pending" && (
                      <Tooltip
                        hasArrow
                        label={wordExtractor(
                          page?.content?.wordings,
                          "request_publish_alert_label"
                        )}
                      >
                        <Box d="inline" fontSize="lg">
                          <Icon color="orange" as={IoWarning} />
                        </Box>
                      </Tooltip>
                    )}
                  </Text>
                </VStack>
                {path === "talants" && hasStaffAccess ? (
                  <Tag>
                    {
                      enums?.EnumJoinStatusList?.find((x) => x.key === status)
                        ?.value?.[router?.locale]
                    }
                  </Tag>
                ) : path !== "talants" ? (
                  <Tag>
                    {
                      enums?.EnumJoinStatusList?.find((x) => x.key === status)
                        ?.value?.[router?.locale]
                    }
                  </Tag>
                ) : null}

                {availableOperations.length > 0 && (
                  <Box>
                    <Menu size="sm">
                      <MenuButton onClick={(e) => e.stopPropagation()}>
                        <IconButton
                          fontSize="xs"
                          variant="link"
                          as={IoEllipsisVertical}
                          size="xs"
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
