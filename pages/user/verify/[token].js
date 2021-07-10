import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
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
  // const setLogin = useLoginHook();
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
        <Container pt={36} maxW={400}>
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
      <Container pt={36} maxW={400}>
        <VStack spacing={8} as="form" onSubmit={handleSubmit(onUserCreate)}>
          <Heading>{getWording("emailVerify.heading")}</Heading>
          <Text>
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

          <FormControl>
            <FormLabel>{getWording("emailVerify.password_label")}</FormLabel>
            <Input
              type="password"
              {...register("password", {
                required: getWording("emailVerify.password_error_message"),
              })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>
              {getWording("emailVerify.password_confirm_label")}
            </FormLabel>
            <Input
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
          <FormControl>
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
              {getWording("emailVerify.create_account_label")}
            </Button>
          </FormControl>
        </VStack>
      </Container>
    </VStack>
  );
};

export default VerifyToken;
