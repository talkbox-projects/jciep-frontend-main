import {
  Box,
  Button,
  Text,
  VStack,
  FormControl,
  Input,
  Textarea,
  Grid,
  GridItem,
  Checkbox,
  FormHelperText,
  FormLabel,
  Link,
  Flex,
  Image,
  Center,
  Stack,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import ReactSelect from "react-select";
import { getPage } from "../../../utils/page/getPage";
import withPageCMS from "../../../utils/page/withPageCMS";
import { useRouter } from "next/router";
import { useAppContext } from "../../../store/AppStore";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../../../utils/apollo";
import getSharedServerSideProps from "../../../utils/server/getSharedServerSideProps";
import wordExtractor from "../../../utils/wordExtractor";
import { emailRegex } from "../../../utils/general";
import organizationSearch from "../../../utils/api/OrganizationSearch";
import OrganizationMemberJoin from "../../../utils/api/OrganizationMemberJoin";
import OrganizationInvitationCodeValidity from "../../../utils/api/OrganizationInvitationCodeValidity";

const PAGE_KEY = "event_add";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
      lang: context.locale,
      api: {
        organizations: await organizationSearch({
          status: ["approved"],
          published: true,
          type: ["ngo"],
        }),
      },
    },
  };
};

const customStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: "0px",
    border: "none",
    borderBottom: "1px solid #EFEFEF",
  }),
};

const labelStyles = {
  marginBottom: "0px",
};

const SimpleDivider = () => (
  <Box bgColor="#F3F3F3" h={"8px"} w={"100%"} style={{ margin: "20px 0" }} />
);

const EventAdd = ({ page, api: { organizations } }) => {
  const router = useRouter();
  const { user } = useAppContext();
  const [countDescription, setCountDescription] = React.useState(0);
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    setError,
    getValues,
  } = useForm();

  const watchFields = watch(["type"], { type: [] });

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
        router.push(
          `/app/user/identity/public/${data.IdentityCreate.id}/success`
        );
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

  const onFormSubmit = async ({
    name,
    type,
    typeOther,
    description,
    startDate,
    endDate,
    startTime,
    endTime,
    datetimeRemark,
    venue,
    location,
    freeOrCharge,
    price,
    submissionDeadline,
    eventManager,
    contactNumber,
    registerUrl,
    otherUrl,
    stockPhotoId,
    remark,
    representOrganization,
    organizationId,
    organizationAdditionalInfo,
    banner,
    additionalInformation,
  }) => {
    const input = Object.fromEntries(
      Object.entries({
        userId: user.id,
        name: name,
        type: type,
        typeOther: type.value === "other" ? typeOther : "",
        description: description,
        // identity: "public",
        // chineseName: chinese_name,
        // englishName: english_name,
        // age: age?.value,
        // gender: gender?.value,
        // district: resident_district?.value,
        // email: email,
        // phone: phone,
        // jobFunction: job_function,
        // industry: industry.value,
        // industryOther: industry.value === "other" ? industry_other : "",
        // isDisability: is_disability === "true",
        // wishToDo: wish_to_do.value,
        // wishToDoOther: wish_to_do.value === "other" ? wish_to_do_other : "",
        // pwdType: pwd_type,
        // pwdOther: pwd_type.includes("other") ? pwd_other : "",
        // tncAccept: terms,
        // phase2profile: true,
      }).filter(([v]) => v != null)
    );

    console.log("input-", input);

    // setFormState(input);
  };

  return (
    <Box pt={{ base: "64px" }}>
      <Grid
        templateColumns="repeat(3, 1fr)"
        width="100%"
        px={"20px"}
        alignItems="center"
        h={"48px"}
        borderBottom="1px solid #EFEFEF"
        mb={"40px"}
      >
        <GridItem>
          {/* <Image src={"/images/app/back.svg"} alt={""} onClick={()=>router.push(`/app/user/register`)} /> */}
        </GridItem>
        <GridItem textAlign="center">
          <Text fontWeight={700}>{page?.content?.step?.title}</Text>
          <Text color="gray.500" fontSize={"12px"}>
            {page?.content?.step?.subTitle}
          </Text>
        </GridItem>
      </Grid>
      <Box justifyContent="center" width="100%">
        <Box maxWidth={800} width="100%" textAlign="left" margin="auto">
          <VStack pt={"16px"} as="form" onSubmit={handleSubmit(onFormSubmit)}>
            <Grid
              templateColumns="repeat(1, 1fr)"
              gap={"40px"}
              width="100%"
              px={"15px"}
            >
              <GridItem>
                <FormControl isRequired>
                  <FormLabel {...labelStyles}>
                    {wordExtractor(page?.content?.wordings, "name_label")}
                  </FormLabel>
                  <Input
                    type="text"
                    variant="flushed"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "name_placeholder"
                    )}
                    {...register("name", { required: true })}
                  />
                  <FormHelperText>
                    {errors?.name?.type === "required" && (
                      <Text color="red">
                        {wordExtractor(
                          page?.content?.wordings,
                          "name_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel {...labelStyles}>
                    {page?.content?.form?.type?.label}
                  </FormLabel>
                  <Controller
                    name="type"
                    isClearable
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <ReactSelect
                        aria-label={page?.content?.form?.type?.label}
                        {...field}
                        placeholder={wordExtractor(
                          page?.content?.wordings,
                          "type_placeholder"
                        )}
                        options={page?.content?.form?.type?.options.map(
                          ({ label, value }) => ({ label, value })
                        )}
                        styles={customStyles}
                        components={{
                          IndicatorSeparator: () => null,
                        }}
                      />
                    )}
                  />
                  <FormHelperText>
                    {errors?.type?.type === "required" && (
                      <Text color="red">
                        {wordExtractor(
                          page?.content?.wordings,
                          "type_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>

                {watchFields[0]?.value === "other" && (
                  <Box pt={4} p={6} bgColor={"#FAFAFA"} borderRadius={"15px"}>
                    <FormControl isRequired>
                      <FormLabel {...labelStyles}>
                        {wordExtractor(
                          page?.content?.wordings,
                          "type_other_label"
                        )}
                      </FormLabel>
                      <Input
                        type="text"
                        variant="flushed"
                        placeholder={wordExtractor(
                          page?.content?.wordings,
                          "type_other_placeholder"
                        )}
                        {...register("typeOther", { required: true })}
                      />
                      <FormHelperText>
                        {errors?.typeOther?.type === "required" && (
                          <Text color="red">
                            {wordExtractor(
                              page?.content?.wordings,
                              "type_other_required"
                            )}
                          </Text>
                        )}
                      </FormHelperText>
                    </FormControl>
                  </Box>
                )}
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel {...labelStyles}>
                    {wordExtractor(
                      page?.content?.wordings,
                      "description_label"
                    )}
                  </FormLabel>
                  <Input
                    type="text"
                    variant="flushed"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "description_placeholder"
                    )}
                    {...register("description", { required: true })}
                    onChange={(e) => setCountDescription(e.target.value.length)}
                    maxLength={250}
                  />
                  <FormHelperText>
                    {errors?.description?.type === "required" && (
                      <Text color="red">
                        {wordExtractor(
                          page?.content?.wordings,
                          "description_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
                <Text fontSize="12px" color="#666666">
                  {wordExtractor(
                    page?.content?.wordings,
                    "word_suggestions"
                  ).replace("$", countDescription)}
                </Text>
              </GridItem>
            </Grid>

            <SimpleDivider />

            <Box w="100%">
              <Text
                fontSize="20px"
                letterSpacing="1.5px"
                fontWeight={600}
                px={"15px"}
                mt={0}
                mb={2}
              >
                {page?.content?.step?.event}
              </Text>
            </Box>

            <Grid
              templateColumns="repeat(1, 1fr)"
              gap={"60px"}
              width="100%"
              px={"15px"}
            >
              <FormControl isRequired>
                <FormLabel {...labelStyles}>
                  {wordExtractor(page?.content?.wordings, "start_date_label")}
                </FormLabel>
                <Input
                  type="text"
                  variant="flushed"
                  placeholder={wordExtractor(
                    page?.content?.wordings,
                    "start_date_placeholder"
                  )}
                  {...register("startDate", { required: true })}
                />
                <FormHelperText>
                  {errors?.startDate?.type === "required" && (
                    <Text color="red">
                      {wordExtractor(
                        page?.content?.wordings,
                        "start_date_required"
                      )}
                    </Text>
                  )}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* 
            <Grid
              templateColumns="repeat(1, 1fr)"
              gap={"60px"}
              width="100%"
              px={"15px"}
            >
              <GridItem>
                <FormControl isRequired>
                  <FormLabel {...labelStyles}>
                    {wordExtractor(page?.content?.wordings, "start_date_label")}
                  </FormLabel>
                  <Input
                    type="text"
                    variant="flushed"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "start_date_placeholder"
                    )}
                    {...register("startDate", { required: true })}
                  />
                  <FormHelperText>
                    {errors?.startDate?.type === "required" && (
                      <Text color="red">
                        {wordExtractor(
                          page?.content?.wordings,
                          "start_date_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel {...labelStyles}>
                    {wordExtractor(page?.content?.wordings, "end_date_label")}
                  </FormLabel>
                  <Input
                    type="text"
                    variant="flushed"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "end_date_placeholder"
                    )}
                    {...register("endDate", { required: true })}
                  />
                  <FormHelperText>
                    {errors?.startDate?.type === "required" && (
                      <Text color="red">
                        {wordExtractor(
                          page?.content?.wordings,
                          "end_date_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel {...labelStyles}>
                    {wordExtractor(
                      page?.content?.wordings,
                      "date_time_remark_label"
                    )}
                  </FormLabel>
                  <Input
                    type="text"
                    variant="flushed"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "date_time_remark_placeholder"
                    )}
                    {...register("datetimeRemark")}
                  />
                </FormControl>
              </GridItem>
            </Grid>

            <Box
              bgColor="#F3F3F3"
              h={"8px"}
              w={"100%"}
              style={{ margin: "20px 0" }}
            />
            <Box w="100%">
              <Text
                fontSize="24px"
                letterSpacing="1.5px"
                fontWeight={600}
                px={"15px"}
                mt={0}
                mb={2}
              >
                {page?.content?.step?.date_time}
              </Text>
            </Box>

            <Grid
              templateColumns="repeat(1, 1fr)"
              gap={"60px"}
              width="100%"
              px={"15px"}
            >
              <GridItem>
                <FormControl>
                  <FormLabel {...labelStyles}>
                    {wordExtractor(page?.content?.wordings, "start_time_label")}
                  </FormLabel>
                  <Input
                    type="text"
                    variant="flushed"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "start_time_placeholder"
                    )}
                    {...register("startTime")}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel {...labelStyles}>
                    {wordExtractor(page?.content?.wordings, "end_time_label")}
                  </FormLabel>
                  <Input
                    type="text"
                    variant="flushed"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "end_time_placeholder"
                    )}
                    {...register("endTime")}
                  />
                </FormControl>
              </GridItem>
            </Grid>

            <Box
              bgColor="#F3F3F3"
              h={"8px"}
              w={"100%"}
              style={{ margin: "20px 0" }}
            />
            <Grid
              templateColumns="repeat(1, 1fr)"
              gap={"60px"}
              width="100%"
              px={"15px"}
            >
              <GridItem>
                <FormControl>
                  <FormLabel {...labelStyles}>
                    {wordExtractor(page?.content?.wordings, "venue_label")}
                  </FormLabel>
                  <Input
                    type="text"
                    variant="flushed"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "venue_placeholder"
                    )}
                    {...register("venue")}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel {...labelStyles}>
                    {wordExtractor(
                      page?.content?.wordings,
                      "free_or_charge_label"
                    )}
                  </FormLabel>
                  <Controller
                    name="freeOrCharge"
                    isClearable
                    control={control}
                    render={({ field }) => (
                      <ReactSelect
                        aria-label={page?.content?.form?.free_or_charge?.label}
                        {...field}
                        placeholder={wordExtractor(
                          page?.content?.wordings,
                          "free_or_charge_placeholder"
                        )}
                        options={page?.content?.form?.free_or_charge?.options.map(
                          ({ label, value }) => ({ label, value })
                        )}
                        styles={customStyles}
                        components={{
                          IndicatorSeparator: () => null,
                        }}
                      />
                    )}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                  <FormControl>
                    <FormLabel {...labelStyles}>
                      <FormLabel {...labelStyles}>
                        {wordExtractor(page?.content?.wordings, "price_label")}
                      </FormLabel>
                    </FormLabel>
                    <Input
                      type="text"
                      variant="flushed"
                      placeholder={wordExtractor(
                        page?.content?.wordings,
                        "price_placeholder"
                      )}
                      {...register("price")}
                    />
                  </FormControl>
                </GridItem>
            </Grid>
            <Box
              bgColor="#F3F3F3"
              h={"8px"}
              w={"100%"}
              style={{ margin: "20px 0" }}
            />

            <Box w="100%">
              <Text
                fontSize="24px"
                letterSpacing="1.5px"
                fontWeight={600}
                px={"15px"}
                mt={0}
                mb={2}
              >
                {page?.content?.step?.event_registration}
              </Text>
            </Box>

            <Grid
              templateColumns="repeat(1, 1fr)"
              gap={"60px"}
              width="100%"
              px={"15px"}
            >
              <GridItem>
                <FormControl>
                  <FormLabel {...labelStyles}>
                    {wordExtractor(
                      page?.content?.wordings,
                      "submission_deadline_label"
                    )}
                  </FormLabel>
                  <Input
                    type="text"
                    variant="flushed"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "submission_deadline_placeholder"
                    )}
                    {...register("submissionDeadline")}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel {...labelStyles}>
                    {wordExtractor(
                      page?.content?.wordings,
                      "event_manager_label"
                    )}
                  </FormLabel>
                  <Input
                    type="text"
                    variant="flushed"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "event_manager_placeholder"
                    )}
                    {...register("eventManager")}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel {...labelStyles}>
                    {wordExtractor(
                      page?.content?.wordings,
                      "contact_number_label"
                    )}
                  </FormLabel>

                  <Input
                    type="text"
                    variant="flushed"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "contact_number_placeholder"
                    )}
                    {...register("contactNumber", { required: true })}
                  />
                  <FormHelperText>
                    {errors?.contactNumber?.type === "required" && (
                      <Text color="red">
                        {wordExtractor(
                          page?.content?.wordings,
                          "contact_number_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel {...labelStyles}>
                    {wordExtractor(
                      page?.content?.wordings,
                      "register_url_label"
                    )}
                  </FormLabel>
                  <Input
                    type="text"
                    variant="flushed"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "register_url_placeholder"
                    )}
                    {...register("registerUrl")}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel {...labelStyles}>
                    {wordExtractor(page?.content?.wordings, "other_url_label")}
                  </FormLabel>
                  <Input
                    type="text"
                    variant="flushed"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "other_url_placeholder"
                    )}
                    {...register("otherUrl")}
                  />
                </FormControl>
              </GridItem>
            </Grid>
            <Box
              bgColor="#F3F3F3"
              h={"8px"}
              w={"100%"}
              style={{ margin: "20px 0" }}
            />

            <Box w="100%">
              <Text
                fontSize="24px"
                letterSpacing="1.5px"
                fontWeight={600}
                px={"15px"}
                mt={0}
                mb={2}
              >
                {page?.content?.step?.event_images}
              </Text>
            </Box>

            <Grid
              templateColumns="repeat(1, 1fr)"
              gap={"60px"}
              width="100%"
              px={"15px"}
            >
              <GridItem>
                <FormControl>
                  <FormLabel {...labelStyles}>
                    {wordExtractor(
                      page?.content?.wordings,
                      "stock_photo_id_label"
                    )}
                  </FormLabel>
                  <Input
                    type="text"
                    variant="flushed"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "stock_photo_id"
                    )}
                    {...register("stockPhotoId")}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel {...labelStyles}>
                    {wordExtractor(page?.content?.wordings, "remark_label")}
                  </FormLabel>
                  <Input
                    type="text"
                    variant="flushed"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "remark"
                    )}
                    {...register("remark")}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel {...labelStyles}>
                    {wordExtractor(page?.content?.wordings, "banner_label")}
                  </FormLabel>
                  <Input
                    type="text"
                    variant="flushed"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "organization_id"
                    )}
                    {...register("banner")}
                  />
                </FormControl>
              </GridItem>
            </Grid>
            <Box
              bgColor="#F3F3F3"
              h={"8px"}
              w={"100%"}
              style={{ margin: "20px 0" }}
            />

            <Box w="100%">
              <Text
                fontSize="24px"
                letterSpacing="1.5px"
                fontWeight={600}
                px={"15px"}
                mt={0}
                mb={2}
              >
                {page?.content?.step?.more_information}
              </Text>
            </Box>

            <Grid
              templateColumns="repeat(1, 1fr)"
              gap={"60px"}
              width="100%"
              px={"15px"}
            >
              <GridItem>
                <FormControl>
                  <Input
                    type="text"
                    variant="flushed"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "additional_information"
                    )}
                    {...register("additionalInformation")}
                  />
                </FormControl>
              </GridItem>
            </Grid> */}

            <Box
              style={{
                background:
                  "linear-gradient(180deg, rgba(57, 57, 57, 0.0001) 0%, #393939 100%)",
                marginTop: "60px",
              }}
              h={"16px"}
              w={"100%"}
              opacity={0.2}
            />
            <Box px={"15px"} py={"12px"} w="100%">
              <FormControl textAlign="center">
                <Button
                  backgroundColor="#F6D644"
                  borderRadius="22px"
                  height="44px"
                  width="100%"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  {page?.content?.form?.continue}
                </Button>
              </FormControl>
            </Box>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default withPageCMS(EventAdd, {
  key: PAGE_KEY,
  fields: [
    {
      name: "step",
      label: "標題 step",
      component: "group",
      fields: [
        {
          name: "title",
          label: "主標題 Title",
          component: "text",
        },
        {
          name: "subTitle",
          label: "副標題 Sub title",
          component: "text",
        },
        {
          name: "event",
          label: "日子 Sub title",
          component: "text",
        },
        {
          name: "date_time",
          label: "時間 Sub title",
          component: "text",
        },
        {
          name: "event_registration",
          label: "登記 Sub title",
          component: "text",
        },
        {
          name: "event_images",
          label: "圖片 Sub title",
          component: "text",
        },
        {
          name: "more_information",
          label: "更多圖片 Sub title",
          component: "text",
        },
      ],
    },
    {
      name: "form",
      label: "形式 Form",
      component: "group",
      fields: [
        {
          name: "type",
          label: "活動類別 Type Label",
          component: "group",
          fields: [
            {
              name: "label",
              label: "標籤 Label",
              component: "text",
            },
            {
              name: "options",
              label: "區段  Options",
              component: "group-list",
              itemProps: ({ id: key, caption: label }) => ({
                key,
                label,
              }),
              defaultItem: () => ({
                id: Math.random().toString(36).substr(2, 9),
              }),
              fields: [
                {
                  name: "label",
                  label: "標籤 Label",
                  component: "text",
                },
                {
                  name: "value",
                  label: "價值 Value",
                  component: "text",
                },
              ],
            },
          ],
        },
        // {
        //   name: "typeOther",
        //   label: "其他(請註明) Type Other",
        //   component: "text",
        // },
        // {
        //   name: "description",
        //   label: "活動介紹 Description Label",
        //   component: "text",
        // },
        // {
        //   name: "startDate",
        //   label: "舉辦日期（由）Start Date Label",
        //   component: "text",
        // },
      ],
    },
  ],
});
