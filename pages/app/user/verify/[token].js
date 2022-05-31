import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  Image,
  Box,
  FormErrorMessage,
} from "@chakra-ui/react";
import Link from "next/link";
import Container from "../../../../components/Container";
import { useGetWording } from "../../../../utils/wordings/useWording";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { getPage } from "../../../../utils/page/getPage";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../../../../utils/apollo";
import { useAppContext } from "../../../../store/AppStore";
import { useCredential } from "../../../../utils/user";
import { passwordRegex } from "../../../../utils/general";
import withPageCMS from "../../../../utils/page/withPageCMS";
import userLogin from "../../../../utils/api/UserLogin";
import getSharedServerSideProps from "../../../../utils/server/getSharedServerSideProps";

const PAGE_KEY = "verify_email";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
    },
  };
};

const labelStyles = {
  marginBottom: "0px",
};

const VerifyToken = ({ page }) => {
  const router = useRouter();
  const emailVerificationToken = router.query.token;
  const getWording = useGetWording();
  const [emailVerify, setEmailVerify] = useState(null);
  const [setCredential] = useCredential();
  const { setIdentityId } = useAppContext();

  const {
    handleSubmit,
    setError,
    register,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  const onUserCreate = async ({ password }) => {
    try {
      const user = await userLogin({
        input: {
          emailVerificationToken,
          password,
        },
      });
      setCredential(user);
      setIdentityId(user?.identities?.[0]?.id ?? null);
      router.push("/user/identity/select");
    } catch (e) {
      console.error(e);
      setError("password_confirm", {
        message: getWording("emailVerify.user_create_error_message"),
      });
    }
  };

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
  }, [emailVerificationToken, getWording, setError]);

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
    <Box py={{ base: 24 }}>
      <Text fontSize="24px" letterSpacing="1.5px" fontWeight={600} px={"15px"}>
        {getWording("emailVerify.heading")}
      </Text>
      <Box width="100%" background="#FFF">
        <VStack
          p={"15px"}
          spacing={8}
          as="form"
          onSubmit={handleSubmit(onUserCreate)}
        >
          <FormControl isInvalid={!!errors?.password?.message}>
            <FormLabel>{getWording("emailVerify.password_label")}</FormLabel>
            <Input
              backgroundColor="#fff !important"
              variant="flushed"
              type="password"
              {...register("password", {
                required: {
                  value: true,
                  message: getWording("emailVerify.password_error_message"),
                },
                pattern: {
                  value: passwordRegex,
                  message: getWording("register.register_password_pattern"),
                },
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
            <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors?.password_confirm?.message}>
            <FormLabel>
              {getWording("emailVerify.password_confirm_label")}
            </FormLabel>
            <Input
              backgroundColor="#fff !important"
              variant="flushed"
              type="password"
              {...register("password_confirm", {
                required: {
                  value: true,
                  message: getWording(
                    "emailVerify.password_confirm_error_message"
                  ),
                },
                validate: (v) =>
                  v === getValues("password") ||
                  getWording("emailVerify.password_confirm_not_same")[0],
              })}
            />
            <FormErrorMessage>
              {errors?.password_confirm?.message}
            </FormErrorMessage>
          </FormControl>
        </VStack>
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
              {getWording("emailVerify.create_account_label")}
            </Button>
          </FormControl>
        </Box>
        {page?.content?.bgImage && (
          <Container
            h="450px"
            pos="relative"
            mt={4}
            maxWidth="1100px"
            width="100%"
          >
            <Image
              alt=""
              pos="absolute"
              bottom="0"
              left="0"
              width="100%"
              src={page?.content?.bgImage}
            ></Image>
          </Container>
        )}
      </Box>
    </Box>
  );
};

export default withPageCMS(VerifyToken, {
  key: PAGE_KEY,
  fields: [
    {
      label: "Background Image 背景圖片",
      name: "bgImage",
      component: "image",
      uploadDir: () => "/verifyEmail",
      parse: ({ previewSrc }) => previewSrc,
      previewSrc: (src) => src,
    },
  ],
});
