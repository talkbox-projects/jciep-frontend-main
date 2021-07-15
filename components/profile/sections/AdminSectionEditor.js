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
  Select,
} from "@chakra-ui/react";
import MultiSelect from "react-select";
import { Controller, useForm } from "react-hook-form";
import wordExtractor from "../../../utils/wordExtractor";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import { useRouter } from "next/router";

const AdminSectionEditor = () => {
  const router = useRouter();
  const { page, enums, saveIdentity, identity, removeEditSection } =
    IdentityProfileStore.useContext();

  const {
    handleSubmit,
    control,
    register,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      id: identity.id,
      caption: identity.caption,
    },
  });

  return (
    <VStack
      as="form"
      onSubmit={handleSubmit(async (values) => {
        try {
          await saveIdentity(values);
          removeEditSection();
        } catch (error) {
          console.error(error);
        }
      })}
      spacing={1}
      align="stretch"
    >
      <VStack align="stretch">
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
        <FormControl isInvalid={errors?.caption?.message}>
          <Input
            variant="flushed"
            placeholder={wordExtractor(
              page?.content?.wordings,
              "field_label_caption"
            )}
            defaultValue={identity?.caption}
            {...register("caption", {})}
          ></Input>
          <FormHelperText color="red">
            {errors?.caption?.message}
          </FormHelperText>
        </FormControl>
      </VStack>

      <VStack px={8} py={4} align="stretch" spacing={4}>
        <Stack direction={["column", "column", "row"]}>
          <FormControl
            isRequired={true}
            isInvalid={errors?.chineseName?.message}
          >
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_chineseName"
              )}
            </FormLabel>
            <Input
              variant="flushed"
              defaultValue={identity?.chineseName}
              {...register("chineseName", {
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
              })}
            ></Input>
            <FormHelperText color="red">
              {errors?.chineseName?.message}
            </FormHelperText>
          </FormControl>
          <FormControl isRequired isInvalid={errors?.englishName?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_englishName"
              )}
            </FormLabel>
            <Input
              variant="flushed"
              defaultValue={identity?.englishName}
              {...register("englishName", {
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
              })}
            ></Input>
            <FormHelperText color="red">
              {errors?.englishName?.message}
            </FormHelperText>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl isRequired isInvalid={errors?.email?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_email")}
            </FormLabel>
            <Input
              type="email"
              variant="flushed"
              defaultValue={identity?.email}
              {...register("email", {
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: wordExtractor(
                    page?.content?.wordings,
                    "field_error_message_invalid_email"
                  ),
                },
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
              })}
            ></Input>
            <FormHelperText color="red">
              {errors?.email?.message}
            </FormHelperText>
          </FormControl>
          <FormControl isRequired isInvalid={errors?.phone?.message}>
            <FormLabel color="#999" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_phone")}
            </FormLabel>
            <Input
              variant="flushed"
              defaultValue={identity?.phone}
              {...register("phone", {
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
              })}
            ></Input>
            <FormHelperText color="red">
              {errors?.phone?.message}
            </FormHelperText>
          </FormControl>
        </Stack>
      </VStack>
    </VStack>
  );
};

export default AdminSectionEditor;
