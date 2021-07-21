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
  Box,
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

  return (
    <VStack spacing={1} align="stretch">
      <HStack py={2} px={4} minH={16} spacing={4} justifyContent="flex-end">
        {(isAdmin || editable) && (
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
          <Tag>
            {
              enums?.EnumOrganizationStatusList?.find(
                (x) => x.key === organization?.status
              )?.value?.[router.locale]
            }
          </Tag>
        </Wrap>
      </VStack>
      <VStack px={8} py={4} align="stretch" spacing={4}>
        <Stack direction={["column", "column", "row"]}>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_chineseCompanyName"
              )}
            </FormLabel>
            <Text>
              {organization?.chineseCompanyName ??
                wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_englishCompanyName"
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
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_website")}
            </FormLabel>
            <Text>
              {organization?.website ||
                wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
          <FormControl>
            <FormLabel color="#999" mb={0}>
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
            <FormLabel color="#999" mb={0}>
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
            <FormLabel color="#999" mb={0}>
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
            <FormLabel color="#999" mb={0}>
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
        </Stack>
      </VStack>
    </VStack>
  );
};

export default NgoSectionViewer;
