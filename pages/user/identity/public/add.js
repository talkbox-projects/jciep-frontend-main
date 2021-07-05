import {
  Box,
  Button,
  Text,
  VStack,
  FormControl,
  Input,
  SimpleGrid,
  GridItem,
  Select,
  Checkbox,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { getConfiguration } from "../../../../utils/configuration/getConfiguration";
import { getPage } from "../../../../utils/page/getPage";
import withPageCMS from "../../../../utils/page/withPageCMS";
import { useRouter } from "next/router";
import { useAppContext } from "../../../../store/AppStore";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../../../../utils/apollo";

const PAGE_KEY = "identity_public_add";

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

const IdentityPublicAdd = ({ page }) => {
  const router = useRouter();
  const { user } = useAppContext();

  const {
    handleSubmit,
    setError,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const validate = (
    chineseName,
    englishName,
    dateofBirth,
    gender,
    residentDistrict,
    personTypes,
    interestedEmployee,
    industry,
    terms
  ) => {
    if (chineseName.trim() === "") {
      setError("chinese_name", {
        type: "manual",
        message: "輸入有效的中文名稱 Enter valid chinese name! ",
      });
      return true;
    } else if (englishName.trim() === "") {
      setError("english_name", {
        type: "manual",
        message: "輸入有效的英文名稱 Enter valid english name! ",
      });
      return true;
    } else if (residentDistrict === "none") {
      setError("resident_district", {
        type: "manual",
        message: "請選擇居住區 Please select a resident district! ",
      });
      return true;
    } else if (industry === "none") {
      setError("industry", {
        type: "manual",
        message: "請選擇行業 Please select industry! ",
      });
      return true;
    } else if (terms === false) {
      setError("terms", {
        type: "manual",
        message: "請接受條款和條件 Please accept T&C! ",
      });
      return true;
    } else {
      return false;
    }
  };

  const onFormSubmit = useCallback(
    async ({
      chinese_name,
      english_name,
      date_of_birth,
      gender,
      resident_district,
      industry,
      terms,
    }) => {
      try {
        if (
          validate(
            chinese_name,
            english_name,
            date_of_birth,
            gender,
            resident_district,
            industry,
            terms
          )
        ) {
          return;
        }
        console.log(chinese_name);
        console.log(english_name);
        console.log(date_of_birth);
        console.log(gender);
        console.log(resident_district);
        console.log(industry);
        console.log(terms);

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
            identity: "public",
            chineseName: chinese_name,
            englishName: english_name,
            dob: date_of_birth,
            gender: gender === "none" ? undefined : gender,
            district:
              resident_district === "none" ? undefined : resident_district,
            industry: industry === "none" ? undefined : industry,
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
      <Text mt={10}>{page?.content?.step?.title}</Text>
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
                  <FormLabel>{page?.content?.form?.chineseName}</FormLabel>
                  <Input
                    type="text"
                    placeholder=""
                    {...register("chinese_name")}
                  />
                  <FormHelperText>
                    {errors?.chinese_name?.message}
                  </FormHelperText>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>{page?.content?.form?.englishName}</FormLabel>
                  <Input
                    type="text"
                    placeholder=""
                    {...register("english_name")}
                  />
                  <FormHelperText>
                    {errors?.english_name?.message}
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
                  <FormHelperText>
                    {errors?.date_of_birth?.message}
                  </FormHelperText>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>{page?.content?.form?.gender?.label}</FormLabel>
                  <Select {...register("gender")}>
                    {page?.content?.form?.gender?.options?.map((option) => {
                      return (
                        <option key={option.id} value={option.value}>
                          {option.label}
                        </option>
                      );
                    })}
                  </Select>
                  <FormHelperText>{errors?.gender?.message}</FormHelperText>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>
                    {page?.content?.form?.residentRestrict?.label}
                  </FormLabel>
                  <Select {...register("resident_district")}>
                    {page?.content?.form?.residentRestrict?.options?.map(
                      (option) => {
                        return (
                          <option key={option.id} value={option.value}>
                            {option.label}
                          </option>
                        );
                      }
                    )}
                  </Select>
                  <FormHelperText>
                    {errors?.resident_district?.message}
                  </FormHelperText>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>{page?.content?.form?.industry?.label}</FormLabel>
                  <Select {...register("industry")}>
                    {page?.content?.form?.industry?.options?.map((option) => {
                      return (
                        <option key={option.id} value={option.value}>
                          {option.label}
                        </option>
                      );
                    })}
                  </Select>
                  <FormHelperText>{errors?.industry?.message}</FormHelperText>
                </FormControl>
              </GridItem>
            </SimpleGrid>
            <FormControl marginTop="20px !important">
              <Checkbox colorScheme="green" {...register("terms")}>
                {page?.content?.form?.terms}
              </Checkbox>
              <FormHelperText>{errors?.terms?.message}</FormHelperText>
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
        {
          name: "dob",
          label: "出生日期 Date of Birth ",
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
          label: "居住區 Resident District ",
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
          label: "行業/工作 Industry/Job ",
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
