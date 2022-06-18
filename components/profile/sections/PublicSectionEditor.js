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
  Box,
  Grid,
  GridItem,
  Flex,
  Divider,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import MultiSelect from "react-select";
import { Controller, useForm } from "react-hook-form";
import wordExtractor from "../../../utils/wordExtractor";
import { useAppContext } from "../../../store/AppStore";
import ReactSelect from "react-select";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../../../utils/apollo";
import OrganizationMemberJoin from "../../../utils/api/OrganizationMemberJoin";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import organizationSearch from "../../../utils/api/OrganizationSearch";
import { useRouter } from "next/router";
import OrganizationInvitationCodeValidity from "../../../utils/api/OrganizationInvitationCodeValidity";

const PublicSectionEditor = () => {
  const router = useRouter();
  const { page, enums, saveIdentity, identity, removeEditSection, identityId } =
    IdentityProfileStore.useContext();
  const [showSelectCentre, setShowSelectCentre] = useState(false);
  const [selectedOrganization, setOrganization] = useState(null);
  const [currentFormState, setCurrentFormState] = useState();
  const [organizationData, setOrganizationData] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    handleSubmit,
    control,
    register,
    formState: { isSubmitting, errors },
    setError,
    watch,
    getValues,
  } = useForm({
    defaultValues: {
      id: identity.id,
      caption: identity.caption,
      wishToDoStatus: identity.wishToDoStatus,
    },
  });

  const wishToDoStatus = watch("wishToDo", identity.wishToDo);

  const handleSaveAction = async (data) => {
    let submitData = await Object.fromEntries(
      Object.entries({ ...data, phase2profile: true }).filter(
        ([_, v]) => v != null
      )
    );
    await saveIdentity(submitData);

    removeEditSection();
  };

  const handleSubmitInvitation = async () => {
    setError("invitationCode", {});

    const formState = getValues();

    setSubmitting(true);

    const isValid = await OrganizationInvitationCodeValidity({
      invitationCode: getValues("invitationCode"),
      organizationType: "ngo",
    });

    setSubmitting(false);

    if (!isValid) {
      setError("invitationCode", {
        message: wordExtractor(
          page?.content?.wordings,
          "invitation_code_error_message"
        ),
      });
      return;
    }

    handleSaveAction(formState);
  };

  const handlePostData = async (input, invitationCode) => {
    try {
      const mutation = gql`
        mutation IdentityCreate($input: IdentityCreateInput!) {
          IdentityCreate(input: $input) {
            id
          }
        }
      `;
      let data = await getGraphQLClient().request(mutation, {
        input,
      });
      if (data && data.IdentityCreate) {
        router.push(`/user/identity/public/${data.IdentityCreate.id}/success`);
        if (invitationCode) {
          await OrganizationMemberJoin({
            invitationCode: invitationCode,
            identityId: data.IdentityCreate.id,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    async function fetchOrganization() {
      // You can await here
      const response = await organizationSearch({
        status: ["approved"],
        published: true,
        type: ["ngo"],
      });

      setOrganizationData(response);
    }
    fetchOrganization();
  }, []);

  return (
    <VStack
      as="form"
      onSubmit={handleSubmit(async (values) => {
        try {
          // phase2profile: true, //Force to update
          const submitData = Object.fromEntries(
            Object.entries({ ...values, phase2profile: true }).filter(
              ([_, v]) => v != null
            )
          );
          console.log("submitData-", submitData);
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
      <VStack px={8} py={4} align="stretch" spacing={6}>
        <Stack direction={["column", "column", "row"]}>
          <FormControl
            isRequired={true}
            isInvalid={errors?.chineseName?.message}
          >
            <FormLabel color="#757575" mb={0}>
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
            <FormLabel color="#757575" mb={0}>
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
            <FormLabel color="#757575" mb={0}>
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
          <FormControl isInvalid={errors?.phone?.message}>
            <FormLabel color="#757575" mb={0}>
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
        <Stack direction={["column", "column", "row"]}>
          <FormControl isInvalid={errors?.dob?.message}>
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_age")}
            </FormLabel>

            <Select
              variant="flushed"
              {...register("age", {
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
              })}
              defaultValue={identity?.age}
            >
              <option key={"unselected"} value={""}>
                {wordExtractor(page?.content?.wordings, "empty_text_label")}
              </option>
              {(enums?.EnumAgeList ?? []).map(
                ({ key: value, value: { [router.locale]: label } = {} }) => {
                  return (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  );
                }
              )}
            </Select>
            <FormHelperText color="red">{errors?.age?.message}</FormHelperText>
          </FormControl>
          <FormControl isInvalid={errors?.gender?.message}>
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_gender")}
            </FormLabel>
            <Select
              variant="flushed"
              {...register("gender", {})}
              defaultValue={identity?.gender}
            >
              <option key={"unselected"} value={""}>
                {wordExtractor(page?.content?.wordings, "empty_text_label")}
              </option>
              {(enums?.EnumGenderList ?? []).map(
                ({ key: value, value: { [router.locale]: label } = {} }) => {
                  return (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  );
                }
              )}
            </Select>
            <FormHelperText color="red">
              {errors?.gender?.message}
            </FormHelperText>
          </FormControl>
        </Stack>
        <Stack direction={["column", "column", "row"]}>
          <FormControl isInvalid={errors?.district?.message}>
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_district")}
            </FormLabel>
            <Select
              variant="flushed"
              {...register("district", {
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
              })}
              defaultValue={identity?.district}
            >
              <option key={"unselected"} value={""}>
                {wordExtractor(page?.content?.wordings, "empty_text_label")}
              </option>
              {(enums?.EnumDistrictList ?? []).map(
                ({ key: value, value: { [router.locale]: label } = {} }) => {
                  return (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  );
                }
              )}
            </Select>
            <FormHelperText color="red">
              {errors?.district?.message}
            </FormHelperText>
          </FormControl>
          <FormControl isInvalid={errors?.industry?.message}>
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_industry")}
            </FormLabel>
            <Controller
              control={control}
              rules={{}}
              name={"industry"}
              defaultValue={identity?.industry ?? []}
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
        </Stack>

        <Stack direction={["column", "column", "row"]}>
          <FormControl>
            <FormLabel color="#757575" mb={0}>
              {wordExtractor(page?.content?.wordings, "field_label_wish_to_do")}
            </FormLabel>

            <Select
              variant="flushed"
              {...register("wishToDo", {
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
              })}
              defaultValue={identity?.wishToDo}
            >
              <option key={"unselected"} value={""}>
                {wordExtractor(page?.content?.wordings, "empty_text_label")}
              </option>
              {(enums?.EnumWishToDoList ?? []).map(
                ({ key: value, value: { [router.locale]: label } = {} }) => {
                  return (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  );
                }
              )}
            </Select>
          </FormControl>
          {wishToDoStatus === "other" && (
            <FormControl>
              <FormLabel color="#757575" mb={0}>
                {wordExtractor(
                  page?.content?.wordings,
                  "field_label_wish_to_do_other"
                )}
              </FormLabel>
              <Input
                variant="flushed"
                defaultValue={identity?.caption}
                {...register("wishToDoOther", {})}
              ></Input>
            </FormControl>
          )}
        </Stack>

        {identity?.phase2profile === false && (
          <Box>
            <VStack pb={{ base: 12 }} pt={{ base: 6 }}>
              <Grid templateColumns={"repeat(2, 1fr)"} width="100%" gap={6}>
                <GridItem colSpan={{ base: 2 }}>
                  <FormLabel color="#757575" mb={4}>
                    {wordExtractor(
                      page?.content?.wordings,
                      "wish_to_create_organization_label"
                    )}
                  </FormLabel>
                  <FormControl>
                    <Flex gap={2}>
                      <Button
                        flex={1}
                        backgroundColor={
                          showSelectCentre ? "#F6D644" : "transparent"
                        }
                        border={`2px solid ${
                          showSelectCentre ? "#FFFFFF" : "#999999"
                        }`}
                        height="38px"
                        width="117px"
                        onClick={() => setShowSelectCentre(true)}
                      >
                        {
                          page?.content?.form?.createOrganization?.options[0]
                            ?.label
                        }
                      </Button>

                      <Button
                        flex={1}
                        backgroundColor={"transparent"}
                        border={`2px solid #999999`}
                        height="38px"
                        width="117px"
                        type="submit"
                      >
                        {
                          page?.content?.form?.createOrganization?.options[1]
                            ?.label
                        }
                      </Button>
                    </Flex>
                  </FormControl>
                </GridItem>

                {showSelectCentre && (
                  <GridItem colSpan={{ base: 2 }} pt={6}>
                    <FormControl>
                      <FormLabel>
                        {page?.content?.form?.selectOrganization?.label}
                      </FormLabel>
                      <Controller
                        name="selectOrganization"
                        isClearable
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <ReactSelect
                            aria-label={
                              page?.content?.form?.selectOrganization?.label
                            }
                            {...field}
                            placeholder={wordExtractor(
                              page?.content?.wordings,
                              "select_organization_placeholder"
                            )}
                            options={(organizationData ?? []).map(
                              ({ chineseCompanyName, id }) => ({
                                label: chineseCompanyName,
                                value: id,
                              })
                            )}
                            onChange={(data) => {
                              const organization = organizationData.find(
                                (d) => d.id === data.value
                              );
                              setOrganization(organization);
                            }}
                          />
                        )}
                      />
                      <FormHelperText>
                        {
                          page?.content?.form?.selectOrganizationContent
                            ?.content01
                        }
                        <br />
                        {
                          page?.content?.form?.selectOrganizationContent
                            ?.content02
                        }
                        <Text
                          as="span"
                          color="#017878"
                          cursor="pointer"
                          onClick={() => router.push(`/user/organization/ngo/${identity.id}/add`)}
                        >
                          {page?.content?.form?.selectOrganizationContent?.link}
                        </Text>
                        !
                      </FormHelperText>
                    </FormControl>
                    {selectedOrganization && (
                      <Box
                        mt={8}
                        p={6}
                        bgColor={"#FAFAFA"}
                        borderRadius={"15px"}
                      >
                        <FormControl>
                          <FormLabel>
                            {page?.content?.form?.invitationCode}
                          </FormLabel>
                          <Input
                            type="text"
                            name="invitationCode"
                            variant="flushed"
                            {...register("invitationCode")}
                          />
                          {errors?.invitationCode?.message && (
                            <FormHelperText color="red">
                              {errors?.invitationCode?.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Box>
                    )}
                  </GridItem>
                )}
              </Grid>
              {selectedOrganization && (
                <FormControl textAlign="center">
                  <Button
                    mt={4}
                    backgroundColor="#F6D644"
                    borderRadius="22px"
                    height="44px"
                    width="117.93px"
                    onClick={() => handleSubmitInvitation()}
                    isLoading={submitting}
                  >
                    {wordExtractor(page?.content?.wordings, "save_label")}
                  </Button>
                </FormControl>
              )}
            </VStack>
          </Box>
        )}
      </VStack>
    </VStack>
  );
};

export default PublicSectionEditor;
