import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  Image,
  Box,
} from "@chakra-ui/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Container from "../../../components/Container";
import { useGetWording } from "../../../utils/wordings/useWording";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { getPage } from "../../../utils/page/getPage";
import { getConfiguration } from "../../../utils/configuration/getConfiguration";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../../../utils/apollo";
import { useAppContext } from "../../../store/AppStore";
import { useLoginHook, useCredential } from "../../../utils/user";

const PAGE_KEY = "verify_email";

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
      navigation: await getConfiguration({
        key: "navigation",
        lang: context.locale,
      }),
    },
  };
};

const VerifyToken = () => {
  const router = useRouter();
  const emailVerificationToken = router.query.token;
  const getWording = useGetWording();
  const [emailVerify, setEmailVerify] = useState(null);
  const [setCredential, removeCredential] = useCredential();
  const { setUser, setIdentityId } = useAppContext();

  const {
    handleSubmit,
    setError,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const onUserCreate = useCallback(async ({ password }) => {
    try {
      const mutation = gql`
        mutation UserLogin($input: LoginInput!) {
          UserLogin(input: $input) {
            token
            user {
              id
              email
              facebookId
              googleId
              appleId
              snsMeta {
                profilePicUrl
                displayName
              }
              identities {
                id
                type
                chineseName
                englishName
                dob
                gender
                district
                pwdType
                interestedEmploymentMode
                interestedIndustry
                industry
                tncAccept
                published
                email
                phone
                profilePic {
                  id
                  url
                  contentType
                  fileSize
                }
                bannerMedia {
                  file {
                    id
                    url
                    contentType
                    fileSize
                  }
                  videoUrl
                  title
                  description
                }
                yearOfExperience
                biography
                portfolio {
                  file {
                    id
                    url
                    contentType
                    fileSize
                  }
                  videoUrl
                  title
                  description
                }
                writtenLanguage
                writtenLanguageOther
                oralLanguage
                oralLanguageOther
                hobby
                education {
                  school
                  degree
                  fieldOfStudy
                  startDatetime
                  endDatetime
                  present
                }
                employment {
                  employmentType
                  companyName
                  jobTitle
                  industry
                  startDatetime
                  endDatetime
                  present
                }
                activity {
                  name
                  description
                  startDatetime
                  endDatetime
                }
              }
            }
          }
        }
      `;

      const data = await getGraphQLClient().request(mutation, {
        input: {
          emailVerificationToken,
          password,
        },
      });

      setCredential({
        token: data?.UserLogin?.token,
        user: data?.UserLogin?.user,
      });
      setIdentityId(data?.UserLogin?.user?.identities?.[0]?.id ?? null);
      router.push("/user/identity/select");
    } catch (e) {
      console.log(e);
      setError("password_confirm", {
        message: getWording("emailVerify.user_create_error_message"),
      });
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const query = gql`
          query UserEmailValidityCheck($token: String!) {
            UserEmailValidityCheck(token: $token) {
              email
              meta
            }
          }
        `;

        const data = await getGraphQLClient().request(query, {
          token: emailVerificationToken,
        });
        setEmailVerify(data?.UserEmailValidityCheck);
      } catch (e) {
        setError("password_confirm", {
          message: getWording("emailVerify.user_create_error_message"),
        });
      }
    })();
  }, [emailVerificationToken]);

  if (!emailVerify) {
    return (
      <VStack>
        <Container pt={36} maxWidth="400px" width="100%">
          <VStack spacing={8}>
            <Heading>{getWording("emailVerify.heading")}</Heading>
            <Text textAlign="center" fontSize="lg" color="red.500">
              {getWording("emailVerify.token_invalid_message")}
            </Text>
            <Link href="/">
              <Button
                color="black"
                w="100%"
                fontWeight="bold"
                lineHeight={3}
                borderRadius="3xl"
                colorScheme="primary"
                bgColor="primary.400"
                isLoading={isSubmitting}
                type="submit"
              >
                {getWording("emailVerify.back_to_home_button")}
              </Button>
            </Link>
          </VStack>
        </Container>
      </VStack>
    );
  }

  return (
    <VStack>
      <Box width="100%" background="#eeeeee">
        <Container paddingTop="15rem" maxWidth="400px" width="100%">
          <VStack spacing={8} as="form" onSubmit={handleSubmit(onUserCreate)}>
            <Text fontSize="36px" letterSpacing="1.5px">
              {getWording("emailVerify.heading")}
            </Text>

            <FormControl>
              <FormLabel>{getWording("emailVerify.password_label")}</FormLabel>
              <Input
                backgroundColor="#fff !important"
                type="password"
                {...register("password", {
                  required: getWording("emailVerify.password_error_message"),
                })}
              />

              <Text marginTop="10px">
                {getWording("emailVerify.description", {
                  params: {
                    email: (
                      <Text d="inline" fontWeight="bold">
                        {emailVerify.email}
                      </Text>
                    ),
                  },
                })}
              </Text>
            </FormControl>

            <FormControl>
              <FormLabel>
                {getWording("emailVerify.password_confirm_label")}
              </FormLabel>
              <Input
                backgroundColor="#fff !important"
                type="password"
                {...register("password_confirm", {
                  required: getWording(
                    "emailVerify.password_confirm_error_message"
                  ),
                })}
              />
              <FormHelperText color={errors?.password_confirm ? "red" : ""}>
                {errors?.password_confirm?.message}
              </FormHelperText>
            </FormControl>
            <FormControl textAlign="center">
              <Button
                color="black"
                fontWeight="bold"
                lineHeight={3}
                borderRadius="3xl"
                colorScheme="primary"
                bgColor="primary.400"
                isLoading={isSubmitting}
                type="submit"
              >
                {getWording("emailVerify.create_account_label")}
              </Button>
            </FormControl>
          </VStack>
        </Container>
        <Container maxWidth="1100px" width="100%">
          <Image
            height="450px"
            width="100%"
            src="https://resources-live.sketch.cloud/files/ba4afda5-647f-4d23-9b6d-2950c863a289.png?Expires=1626606000&Signature=udUf7nincAEVRE6f77C6ib0LVf9MFOk6LwpuABHckzO75dpswmDgXyVZGYPWLDMdC79xcVh-b2in7xJT9KQPzoUAQrQGAuo8-MA0ejQFLriITSlKfoT0ayeL1egoOIAFjXXJT11sN1gQ7i~5oAZE8mwI8QUJc0LxonmwOfi1s4o_&Key-Pair-Id=APKAJOITMW3RWOLNNPYA"
          ></Image>
        </Container>
      </Box>
    </VStack>
  );
};

export default VerifyToken;
