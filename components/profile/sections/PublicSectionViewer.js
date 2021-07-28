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
} from "@chakra-ui/react";
import wordExtractor from "../../../utils/wordExtractor";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import { useRouter } from "next/router";
import { AiOutlineEdit } from "react-icons/ai";
import moment from "moment";
import { getEnumText } from "../../../utils/enums/getEnums";

const PublicSectionViewer = () => {
  const router = useRouter();
  const {
    page,
    enums,
    identity,
    editSection,
    setEditSection,
    isAdmin,
    editable,
  } = IdentityProfileStore.useContext();

  return (
    <VStack spacing={1} align="stretch">
      <HStack py={2} px={4} minH={16} spacing={4} justifyContent="flex-end">
        {(isAdmin || editable) && !editSection && (
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
              ? identity?.chineseName
              : identity?.englishName}
          </Text>
          <Tag>
            {
              enums?.EnumIdentityTypeList?.find((x) => x.key === identity?.type)
                ?.value?.[router.locale]
            }
          </Tag>
        </Wrap>
        <Text color="#999">
          {identity?.caption ??
            wordExtractor(page?.content?.wordings, "empty_text_label")}
        </Text>
      </VStack>
      <VStack px={8} py={4} align="stretch" spacing={6}>
        <Stack direction={["column", "column", "row"]}>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_chineseName"
              )}
            </FormLabel>
            <Text>
              {identity?.chineseName ??
                wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_englishName"
              )}
            </FormLabel>
            <Text>
              {identity?.englishName ??
                wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_email")}
            </FormLabel>
            <Text>
              {identity?.email ??
                wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_phone")}
            </FormLabel>
            <Text>
              {identity?.phone ??
                wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_dob")}
            </FormLabel>
            <Text>
              {moment(identity?.dob).format("YYYY-MM-DD") ??
                wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_district")}
            </FormLabel>
            <Text>
              {getEnumText(
                enums?.EnumGenderList,
                identity?.gender,
                router.locale
              ) ?? wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_district")}
            </FormLabel>
            <Text>
              {getEnumText(
                enums?.EnumDistrictList,
                identity?.district,
                router.locale
              ) ?? wordExtractor(page?.content?.wordings, "empty_text_label")}
            </Text>
          </FormControl>
          <FormControl>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_industry")}
            </FormLabel>
            <Wrap>
              {identity?.industry.map((key) => (
                <Tag key={key}>
                  {getEnumText(enums?.EnumIndustryList, key, router.locale) ??
                    wordExtractor(page?.content?.wordings, "empty_text_label")}
                </Tag>
              ))}
            </Wrap>
          </FormControl>
        </Stack>
      </VStack>
    </VStack>
  );
};

export default PublicSectionViewer;
