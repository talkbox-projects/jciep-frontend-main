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
} from "@chakra-ui/react";
import React from "react";
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

const PAGE_KEY = "identity_public_add";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
      lang: context.locale,
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

const IdentityPublicAdd = ({ page }) => {
  const router = useRouter();
  const { user } = useAppContext();
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm();

  const watchFields = watch([
    "industry",
    "is_disability",
    "pwd_type",
    "wish_to_do",
  ],{ pwd_type: [] });

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
        industryOther: industry.value === 'other' ? industry_other : "",
        isDisability: is_disability === "true",
        wishToDo: wish_to_do.value,
        wishToDoOther: wish_to_do.value === 'other' ? wish_to_do_other : "",
        pwdType: pwd_type,
        pwdOther: pwd_type.includes("other") ? pwd_other : "",
        tncAccept: terms,
        phase2profile: true,
      }).filter(([v]) => v != null)
    );

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
      }
    } catch (e) {
      console.error(e);
    }
  };

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
            <SimpleGrid pt={16} columns={[1, 2, 2, 2]} spacing={4} width="100%">
              <GridItem>
                <FormControl>
                  <FormLabel>
                    {page?.content?.form?.chineseName}{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
                  </FormLabel>
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
              <GridItem>
                <FormControl>
                  <FormLabel>
                    {page?.content?.form?.englishName}{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
                  </FormLabel>
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
              <GridItem>
                <FormControl>
                  <FormLabel>
                    {page?.content?.form?.age?.label}{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
                  </FormLabel>
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
                        {wordExtractor(page?.content?.wordings, "age_required")}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>
                    {page?.content?.form?.gender?.label}{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
                  </FormLabel>
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

              <GridItem>
                <FormControl>
                  <FormLabel>
                    {page?.content?.form?.residentRestrict?.label}{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
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

              <GridItem>
                <FormControl>
                  <FormLabel>
                    {page?.content?.form?.email}{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "email_placeholder"
                    )}
                    {...register("email", { required: true, pattern: {
                    value: emailRegex,
                    message: wordExtractor(
                          page?.content?.wordings,
                          "email_invalid_format"
                        )
                  }})}
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

              <GridItem>
                <FormControl>
                  <FormLabel>
                    {page?.content?.form?.phone}{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
                  </FormLabel>
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

              <GridItem>
                <FormControl>
                  <FormLabel>
                    {page?.content?.form?.industry?.label}{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
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
                    <FormControl>
                      <FormLabel>
                        {page?.content?.form?.industryOther}{" "}
                        <Text as="span" color="red">
                          *
                        </Text>
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

              <GridItem>
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

              <GridItem>
                <FormControl>
                  <FormLabel>
                    {page?.content?.form?.isDisability?.label}{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
                  </FormLabel>
                  <Flex gap={2}>
                    {page?.content?.form?.isDisability?.options.map((d) => {
                      const isActive = d.value === watchFields[1];
                      return (
                        <Button
                          flex={1}
                          key={d.label}
                          backgroundColor={isActive ? "#F6D644" : "transparent"}
                          border={`2px solid ${
                            isActive ? "#FFFFFF" : "#999999"
                          }`}
                          height="38px"
                          width="117px"
                          onClick={() => {
                            setValue("is_disability", d.value)
                            setValue("pwd_type", [])
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

              <GridItem colSpan={2}>
              {watchFields[1] === "true" && (<Box pt={2}>
                  <FormControl>
                    <FormLabel>{page?.content?.form?.pwdType?.label}</FormLabel>

                    <Controller
                      control={control}
                      name="pwd_type"
                      rules={{ required: true }}
                      defaultValue={[]}
                      render={({ field: { value, name } }) => (
                        <SimpleGrid minChildWidth="150px" spacing="20px">
                          {page?.content?.form?.pwdType?.options.map((d, i) => {
                            const BG_COLORS = ["#FFDA94", "#FEB534", "#97CB8D", "#F6D644", "#FEB534", "#FFDA94", "#00BFBA", "#97CB8D", "#F6D644", "#00BFBA", "#FFDA94"]
                            return (
                              <Box
                                key={d.label}
                                height="130px"
                                width="150px"
                                borderRadius={"10px"}
                                border={"1px solid #EFEFEF"}
                                bgColor={value.includes(d.value) ? "#F6D644" : "#FFFFFF"}
                                cursor="pointer"
                                onClick={() =>{
                                  value.includes(d.value)
                                    ? setValue(
                                        name,
                                        value.filter((i) => i !== d.value)
                                      )
                                    : setValue(name, [...value, d.value])
                                  if(d.value==="other"){
                                    setValue('pwd_other', "")
                                  }
                                  }
                                }
                              >
                                <Center h={"100%"}>
                                  <Stack direction={"column"} spacing={2}>
                                    <Box
                                      textAlign="center"
                                      bgColor={value.includes(d.value) ? "#FFF" : BG_COLORS[i]}
                                      borderRadius={"50%"}
                                      w={'48px'}
                                      h={'48px'}
                                      mx={'auto'}
                                    >
                                    <Center h={"100%"}>
                                    <Image
                                        src={`/images/app/${d.value}.svg`}
                                        d={"inline-block"}
                                      />
                                    </Center>

                                    </Box>
                                    <Text textAlign="center">{d.label}</Text>
                                  </Stack>
                                </Center>
                              </Box>
                            );
                          })}
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
                </Box>)}
              </GridItem>
              {watchFields[2] !== undefined && watchFields[2]?.includes("other") && (
                <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel>{page?.content?.form?.pwdOther} </FormLabel>
                      <Input
                        type="text"
                        placeholder={wordExtractor(
                          page?.content?.wordings,
                          "pwd_other_placeholder"
                        )}
                        {...register("pwd_other", { required: true, defaultValue: "" })}
                      />
                    </FormControl>
                  </GridItem>
                )}

              <GridItem>
                <FormControl>
                  <FormLabel>
                    {page?.content?.form?.wishToDo?.label}{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
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
                    <FormControl>
                      <FormLabel>
                        {page?.content?.form?.wishToDoOther}{" "}
                      <Text as="span" color="red">
                        *
                      </Text>
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
            </SimpleGrid>
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
      ],
    },
    {
      name: "heading",
      label: "標題 Heading",
      component: "group",
      fields: [
        {
          name: "description",
          label: "描述 Description",
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
