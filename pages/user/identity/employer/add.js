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
  Link,
  FormLabel,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";

import { getPage } from "../../../../utils/page/getPage";
import withPageCMS from "../../../../utils/page/withPageCMS";
import { useAppContext } from "../../../../store/AppStore";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../../../../utils/apollo";
import getSharedServerSideProps from "../../../../utils/server/getSharedServerSideProps";
import wordExtractor from "../../../../utils/wordExtractor";
import OrganizationInvitationCodeValidity from "../../../../utils/api/OrganizationInvitationCodeValidity";

const PAGE_KEY = "employer_identity_add";

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

const IdentityEmployerAdd = ({ page }) => {
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
      contactPersonName,
      contactEmailAdress,
      contactNumber,
      terms,
      invitationCode,
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
            identity: "employer",
            chineseName: contactPersonName,
            englishName: contactPersonName,
            tncAccept: terms,
            email: contactEmailAdress,
            phone: contactNumber,
            invitationCode,
          },
        });

        if (data) {
          if (!invitationCode) {
            router.push(
              `/user/organization/company/${data.IdentityCreate.id}/add`
            );
          } else {
            router.push(`/user/identity/${data.IdentityCreate.id}`);
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  );

  return (
    <VStack py={36}>
      <Text mt={10} fontSize="16px">
        {page?.content?.step?.title}
      </Text>
      <Text fontSize="36px" letterSpacing="1.5px" fontWeight={600}>
        {page?.content?.step?.subTitle}
      </Text>
      <Box justifyContent="center" width="100%" marginTop="30px !important">
        <Box
          maxWidth={800}
          width="100%"
          textAlign="left"
          margin="auto"
          padding="25px"
        >
          <VStack as="form" onSubmit={handleSubmit(onFormSubmit)}>
            <SimpleGrid columns={[1, 2, 2, 2]} spacing={4} width="100%">
              <GridItem>
                <FormControl>
                  <FormLabel>
                    {page?.content?.form?.contactPersonName}{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "contact_person_name_placeholder"
                    )}
                    {...register("contactPersonName", {
                      required: true,
                    })}
                  />
                  <FormHelperText>
                    {errors?.contactPersonName?.type === "required" && (
                      <Text color="red">
                        {/* 輸入有效的聯繫人姓名 Enter valid contact person name! */}
                        {wordExtractor(
                          page?.content?.wordings,
                          "contact_person_name_required"
                        )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>
                    {page?.content?.form?.contactEmailAdress}{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "contact_email_placeholder"
                    )}
                    {...register("contactEmailAdress", {
                      required: true,
                      pattern:
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    })}
                  />
                  <FormHelperText>
                    {errors?.contactEmailAdress?.type === "required" && (
                      <Text color="red">
                        {/* "輸入有效的聯繫電子郵件地址 Enter valid contact email
                        address! */}

                      {wordExtractor(
                        page?.content?.wordings,
                        "contact_email_required"
                      )}
                      </Text>
                    )}
                    {errors?.contactEmailAdress?.type === "pattern" && (
                      <Text color="red">
                        {/* "輸入有效的聯繫電子郵件地址 Enter valid contact email
                        address! */}
                        {wordExtractor(
                          page?.content?.wordings,
                        "contact_email_pattern"
                      )}
                      </Text>
                    )}
                  </FormHelperText>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>
                    {page?.content?.form?.contactNumber}{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "contact_number_placeholder"
                    )}
                    {...register("contactNumber", { required: true })}
                  />
                  <FormHelperText>
                    {errors?.contactNumber?.type === "required" && (
                      <Text color="red">
                        {/* 輸入有效的聯繫電話 Enter valid contact Number! */}
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
                <FormControl onInvalid={!!errors?.invitationCode?.message}>
                  <FormLabel>
                    {wordExtractor(
                      page?.content?.wordings,
                      "invitation_code_label"
                    )}
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder={wordExtractor(
                      page?.content?.wordings,
                      "invitation_code_label"
                    )}
                    {...register("invitationCode", {
                      validate: {
                        validity: async (invitationCode) => {
                          try {
                            if (!invitationCode) return true;
                            const valid =
                              await OrganizationInvitationCodeValidity({
                                invitationCode,
                                organizationType: "employment",
                              });
                            if (!valid) {
                              return wordExtractor(
                                page?.content?.wordings,
                                "invitation_code_error_message"
                              );
                            }
                            return true;
                          } catch (error) {
                            console.error(error);
                            return wordExtractor(
                              page?.content?.wordings,
                              "invitation_code_error_message"
                            );
                          }
                        },
                      },
                      pattern: {
                        value: /^[0-9]{6,6}$/,
                        message: wordExtractor(
                          page?.content?.wordings,
                          "invitation_code_error_message"
                        ),
                      },
                    })}
                  />
                  <FormHelperText color="red">
                    {errors?.invitationCode?.message}
                  </FormHelperText>
                </FormControl>
              </GridItem>
            </SimpleGrid>

            <FormControl marginTop="20px !important">
              <Checkbox
                colorScheme="green"
                {...register("terms", {
                  required: true,
                })}
              >
                {page?.content?.form?.terms?.text}

                <Link target="_blank" href={page?.content?.form?.terms?.url}>
                {page?.content?.form?.terms?.link}
                </Link>
              </Checkbox>
              <FormHelperText>
                {errors?.terms?.type === "required" && (
                  <Text color="red">
                    {/* 請接受條款和條件 Please accept T&C! */}
                      {wordExtractor(
                        page?.content?.wordings,
                        "tnc_required"
                      )}
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

export default withPageCMS(IdentityEmployerAdd, {
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
      name: "form",
      label: "形式 Form",
      component: "group",
      fields: [
        {
          name: "contactPersonName",
          label: "聯繫人姓名 Contact Person Name",
          component: "text",
        },
        {
          name: "contactEmailAdress",
          label: "聯繫電子郵件地址 Contact Email Address",
          component: "text",
        },
        {
          name: "contactNumber",
          label: "聯繫電話 Contact Number",
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
              placeholder:"https://"
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
