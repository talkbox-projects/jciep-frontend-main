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
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Container from "../../../../components/Container";
import { useGetWording } from "../../../../utils/wordings/useWording";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { getPage } from "../../../../utils/page/getPage";
import { getConfiguration } from "../../../../utils/configuration/getConfiguration";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../../../../utils/apollo";
import { useAppContext } from "../../../../store/AppStore";
import { useCredential } from "../../../../utils/user";
import UserPasswordReset from "../../../../utils/api/UserPasswordReset";

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
  const resetPasswordToken = router.query.token;
  const getWording = useGetWording();
  const [emailVerify, setEmailVerify] = useState(null);
  const [, removeCredential] = useCredential();

  const {
    handleSubmit,
    setError,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const toast = useToast();

  const onPasswordReset = useCallback(
    async ({ password }) => {
      try {
        await UserPasswordReset({ token: resetPasswordToken, password });
        removeCredential();
        toast({
          status: "success",
          title: getWording("resentPassword.reset_password_successful_message"),
        });
        router.push("/");
      } catch (e) {
        console.log(e);
      }
    },
    [getWording, resetPasswordToken]
  );

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
          token: resetPasswordToken,
        });
        setEmailVerify(data?.UserEmailValidityCheck);
      } catch (e) {}
    })();
  }, [resetPasswordToken]);

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
        <Container py={72} maxWidth="400px" width="100%">
          <VStack
            spacing={8}
            as="form"
            onSubmit={handleSubmit(onPasswordReset)}
          >
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
                {getWording("resentPassword.reset_password_email_title")}
              </Button>
            </FormControl>
          </VStack>
        </Container>
      </Box>
    </VStack>
  );
};

export default VerifyToken;
