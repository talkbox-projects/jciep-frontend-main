import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  Stack,
  VStack,
  Textarea,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormHelperText,
  AspectRatio,
  Button,
} from "@chakra-ui/react";
import MultiSelect from "react-select";
import { useRouter } from "next/router";
import OrganizationProfileStore from "../../../store/OrganizationProfileStore";
import wordExtractor from "../../../utils/wordExtractor";
import { useForm, Controller } from "react-hook-form";
import { useCallback, useEffect } from "react";
import OrganizationSubmissionCreate from "../../../utils/api/OrganizationSubmissionCreate";
import { emailRegex, urlRegex } from "../../../utils/general";
import ProfileDropzone from "./ProfileDropzone";
import { useAppContext } from "../../../store/AppStore";

const OrganizationSubmissionFormModal = ({
  isOpen,
  onClose,
  params: { organization, submission = null, onRefresh } = {},
}) => {
  const { page, enums, setOrganization } =
    OrganizationProfileStore.useContext();
  const router = useRouter();

  const { identityId } = useAppContext();

  const {
    reset,
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm({});

  useEffect(() => {
    reset();
  }, []);

  const onSubmissionCreate = useCallback(
    async (values) => {
      try {
        console.log(values);
        const _submission = await OrganizationSubmissionCreate({
          input: { identityId, organizationId: organization.id, ...values },
        });
        onRefresh();
        onClose();
      } catch (error) {
        console.error(error);
      }
    },
    [organization, onRefresh, onClose]
  );

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay></ModalOverlay>
      <ModalContent as="form" onSubmit={handleSubmit(onSubmissionCreate)}>
        <ModalHeader>
          {wordExtractor(
            page?.content?.wordings,
            "field_label_submission_form_modal_header"
          )}
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody pb={6} as={VStack} align="stretch">
          <VStack px={8} py={4} align="stretch" spacing={4}>
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
                  defaultValue={submission?.chineseCompanyName}
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
                  defaultValue={submission?.englishCompanyName}
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
                  defaultValue={submission?.contactName}
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
                  defaultValue={submission?.contactEmail}
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
                  defaultValue={submission?.contactPhone}
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
                  {wordExtractor(
                    page?.content?.wordings,
                    "field_label_website"
                  )}
                </FormLabel>
                <Input
                  type="text"
                  variant="flushed"
                  defaultValue={submission?.website}
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
              <FormControl isInvalid={errors?.skill?.message}>
                <FormLabel color="#999" mb={0}>
                  {wordExtractor(
                    page?.content?.wordings,
                    "field_label_organization_industry"
                  )}
                </FormLabel>
                <Controller
                  control={control}
                  rules={{}}
                  name={"industry"}
                  defaultValue={submission?.industry ?? []}
                  render={({ field: { name, value, onChange } }) => {
                    const options = enums?.EnumIndustryList.map(
                      ({ key: value, value: { [router.locale]: label } }) => ({
                        value,
                        label,
                      })
                    );
                    return (
                      <MultiSelect
                        styles={{
                          control: (_) => ({
                            ..._,
                            borderRadius: 0,
                            borderColor: "#ddd",
                            borderTop: 0,
                            borderLeft: 0,
                            borderRight: 0,
                            borderBottomWidth: 1,
                          }),
                        }}
                        placeholder={wordExtractor(
                          page?.content?.wordings,
                          "empty_text_label"
                        )}
                        isMulti={true}
                        name={name}
                        onChange={(s) => onChange(s.map((s) => s.value))}
                        value={options.filter((o) =>
                          (value ?? [])?.includes(o.value)
                        )}
                        options={options}
                      />
                    );
                  }}
                ></Controller>
                <FormHelperText color="red">
                  {errors?.industry?.message}
                </FormHelperText>
              </FormControl>
              <FormControl isInvalid={errors?.industryOther?.message}>
                <FormLabel color="#999" mb={0}>
                  {wordExtractor(
                    page?.content?.wordings,
                    "field_label_organization_industryOther"
                  )}
                </FormLabel>
                <Input
                  variant="flushed"
                  defaultValue={submission?.industryOther}
                  {...register("industryOther", {})}
                ></Input>
                <FormHelperText color="red">
                  {errors?.industryOther?.message}
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
                  defaultValue={submission?.description}
                  {...register("description", {})}
                ></Textarea>
                <FormHelperText color="red">
                  {errors?.chineseName?.message}
                </FormHelperText>
              </FormControl>
            </Stack>

            <Stack direction={["column", "column", "row"]}>
              <FormControl isInvalid={errors?.contactPhone?.message}>
                <FormLabel color="#999" mb={0}>
                  {wordExtractor(
                    page?.content?.wordings,
                    "field_label_businessRegistration"
                  )}
                </FormLabel>
                <Controller
                  control={control}
                  name="businessRegistration"
                  render={({ field: { value, onChange } }) => {
                    return (
                      <AspectRatio ratio={2.5}>
                        <ProfileDropzone
                          value={value}
                          onChange={onChange}
                          page={page}
                        />
                      </AspectRatio>
                    );
                  }}
                />
                <FormHelperText color="red">
                  {errors?.contactPhone?.message}
                </FormHelperText>
              </FormControl>
            </Stack>
            <Button
              alignSelf="center"
              minW={24}
              mt={6}
              colorScheme="yellow"
              color="black"
              px={4}
              py={2}
              borderRadius="2em"
              type="submit"
            >
              {wordExtractor(page?.content?.wordings, "save_button_label")}
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OrganizationSubmissionFormModal;
