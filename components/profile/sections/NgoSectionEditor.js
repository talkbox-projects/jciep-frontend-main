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
  Input,
  FormHelperText,
  Textarea,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import wordExtractor from "../../../utils/wordExtractor";
import OrganizationProfileStore from "../../../store/OrganizationProfileStore";
import { useRouter } from "next/router";
import { emailRegex, urlRegex } from "../../../utils/general";

const NgoSectionEditor = () => {
  const router = useRouter();
  const { page, enums, saveOrganization, organization, removeEditSection } =
    OrganizationProfileStore.useContext();

  const {
    handleSubmit,
    control,
    register,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      id: organization.id,
      chineseCompanyName: organization.chineseCompanyName,
      englishCompanyName: organization.englishCompanyName,
    },
  });

  return (
    <VStack
      as="form"
      onSubmit={handleSubmit(async (values) => {
        try {
          await saveOrganization(values);
          removeEditSection();
        } catch (error) {
          console.error(error);
        }
      })}
      spacing={1}
      align="stretch"
    >
      <VStack align="stretch">
        {/* <Text>{JSON.stringify({ organization, enums })}</Text> */}
        <HStack py={2} px={4} spacing={4} justifyContent="flex-end">
          <Button variant="link" onClick={removeEditSection}>
            {wordExtractor(page?.content?.wordings, "cancel_button_label")}
          </Button>
          <Button
            colorScheme="yellow"
            color="black"
            px={8}
            py={2}
            borderRadius="2em"
            type="submit"
            isLoading={isSubmitting}
          >
            {wordExtractor(page?.content?.wordings, "save_button_label")}
          </Button>
        </HStack>
      </VStack>
      <VStack spacing={1} px={8} align="start">
        <Wrap>
          <Text fontSize="xl" fontWeight="bold">
            {router.locale === "zh"
              ? organization?.chineseCompanyName
              : organization?.englishCompanyName}
          </Text>
          <Tag>
            {
              enums?.EumOrganizationTypeList?.find(
                (x) => x.key === organization?.type
              )?.value?.[router.locale]
            }
          </Tag>
          <Tag>
            {
              enums?.EumOrganizationStatusList?.find(
                (x) => x.key === organization?.status
              )?.value?.[router.locale]
            }
          </Tag>
        </Wrap>
      </VStack>
      <VStack px={8} py={4} align="stretch" spacing={6}>
        <Stack direction={["column", "column", "row"]}>
          <FormControl
            isRequired={true}
            isInvalid={errors?.chineseCompanyName?.message}
          >
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_chineseCompanyName"
              )}
            </FormLabel>
            <Input
              variant="flushed"
              defaultValue={organization?.chineseCompanyName}
              {...register("chineseCompanyName", {
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
              })}
            ></Input>
            <FormHelperText color="red">
              {errors?.chineseCompanyName?.message}
            </FormHelperText>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={errors?.englishCompanyName?.message}
          >
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_englishCompanyName"
              )}
            </FormLabel>
            <Input
              variant="flushed"
              defaultValue={organization?.englishCompanyName}
              {...register("englishCompanyName", {
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
              })}
            ></Input>
            <FormHelperText color="red">
              {errors?.englishCompanyName?.message}
            </FormHelperText>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl isInvalid={errors?.contactName?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_contactName"
              )}
            </FormLabel>
            <Input
              variant="flushed"
              defaultValue={organization?.contactName}
              {...register("contactName", {
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
              })}
            ></Input>
            <FormHelperText color="red">
              {errors?.contactName?.message}
            </FormHelperText>
          </FormControl>
          <FormControl isInvalid={errors?.contactEmail?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_contactEmail"
              )}
            </FormLabel>
            <Input
              type="contactEmail"
              variant="flushed"
              defaultValue={organization?.contactEmail}
              {...register("contactEmail", {
                pattern: {
                  value: emailRegex,
                  message: wordExtractor(
                    page?.content?.wordings,
                    "field_error_message_invalid_contactEmail"
                  ),
                },
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
              })}
            ></Input>
            <FormHelperText color="red">
              {errors?.contactEmail?.message}
            </FormHelperText>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl isInvalid={errors?.contactPhone?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_contactPhone"
              )}
            </FormLabel>
            <Input
              variant="flushed"
              defaultValue={organization?.contactPhone}
              {...register("contactPhone", {
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
              })}
            ></Input>
            <FormHelperText color="red">
              {errors?.contactPhone?.message}
            </FormHelperText>
          </FormControl>
          <FormControl isInvalid={errors?.website?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_website")}
            </FormLabel>
            <Input
              type="text"
              variant="flushed"
              defaultValue={organization?.website}
              {...register("website", {
                pattern: {
                  value: urlRegex,
                  message: wordExtractor(
                    page?.content?.wordings,
                    "field_error_message_invalid_url"
                  ),
                },
              })}
            ></Input>
            <FormHelperText color="red">
              {errors?.website?.message}
            </FormHelperText>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl isInvalid={errors?.description?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_organization_description"
              )}
            </FormLabel>
            <Textarea
              rows={5}
              resize="none"
              variant="flushed"
              defaultValue={organization?.description}
              {...register("description", {})}
            ></Textarea>
            <FormHelperText color="red">
              {errors?.chineseName?.message}
            </FormHelperText>
          </FormControl>
        </Stack>
      </VStack>
    </VStack>
  );
};

export default NgoSectionEditor;
