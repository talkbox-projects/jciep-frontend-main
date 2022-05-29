import {
  Box,
  Button,
  Text,
  VStack,
  FormControl,
  Input,
  SimpleGrid,
  GridItem,
  Checkbox,
  FormHelperText,
  FormLabel,
  Link,
  Flex,
  Image,
  Center,
  Stack,
  Grid,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import ReactSelect from "react-select";
import { getPage } from "../../../../utils/page/getPage";
import withPageCMS from "../../../../utils/page/withPageCMS";
import { useRouter } from "next/router";
import { useAppContext } from "../../../../store/AppStore";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../../../../utils/apollo";
import getSharedServerSideProps from "../../../../utils/server/getSharedServerSideProps";
import wordExtractor from "../../../../utils/wordExtractor";
import { emailRegex } from "../../../../utils/general";
import organizationSearch from "../../../../utils/api/OrganizationSearch";
import OrganizationMemberJoin from "../../../../utils/api/OrganizationMemberJoin";
import OrganizationInvitationCodeValidity from "../../../../utils/api/OrganizationInvitationCodeValidity";

const PAGE_KEY = "identity_public_add";

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
  multiValue: (provided) => {
    const borderRadius = "15px";
    return { ...provided, borderRadius };
  },
  multiValueRemove: (provided) => {
    const color = "grey";
    return {
      ...provided,
      color,
      ":hover": { ...provided[":hover"], color: "#E60000" },
    };
  },
};

const IdentityPublicAdd = ({ page, api: { organizations } }) => {
  const router = useRouter();
  const { user } = useAppContext();
  const [formState, setFormState] = useState();
  const [step, setStep] = useState("step1");
  const [showSelectCentre, setShowSelectCentre] = useState(false);
  const [selectedOrganization, setOrganization] = useState(null);
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    setError,
    getValues
  } = useForm();

  const watchFields = watch(
    [
      "industry",
      "is_disability",
      "pwd_type",
      "wish_to_do",
      "selectOrganization",
    ],
    { pwd_type: [] }
  );

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
        if(invitationCode){
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

  const handleSubmitInvitation = async (formState) => {
    setError("invitationCode", {})
    const isValid = await OrganizationInvitationCodeValidity({
      invitationCode: getValues("invitationCode"),
      organizationType: "ngo",
    });

    if(!isValid) {
      setError("invitationCode", {message: wordExtractor(
        page?.content?.wordings,
        "invitation_code_error_message"
      )})
      return;
    }

    handlePostData(formState, getValues("invitationCode"))
  };

  const startCreateOrganization = async (input) => {
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
        router.push(`/user/organization/ngo/${data.IdentityCreate.id}/add`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onFormSubmit = async ({
    chinese_name,
    english_name,
    age,
    gender,
    resident_district,
    email,
    phone,
    industry,
    industry_other,
    terms,
    job_function,
    is_disability,
    wish_to_do,
    wish_to_do_other,
    pwd_type,
    pwd_other,
  }) => {
    const input = Object.fromEntries(
      Object.entries({
        userId: user.id,
        identity: "public",
        chineseName: chinese_name,
        englishName: english_name,
        age: age?.value,
        gender: gender?.value,
        district: resident_district?.value,
        email: email,
        phone: phone,
        jobFunction: job_function,
        industry: industry.value,
        industryOther: industry.value === "other" ? industry_other : "",
        isDisability: is_disability === "true",
        wishToDo: wish_to_do.value,
        wishToDoOther: wish_to_do.value === "other" ? wish_to_do_other : "",
        pwdType: pwd_type,
        pwdOther: pwd_type.includes("other") ? pwd_other : "",
        tncAccept: terms,
        phase2profile: true,
      }).filter(([v]) => v != null)
    );

    setFormState(input);
    setStep("step2");
  };

  if (step === "step2") {
    return (
      <VStack py={{ base: 36, md: 48 }}>
        <Text
          mt={4}
          fontSize="36px"
          letterSpacing="1.5px"
          fontWeight={600}
          px={"15px"}
        >
          {page?.content?.step?.step2Title}
        </Text>
        <Text fontSize="16px">{page?.content?.step?.step2SubTitle}</Text>
        <Box justifyContent="center" width="100%">
          <Box
            maxWidth={"md"}
            width="100%"
            textAlign="left"
            margin="auto"
            padding="0px 15px"
          >
            <VStack py={{ base: 12 }}>
              <Grid templateColumns={"repeat(2, 1fr)"} width="100%" gap={6}>
                <GridItem colSpan={{ base: 2 }}>
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
                        onClick={() => handlePostData(formState)}
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
                            options={(organizations ?? []).map(
                              ({ chineseCompanyName, id }) => ({
                                label: chineseCompanyName,
                                value: id,
                              })
                            )}
                            onChange={(data) => {
                              const organization = organizations.find(
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
                          onClick={() => startCreateOrganization(formState)}
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
                          {errors?.invitationCode?.message && <FormHelperText color="red">
                          {errors?.invitationCode?.message}
                          </FormHelperText>}
                        </FormControl>
                      </Box>
                    )}
                  </GridItem>
                )}
              </Grid>
              {selectedOrganization && (
                <FormControl textAlign="center">
                  <Button
                    backgroundColor="#F6D644"
                    borderRadius="22px"
                    height="44px"
                    width="117.93px"
                    onClick={() => handleSubmitInvitation(formState)}
                  >
                    {page?.content?.form?.continue}
                  </Button>
                </FormControl>
              )}
            </VStack>
          </Box>
        </Box>
      </VStack>
    );
  }

  if (step === "step1") {
    return (
      <VStack py={{ base: 36, md: 48 }}>
        <Text mt={10} fontSize="36px" letterSpacing="1.5px" fontWeight={600}>
          {page?.content?.step?.title}
        </Text>
        <Text fontSize="16px">{page?.content?.step?.subTitle}</Text>
        <Box justifyContent="center" width="100%">
          <Box
            maxWidth={800}
            width="100%"
            textAlign="left"
            margin="auto"
            padding="0px 25px"
          >
            <Text fontSize="16px" textAlign="center">
              {page?.content?.heading?.description}
            </Text>
            <VStack as="form" onSubmit={handleSubmit(onFormSubmit)}>
              <Grid
                templateColumns={"repeat(2, 1fr)"}
                width="100%"
                py={10}
                gap={6}
              >
                <GridItem colSpan={{ base: 2, md: 1 }}>
                  <FormControl isRequired>
                    <FormLabel>{page?.content?.form?.chineseName}</FormLabel>
                    <Input
                      type="text"
                      placeholder={wordExtractor(
                        page?.content?.wordings,
                        "chinese_name_placeholder"
                      )}
                      {...register("chinese_name", { required: true })}
                    />
                    <FormHelperText>
                      {errors?.chinese_name?.type === "required" && (
                        <Text color="red">
                          {wordExtractor(
                            page?.content?.wordings,
                            "chinese_name_required"
                          )}
                        </Text>
                      )}
                    </FormHelperText>
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 2, md: 1 }}>
                  <FormControl isRequired>
                    <FormLabel>{page?.content?.form?.englishName}</FormLabel>
                    <Input
                      type="text"
                      placeholder={wordExtractor(
                        page?.content?.wordings,
                        "english_name_placeholder"
                      )}
                      {...register("english_name", { required: true })}
                    />
                    <FormHelperText>
                      {errors?.english_name?.type === "required" && (
                        <Text color="red">
                          {wordExtractor(
                            page?.content?.wordings,
                            "english_name_required"
                          )}{" "}
                        </Text>
                      )}
                    </FormHelperText>
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 2, md: 1 }}>
                  <FormControl isRequired>
                    <FormLabel>{page?.content?.form?.age?.label}</FormLabel>
                    <Controller
                      name="age"
                      isClearable
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <ReactSelect
                          aria-label={page?.content?.form?.age?.label}
                          {...field}
                          placeholder={wordExtractor(
                            page?.content?.wordings,
                            "age_placeholder"
                          )}
                          options={page?.content?.form?.age?.options.map(
                            ({ label, value }) => ({ label, value })
                          )}
                        />
                      )}
                    />
                    <FormHelperText>
                      {errors?.age?.type === "required" && (
                        <Text color="red">
                          {wordExtractor(
                            page?.content?.wordings,
                            "age_required"
                          )}
                        </Text>
                      )}
                    </FormHelperText>
                  </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 2, md: 1 }}>
                  <FormControl isRequired>
                    <FormLabel>{page?.content?.form?.gender?.label}</FormLabel>
                    <Controller
                      name="gender"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <ReactSelect
                          aria-label={page?.content?.form?.gender?.label}
                          {...field}
                          placeholder={wordExtractor(
                            page?.content?.wordings,
                            "gender_placeholder"
                          )}
                          options={page?.content?.form?.gender?.options.map(
                            ({ label, value }) => ({ label, value })
                          )}
                        />
                      )}
                    />
                    <FormHelperText>
                      {errors?.gender?.type === "required" && (
                        <Text color="red">
                          {wordExtractor(
                            page?.content?.wordings,
                            "gender_required"
                          )}
                        </Text>
                      )}
                    </FormHelperText>
                  </FormControl>
                </GridItem>

                <GridItem colSpan={{ base: 2, md: 1 }}>
                  <FormControl isRequired>
                    <FormLabel>
                      {page?.content?.form?.residentRestrict?.label}
                    </FormLabel>
                    <Controller
                      name="resident_district"
                      isClearable
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <ReactSelect
                          aria-label={
                            page?.content?.form?.residentRestrict?.label
                          }
                          {...field}
                          placeholder={wordExtractor(
                            page?.content?.wordings,
                            "resident_district_placeholder"
                          )}
                          options={page?.content?.form?.residentRestrict?.options.map(
                            ({ label, value }) => ({ label, value })
                          )}
                        />
                      )}
                    />
                    <FormHelperText>
                      {errors?.resident_district?.type === "required" && (
                        <Text color="red">
                          {wordExtractor(
                            page?.content?.wordings,
                            "resident_restrict_required"
                          )}
                        </Text>
                      )}
                    </FormHelperText>
                  </FormControl>
                </GridItem>

                <GridItem colSpan={{ base: 2, md: 1 }}>
                  <FormControl isRequired>
                    <FormLabel>{page?.content?.form?.email}</FormLabel>
                    <Input
                      type="text"
                      placeholder={wordExtractor(
                        page?.content?.wordings,
                        "email_placeholder"
                      )}
                      {...register("email", {
                        required: true,
                        pattern: {
                          value: emailRegex,
                          message: wordExtractor(
                            page?.content?.wordings,
                            "email_invalid_format"
                          ),
                        },
                      })}
                    />
                    <FormHelperText>
                      {errors?.email?.type === "required" && (
                        <Text color="red">
                          {wordExtractor(
                            page?.content?.wordings,
                            "email_required"
                          )}{" "}
                        </Text>
                      )}
                      <Text color="red">{errors?.email?.message}</Text>
                    </FormHelperText>
                  </FormControl>
                </GridItem>

                <GridItem colSpan={{ base: 2, md: 1 }}>
                  <FormControl isRequired>
                    <FormLabel>{page?.content?.form?.phone}</FormLabel>
                    <Input
                      type="text"
                      placeholder={wordExtractor(
                        page?.content?.wordings,
                        "phone_placeholder"
                      )}
                      {...register("phone", { required: true })}
                    />
                    <FormHelperText>
                      {errors?.phone?.type === "required" && (
                        <Text color="red">
                          {wordExtractor(
                            page?.content?.wordings,
                            "phone_required"
                          )}{" "}
                        </Text>
                      )}
                    </FormHelperText>
                  </FormControl>
                </GridItem>

                <GridItem colSpan={{ base: 2, md: 1 }}>
                  <FormControl isRequired>
                    <FormLabel>
                      {page?.content?.form?.industry?.label}
                    </FormLabel>
                    <Controller
                      name="industry"
                      isClearable
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <ReactSelect
                          aria-label={page?.content?.form?.industry?.label}
                          styles={customStyles}
                          {...field}
                          placeholder={wordExtractor(
                            page?.content?.wordings,
                            "industry_placeholder"
                          )}
                          options={page?.content?.form?.industry?.options.map(
                            ({ label, value }) => ({ label, value })
                          )}
                        />
                      )}
                    />
                    <FormHelperText>
                      {errors?.industry?.type === "required" && (
                        <Text color="red">
                          {wordExtractor(
                            page?.content?.wordings,
                            "industry_required"
                          )}
                        </Text>
                      )}{" "}
                    </FormHelperText>
                  </FormControl>

                  {watchFields[0]?.value === "other" && (
                    <Box pt={2}>
                      <FormControl isRequired>
                        <FormLabel>
                          {page?.content?.form?.industryOther}
                        </FormLabel>
                        <Input
                          type="text"
                          placeholder={wordExtractor(
                            page?.content?.wordings,
                            "industry_other_placeholder"
                          )}
                          {...register("industry_other", { required: true })}
                        />
                        <FormHelperText>
                          {errors?.industry_other?.type === "required" && (
                            <Text color="red">
                              {wordExtractor(
                                page?.content?.wordings,
                                "industry_other_required"
                              )}
                            </Text>
                          )}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  )}
                </GridItem>

                <GridItem colSpan={{ base: 2, md: 1 }}>
                  <FormControl>
                    <FormLabel>{page?.content?.form?.jobFunction} </FormLabel>
                    <Input
                      type="text"
                      placeholder={wordExtractor(
                        page?.content?.wordings,
                        "job_function_placeholder"
                      )}
                      {...register("job_function")}
                    />
                  </FormControl>
                </GridItem>
              </Grid>

              <Box
                bgColor="#F3F3F3"
                h={"8px"}
                w={"100%"}
                style={{ margin: "0 0 40px 0" }}
              />

              <Grid templateColumns={"repeat(2, 1fr)"} width="100%" gap={6}>
                <GridItem colSpan={{ base: 2, md: 1 }}>
                  <FormControl isRequired>
                    <FormLabel>
                      {page?.content?.form?.isDisability?.label}
                    </FormLabel>
                    <Flex gap={2}>
                      {page?.content?.form?.isDisability?.options.map((d) => {
                        const isActive = d.value === watchFields[1];
                        return (
                          <Button
                            flex={1}
                            key={d.label}
                            backgroundColor={
                              isActive ? "#F6D644" : "transparent"
                            }
                            border={`2px solid ${
                              isActive ? "#FFFFFF" : "#999999"
                            }`}
                            height="38px"
                            width="117px"
                            onClick={() => {
                              setValue("is_disability", d.value);
                              setValue("pwd_type", []);
                            }}
                          >
                            {d.label}
                          </Button>
                        );
                      })}
                    </Flex>
                    <FormHelperText>
                      {errors?.is_disability?.type === "required" && (
                        <Text color="red">
                          {wordExtractor(
                            page?.content?.wordings,
                            "is_disability_required"
                          )}
                        </Text>
                      )}
                    </FormHelperText>
                  </FormControl>
                </GridItem>
              </Grid>

              <Box
                bgColor="#F3F3F3"
                h={"8px"}
                w={"100%"}
                style={{ margin: "40px 0" }}
              />

              <Grid templateColumns={"repeat(2, 1fr)"} width="100%" gap={6}>
                <GridItem colSpan={{ base: 2, md: 2 }}>
                  {watchFields[1] === "true" && (
                    <Box pt={2}>
                      <FormControl>
                        <FormLabel>
                          {page?.content?.form?.pwdType?.label}
                        </FormLabel>

                        <Controller
                          control={control}
                          name="pwd_type"
                          rules={{ required: true }}
                          defaultValue={[]}
                          render={({ field: { value, name } }) => (
                            <SimpleGrid minChildWidth="150px" spacing="20px">
                              {page?.content?.form?.pwdType?.options.map(
                                (d, i) => {
                                  const BG_COLORS = [
                                    "#FFDA94",
                                    "#FEB534",
                                    "#97CB8D",
                                    "#F6D644",
                                    "#FEB534",
                                    "#FFDA94",
                                    "#00BFBA",
                                    "#97CB8D",
                                    "#F6D644",
                                    "#00BFBA",
                                    "#FFDA94",
                                  ];
                                  return (
                                    <Box
                                      key={d.label}
                                      height="130px"
                                      width="150px"
                                      borderRadius={"10px"}
                                      border={"1px solid #EFEFEF"}
                                      bgColor={
                                        value.includes(d.value)
                                          ? "#F6D644"
                                          : "#FFFFFF"
                                      }
                                      cursor="pointer"
                                      onClick={() => {
                                        value.includes(d.value)
                                          ? setValue(
                                              name,
                                              value.filter((i) => i !== d.value)
                                            )
                                          : setValue(name, [...value, d.value]);
                                        if (d.value === "other") {
                                          setValue("pwd_other", "");
                                        }
                                      }}
                                    >
                                      <Center h={"100%"}>
                                        <Stack direction={"column"} spacing={2}>
                                          <Box
                                            textAlign="center"
                                            bgColor={
                                              value.includes(d.value)
                                                ? "#FFF"
                                                : BG_COLORS[i]
                                            }
                                            borderRadius={"50%"}
                                            w={"48px"}
                                            h={"48px"}
                                            mx={"auto"}
                                          >
                                            <Center h={"100%"}>
                                              <Image
                                                src={`/images/app/${d.value}.svg`}
                                                d={"inline-block"}
                                              />
                                            </Center>
                                          </Box>
                                          <Text textAlign="center">
                                            {d.label}
                                          </Text>
                                        </Stack>
                                      </Center>
                                    </Box>
                                  );
                                }
                              )}
                            </SimpleGrid>
                          )}
                        />

                        <FormHelperText>
                          {errors?.pwd_type?.type === "required" && (
                            <Text color="red">
                              {wordExtractor(
                                page?.content?.wordings,
                                "pwd_type_required"
                              )}
                            </Text>
                          )}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  )}
                </GridItem>
                {watchFields[2] !== undefined &&
                  watchFields[2]?.includes("other") && (
                    <GridItem colSpan={{ base: 2, md: 1 }}>
                      <FormControl>
                        <FormLabel>{page?.content?.form?.pwdOther} </FormLabel>
                        <Input
                          type="text"
                          placeholder={wordExtractor(
                            page?.content?.wordings,
                            "pwd_other_placeholder"
                          )}
                          {...register("pwd_other", {
                            required: true,
                            defaultValue: "",
                          })}
                        />
                      </FormControl>
                    </GridItem>
                  )}

                <GridItem colSpan={{ base: 2, md: 1 }}>
                  <FormControl>
                    <FormLabel isRequired>
                      {page?.content?.form?.wishToDo?.label}
                    </FormLabel>
                    <Controller
                      name="wish_to_do"
                      isClearable
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <ReactSelect
                          aria-label={page?.content?.form?.wishToDo?.label}
                          styles={customStyles}
                          {...field}
                          placeholder={wordExtractor(
                            page?.content?.wordings,
                            "wish_to_do_placeholder"
                          )}
                          options={page?.content?.form?.wishToDo?.options.map(
                            ({ label, value }) => ({ label, value })
                          )}
                        />
                      )}
                    />
                    <FormHelperText>
                      {errors?.wish_to_do?.type === "required" && (
                        <Text color="red">
                          {wordExtractor(
                            page?.content?.wordings,
                            "wish_to_do_required"
                          )}
                        </Text>
                      )}
                    </FormHelperText>
                  </FormControl>

                  {watchFields[3]?.value === "other" && (
                    <Box pt={2}>
                      <FormControl isRequired>
                        <FormLabel>
                          {page?.content?.form?.wishToDoOther}
                        </FormLabel>
                        <Input
                          type="text"
                          placeholder={wordExtractor(
                            page?.content?.wordings,
                            "wish_to_do_other_placeholder"
                          )}
                          {...register("wish_to_do_other", { required: true })}
                        />
                        <FormHelperText>
                          {errors?.wish_to_do_other?.type === "required" && (
                            <Text color="red">
                              {wordExtractor(
                                page?.content?.wordings,
                                "wish_to_do_other_required"
                              )}
                            </Text>
                          )}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  )}
                </GridItem>
              </Grid>
              <FormControl marginTop="20px !important">
                <Checkbox
                  aria-describedby={wordExtractor(
                    page?.content?.wordings,
                    "tnc_required"
                  )}
                  colorScheme="green"
                  {...register("terms", { required: true })}
                >
                  {page?.content?.form?.terms?.text}{" "}
                  <Link target="_blank" href={page?.content?.form?.terms?.url}>
                    {" "}
                    {page?.content?.form?.terms?.link}{" "}
                  </Link>
                </Checkbox>
                <FormHelperText>
                  {errors?.terms?.type === "required" && (
                    <Text color="red">
                      {wordExtractor(page?.content?.wordings, "tnc_required")}
                    </Text>
                  )}
                </FormHelperText>
              </FormControl>

              <FormControl textAlign="center">
                <Button
                  backgroundColor="#F6D644"
                  borderRadius="22px"
                  height="44px"
                  width="117.93px"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  {page?.content?.form?.continue}
                </Button>
              </FormControl>
            </VStack>
          </Box>
        </Box>
      </VStack>
    );
  }

  return <div></div>;
};

export default withPageCMS(IdentityPublicAdd, {
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
          name: "step2Title",
          label: "步驟二 Title",
          component: "text",
        },
        {
          name: "step2SubTitle",
          label: "步驟二副標題 Sub title",
          component: "text",
        },
        {
          name: "step3Title",
          label: "步驟三 Title",
          component: "text",
        },
        {
          name: "step3SubTitle",
          label: "步驟三副標題 Sub title",
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
          name: "chineseName",
          label: "中文名 Chinese Name Label",
          component: "text",
        },
        {
          name: "englishName",
          label: "英文名 English Name Label",
          component: "text",
        },
        // {
        //   name: "dob",
        //   label: "出生日期 Date of Birth ",
        //   component: "text",
        // },
        {
          name: "gender",
          label: "性別 Gender Label",
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
        {
          name: "age",
          label: "年齡 Age",
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
        {
          name: "phone",
          label: "電話 Phone Label",
          component: "text",
        },
        {
          name: "email",
          label: "電郵 Email Label",
          component: "text",
        },
        {
          name: "residentRestrict",
          label: "居住區域 Resident District ",
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
        {
          name: "industry",
          label: "從事行業 Industry",
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
        {
          name: "industryOther",
          label: "其他行業 Industry Other Label",
          component: "text",
        },
        {
          name: "jobFunction",
          label: "從事業務 Job Function Label",
          component: "text",
        },
        {
          name: "isDisability",
          label: "你是殘疾人士嗎 IsDisability Label",
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
        {
          name: "pwdType",
          label: "請問哪種殘疾 Pwd Type",
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
        {
          name: "pwdOther",
          label: "其他，請說明 Pwd Other Label",
          component: "text",
        },
        {
          name: "wishToDo",
          label: "你希望在此平台上參與的活動 Wish To Do",
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
        {
          name: "createOrganization",
          label: "你有興趣建立關於你的機構檔案嗎 Create Organization Label",
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
        {
          name: "selectOrganization",
          label: "選擇機構 select Organization Label",
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
        {
          name: "selectOrganizationContent",
          label: "機構名單 organization Content Label",
          component: "group",
          fields: [
            {
              name: "content01",
              label: "文本 text",
              component: "text",
            },
            {
              name: "content02",
              label: "文本2 text",
              component: "text",
            },
            {
              name: "link",
              label: "關聯 Link",
              component: "text",
            },
          ],
        },
        {
          name: "invitationCode",
          label: "邀請碼 Invitation Code Label",
          component: "text",
        },
        {
          name: "wishToDoOther",
          label: "其他，請說明 Wish To Do Other Label",
          component: "text",
        },
        {
          name: "terms",
          label: "條款和條件 T&C Label",
          component: "group",
          fields: [
            {
              name: "text",
              label: "文本 text",
              component: "text",
            },
            {
              name: "link",
              label: "關聯 Link",
              component: "text",
            },
            {
              name: "url",
              label: "關聯 Url",
              component: "text",
              placeholder: "https://",
            },
          ],
        },
        {
          name: "continue",
          label: "繼續標籤 Continue Label",
          component: "text",
        },
      ],
    },
  ],
});
