import {
  Box,
  Button,
  Text,
  VStack,
  FormControl,
  Input,
  SimpleGrid,
  GridItem,
  // Select,
  Checkbox,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { useCallback, useEffect } from "react";
import { useForm , Controller} from "react-hook-form";
import ReactSelect from "react-select";

import { getConfiguration } from "../../../../utils/configuration/getConfiguration";
import { getPage } from "../../../../utils/page/getPage";
import withPageCMS from "../../../../utils/page/withPageCMS";
import { useRouter } from "next/router";
import { useAppContext } from "../../../../store/AppStore";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../../../../utils/apollo";

const PAGE_KEY = "identity_pwd_add";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      wordings: await getConfiguration({
        key: "wordings",
        lang: context.locale,
      }),
      header: await getConfiguration({ key: "header", lang: context.locale }),
      footer: await getConfiguration({ key: "footer", lang: context.locale }),
      setting: await getConfiguration({ key: "setting", lang: context.locale }),
      navigation: await getConfiguration({
        key: "navigation",
        lang: context.locale,
      }),
      lang: context.locale,
    },
  };
};

const IdentityPwdAdd = ({ page }) => {
  const router = useRouter();
  const { user } = useAppContext();
  const {
    handleSubmit,
    setError,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const onFormSubmit = useCallback(
    async ({
      chinese_name,
      english_name,
      date_of_birth,
      gender,
      resident_district,
      person_types,
      interested_employee,
      industry,
      terms,
    }) => {
      try {
    
        const mutation = gql`
          mutation IdentityCreate($input: IdentityCreateInput!) {
            IdentityCreate(input: $input) {
              id
            }
          }
        `;

        let data = await getGraphQLClient().request(mutation, {
          input: {
            userId: user.id,
            identity: "pwd",
            chineseName: chinese_name,
            englishName: english_name,
            dob: date_of_birth,
            gender: gender.value,
            district: resident_district.value,
            pwdType: person_types.map(({value}) => ({value}).value),
            interestedEmploymentMode:  interested_employee.map(({value}) => ({value}).value),
            interestedIndustry: industry.map(({value}) => ({value}).value),
            tncAccept: terms,
            email: user.email ? user.email : "",
            phone: user.phone ? user.phone : "",
          },
        });

        if (data && data.IdentityCreate) {
          router.push(`/user/identity/pwd/${data.IdentityCreate.id}/success`);
        }
      } catch (e) {
        console.log(e);
      }
    }
  );

  return (
    <VStack py={36}>
      <Text>{page?.content?.step?.title}</Text>
      <Text fontSize="30px" marginTop="5px">
        {page?.content?.step?.subTitle}
      </Text>
      <Box justifyContent="center" width="100%" marginTop="40px !important">
        <Box
          maxWidth={800}
          width="100%"
          textAlign="left"
          margin="auto"
          padding="25px"
        >
          <Text fontSize="16px" textAlign="center">
            {page?.content?.heading?.description}
          </Text>
          <VStack as="form" onSubmit={handleSubmit(onFormSubmit)}>
            <SimpleGrid pt={16} columns={[1, 2, 2, 2]} spacing={4} width="100%">
              <GridItem>
                <FormControl>
                  <FormLabel>{page?.content?.form?.chineseName} <Text as="span" color="red">*</Text></FormLabel>
                  <Input
                    type="text"
                    placeholder=""
                    {...register("chinese_name", {required: true})}
                  />
                  <FormHelperText >
                    {errors?.chinese_name?.type === "required" && <Text color="red" >輸入有效的中文名稱 Enter valid chinese name!</Text>}
                  </FormHelperText>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>{page?.content?.form?.englishName} <Text as="span" color="red">*</Text></FormLabel>
                  <Input
                    type="text"
                    placeholder=""
                    {...register("english_name", {required: true})}
                  />
                  <FormHelperText >
                    {errors?.english_name?.type === "required" && <Text color="red">輸入有效的英文名稱 Enter valid english name!</Text>}
                  </FormHelperText>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>{page?.content?.form?.dob}</FormLabel>
                  <Input
                    type="date"
                    placeholder=""
                    {...register("date_of_birth")}
                  />
                  <FormHelperText >
                    {errors?.date_of_birth?.message}
                  </FormHelperText>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>{page?.content?.form?.gender?.label}</FormLabel>
                  <Controller
                    name="gender"
                    isClearable
                    control={control}
                    render={({ field }) => (
                      <ReactSelect
                        {...field}
                        options={page?.content?.form?.gender?.options.map(({label, value}) => ({label, value}))}
                      />
                    )}
                  />
                </FormControl>
              </GridItem>
            </SimpleGrid>

            <FormControl>
              <FormLabel>
                {page?.content?.form?.residentRestrict?.label}
              </FormLabel>
              <Controller
                name="resident_district"
                isClearable
                control={control}
                render={({ field }) => (
                  <ReactSelect
                    {...field}
                    options={page?.content?.form?.residentRestrict?.options.map(({label, value}) => ({label, value}))}
                  />
                )}
              />
              <FormHelperText ></FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>
                {page?.content?.form?.personTypes?.label}
              </FormLabel>
              
              <Controller
                name="person_types"
                isClearable
                control={control}
                render={({ field }) => (
                  <ReactSelect
                    {...field}
                    isMulti
                    options={page?.content?.form?.personTypes?.options.map(({label, value}) => ({label, value}))}
                  />
                )}
              />
              <FormHelperText ></FormHelperText>
            </FormControl>          

             <FormControl>
                <FormLabel>{page?.content?.form?.employeerMode?.label} <Text as="span" color="red">*</Text></FormLabel>
                <Controller
                  name="interested_employee"
                  isClearable
                  control={control}
                  rules={{required:true}}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      isMulti
                      options={page?.content?.form?.employeerMode?.options.map(({label, value}) => ({label, value}))}
                    />
                  )}
                />
                <FormHelperText >
                  {errors?.interested_employee?.type === "required" && <Text color="red">請選擇感興趣的員工 Please select a interested employee!</Text>}
                </FormHelperText>
            </FormControl>    

            <FormControl>
              <FormLabel>{page?.content?.form?.industry?.label} <Text as="span" color="red">*</Text></FormLabel>
              
              <Controller
                name="industry"
                isClearable
                control={control}
                rules={{required:true}}
                render={({ field }) => (
                  <ReactSelect
                    {...field}
                    isMulti
                    options={page?.content?.form?.industry?.options.map(({label, value}) => ({label, value}))}
                  />
                )}
              />
              <FormHelperText >{errors?.industry?.type === "required" && <Text color="red">請選擇行業 Please select industry!</Text>}</FormHelperText>
            </FormControl>

            <FormControl marginTop="20px !important">
              <Checkbox colorScheme="green" {...register("terms", {required: true})}>
                {page?.content?.form?.terms}
              </Checkbox>
              <FormHelperText style={{color: 'red'}} >{errors?.terms?.type === "required" && <Text color="red">請接受條款和條件 Please accept T&C!</Text>}</FormHelperText>
            </FormControl>

            <FormControl textAlign="center">
              {/* <Button
                color="black"
                fontWeight="bold"
                lineHeight={3}
                borderRadius="20px"
                colorScheme="primary"
                bgColor="primary.400"
                isLoading={isSubmitting}
                type="submit"
              >
                {page?.content?.form?.continue}
              </Button> */}
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

export default withPageCMS(IdentityPwdAdd, {
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
        {
          name: "dob",
          label: "出生日期 Date of Birth Label",
          component: "text",
        },
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
          name: "residentRestrict",
          label: "居住區 Resident District Label",
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
          name: "personTypes",
          label: "人物類型 Person Types Label",
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
          name: "employeerMode",
          label: "雇主模式 Employeer Mode Label",
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
          label: "行業/工作 Industry/Job Label",
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
          name: "terms",
          label: "條款和條件 T&C Label",
          component: "text",
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
