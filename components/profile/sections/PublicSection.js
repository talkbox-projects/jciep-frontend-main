import {
  Text,
  Button,
  Stack,
  FormControl,
  FormLabel,
  HStack,
  VStack,
  useDisclosure,
  Wrap,
  Tag,
  Input,
  FormHelperText,
  Select,
  Box,
  Divider,
} from "@chakra-ui/react";
import MultiSelect from "react-select";
import moment from "moment";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineEdit } from "react-icons/ai";
import { useAppContext } from "../../../store/AppStore";
import { getEnumText } from "../../../utils/enums/getEnums";
import wordExtractor from "../../../utils/wordExtractor";
import BannerFragment from "../fragments/BannerFragment";
import SectionCard from "../fragments/SectionCard";
import PublicSectionEditor from "../editor/PublicSectionEditor";

const PublicSection = ({ identity, page, enums, editable }) => {
  const router = useRouter();
  const props = { identity, page, enums, editable };
  const editModelDisclosure = useDisclosure();
  const { updateIdentity } = useAppContext();

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { isSubmitting, errors },
  } = useForm();

  useEffect(() => {
    if (editModelDisclosure.isOpen) {
      reset(identity);
    }
  }, [editModelDisclosure.isOpen, reset, identity]);

  const view = (
    <>
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

      <VStack px={8} py={4} align="stretch" spacing={4}>
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
    </>
  );

  return (
    <SectionCard>
      <VStack
        as="form"
        as="form"
        onSubmit={handleSubmit(async ({ type, ...values }) => {
          await onIdentityUpdate(values);
          editModelDisclosure.onClose();
        })}
        spacing={1}
        align="stretch"
      >
        <BannerFragment {...props} />
        <PublicSectionEditor />
      </VStack>
    </SectionCard>
  );
};

export default PublicSection;
