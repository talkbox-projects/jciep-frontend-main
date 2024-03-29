import React from "react";
import {
  Text,
  Button,
  Stack,
  FormControl,
  FormLabel,
  HStack,
  VStack,
  Wrap,
  Tag,
  useToast,
  Link,
} from "@chakra-ui/react";
import wordExtractor from "../../../utils/wordExtractor";
import OrganizationProfileStore from "../../../store/OrganizationProfileStore";
import { useRouter } from "next/router";
import { AiOutlineEdit } from "react-icons/ai";
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";

const NgoSectionViewer = () => {
  const router = useRouter();
  const {
    isAdmin,
    page,
    enums,
    organization,
    editSection,
    editable,
    saveOrganization,
    setEditSection,
    refreshOrganization,
  } = OrganizationProfileStore.useContext();

  const toast = useToast();

  const { submission } = organization;
  const targetGroupData =
    organization?.targetGroup ?? submission[0]?.targetGroup;

  const targetGroupDisabilities =
    organization?.targetGroupDisabilities ??
    submission[0]?.targetGroupDisabilities;

  return (
    <VStack spacing={1} align="stretch">
      <HStack py={2} px={4} minH={16} spacing={4} justifyContent="flex-end">
        {(isAdmin || editable) && organization?.status === "approved" && (
          <Button
            variant="outline"
            isActive={!!organization?.published}
            onClick={async () => {
              try {
                await saveOrganization({
                  id: organization?.id,
                  published: !organization?.published,
                });
                refreshOrganization();
                toast({
                  title: !organization?.published ? "已發佈檔案" : "已取消發佈",
                  status: !organization?.published ? "info" : "warning",
                  position: "bottom",
                });
              } catch (error) {
                console.error(error);
              }
            }}
            leftIcon={
              !organization?.published ? (
                <MdRadioButtonUnchecked />
              ) : (
                <MdRadioButtonChecked />
              )
            }
          >
            {wordExtractor(
              page?.content?.wordings,
              organization?.published
                ? "published_my_profile_label"
                : "publish_my_profile_label"
            )}
          </Button>
        )}
        {(isAdmin || editable) &&
          organization?.status === "approved" &&
          !editSection && (
            <Button
              onClick={() => setEditSection("profile")}
              leftIcon={<AiOutlineEdit />}
              variant="link"
            >
              {wordExtractor(page?.content?.wordings, "edit_my_profile_label")}
            </Button>
          )}
      </HStack>
      <VStack spacing={1} px={8} align="start">
        <Wrap>
          <Text fontSize="xl" fontWeight="bold">
            {router.locale === "zh"
              ? organization?.chineseCompanyName
              : organization?.englishCompanyName}
          </Text>
          {(isAdmin || editable) && (
            <Tag>
              {
                enums?.EnumOrganizationStatusList?.find(
                  (x) => x.key === organization?.status
                )?.value?.[router.locale]
              }
            </Tag>
          )}
        </Wrap>
      </VStack>
      <VStack px={8} py={4} align="stretch" spacing={6}>
        <Stack direction={["column", "column", "row"]}>
          <FormControl>
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_chineseOrganizationName"
              )}
            </FormLabel>
            <Text>
              {organization?.chineseCompanyName ??
                wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
          <FormControl>
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_englishOrganizationName"
              )}
            </FormLabel>
            <Text>
              {organization?.englishCompanyName ??
                wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl>
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_website")}
            </FormLabel>
            {organization?.website ? (
              <Link href={organization?.website} wordBreak="break-word">
                <Text>{organization?.website}</Text>
              </Link>
            ) : (
              wordExtractor(page?.content?.wordings, "empty_text_label")
            )}
          </FormControl>
          <FormControl>
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_contactName"
              )}
            </FormLabel>
            <Text>
              {organization?.contactName ||
                wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl>
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_contactEmail"
              )}
            </FormLabel>
            <Text>
              {organization?.contactEmail ||
                wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
          <FormControl>
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_contactPhone"
              )}
            </FormLabel>
            <Text>
              {organization?.contactPhone ||
                wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl>
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_organization_description"
              )}
            </FormLabel>
            <Text whiteSpace="pre-wrap">
              {organization?.description ??
                wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
          <FormControl>
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_mission_and_vision"
              )}
            </FormLabel>
            <Text whiteSpace="pre-wrap">
              {organization?.missionNVision ?? submission[0]?.missionNVision}
            </Text>
          </FormControl>
        </Stack>

        <Stack direction={["column", "column", "row"]}>
          <FormControl>
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_target_group"
              )}
            </FormLabel>
            {Array.isArray(targetGroupData) ? (
              targetGroupData?.map((d) => {
                return (
                  <Tag key={d} mr={2} mt={1}>
                    {
                      enums?.EnumTargetGroupList?.find((x) => x.key === d)
                        ?.value?.[router.locale]
                    }
                  </Tag>
                );
              })
            ) : (
              <Text>
                {targetGroupData ||
                  wordExtractor(page?.content?.wordings, "empty_text_label")}
              </Text>
            )}
          </FormControl>

          <FormControl>
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_target_group_disabilities"
              )}
            </FormLabel>
            <Text whiteSpace="pre-wrap">
              {
                enums?.EnumTargetGroupDisabilityList?.find(
                  (x) => x.key === targetGroupDisabilities
                )?.value?.[router.locale]
              }
            </Text>
          </FormControl>
        </Stack>

        {(organization?.targetGroupDisabilitiesOther ||
          submission[0]?.targetGroupDisabilitiesOther) && (
          <Stack direction={["column", "column", "row"]}>
            <FormControl>
              <FormLabel color="#757575" mb={0}>
                {wordExtractor(
                  page?.content?.wordings,
                  "field_label_target_group_disabilities_other"
                )}
              </FormLabel>
              <Text whiteSpace="pre-wrap">
                {(organization?.targetGroupDisabilitiesOther ||
                  submission[0]?.targetGroupDisabilitiesOther) ??
                  wordExtractor(page?.content?.wordings, "empty_text_label")}
              </Text>
            </FormControl>
          </Stack>
        )}
      </VStack>
    </VStack>
  );
};

export default NgoSectionViewer;
