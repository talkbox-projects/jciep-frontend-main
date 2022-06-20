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
  Code,
} from "@chakra-ui/react";
import Link from "next/link";
import Container from "../../../components/Container";
import { useGetWording } from "../../../utils/wordings/useWording";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { getPage } from "../../../utils/page/getPage";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../../../utils/apollo";
import { useAppContext } from "../../../store/AppStore";
import { useCredential } from "../../../utils/user";
import { passwordRegex } from "../../../utils/general";
import withPageCMS from "../../../utils/page/withPageCMS";
import userLogin from "../../../utils/api/UserLogin";
import getSharedServerSideProps from "../../../utils/server/getSharedServerSideProps";

const PAGE_KEY = "password_reset";

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

const VerifyToken = ({ page }) => {
  const router = useRouter();
  const { phone, email, otp } = router.query;
  const getWording = useGetWording();
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
      const user = await userLogin({ input: phone ? { phone, otp, password } : { email, otp, password } });
      setCredential(user);
      setIdentityId(user?.identities?.[0]?.id ?? null);
      router.push("/app/user/identity/public/add");
    } catch (e) {
      console.error(e);
      setError("password_confirm", {
        message: getWording("emailVerify.user_create_error_message"),
      });
    }
  };

  return (
    <Box py={{ base: 24 }}>
      <Text fontSize="24px" letterSpacing="1.5px" fontWeight={600} px={"15px"}>
      設定密碼
      </Text>
      <Box width="100%" background="#FFF">
        <VStack
          p={"15px"}
          mx={'-15px'}
          spacing={8}
          as="form"
          onSubmit={handleSubmit(onUserCreate)}
        >
          <FormControl isInvalid={!!errors?.password?.message} px={'15px'}>
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
            <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors?.password_confirm?.message} px={'15px'}>
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
        </VStack>

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
