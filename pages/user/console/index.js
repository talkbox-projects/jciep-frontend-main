/** Copy from user/account */
import {
  Text,
  Icon,
  VStack,
  Avatar,
  HStack,
  Wrap,
  Button,
  Box,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Input,
  useToast,
} from "@chakra-ui/react";
import React, { useCallback, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  IoLogoApple,
  IoLogoFacebook,
  IoLogoGoogle,
  IoMail,
} from "react-icons/io5";
import { MdPhoneAndroid } from "react-icons/md";
import { RiArrowRightLine } from "react-icons/ri";
import Container from "../../../components/Container";
import { useAppContext } from "../../../store/AppStore";
import { useInjectParams, passwordRegex } from "../../../utils/general";
import { getPage } from "../../../utils/page/getPage";
import withPageCMS from "../../../utils/page/withPageCMS";
import getSharedServerSideProps from "../../../utils/server/getSharedServerSideProps";
import wordExtractor from "../../../utils/wordExtractor";
import UserPasswordResetByConsole from "../../../utils/api/UserPasswordResetByConsole";
import { useGetWording } from "../../../utils/wordings/useWording";

const PAGE_KEY = "account_info";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
      lang: context.locale,
      query: context?.query,
    },
  };
};

const AccountInfoPage = ({ page, query }) => {
  const injectParams = useInjectParams();
  const getWording = useGetWording();
  const getLoginMethod = useCallback(({ query }) => {
    return query?.type;
  }, []);
  const toast = useToast();

  const getLoginMethodDisplay = useCallback(
    ({ query }) => {
      let loginMethodDisplay = null;
      const loginMethod = getLoginMethod({ query });
      switch (loginMethod) {
        case "phone":
          loginMethodDisplay = (
            <HStack color="gray.600">
              <Icon fontSize="lg" as={MdPhoneAndroid} />{" "}
              <Text>
                {wordExtractor(page?.content?.wordings, "phone_label")}
              </Text>
            </HStack>
          );
          break;
        default:
          loginMethodDisplay = (
            <HStack color="gray.600">
              <Icon fontSize="lg" as={IoMail} />{" "}
              <Text>
                {wordExtractor(page?.content?.wordings, "email_label")}
              </Text>
            </HStack>
          );
      }

      if (loginMethod === "email") {
        return injectParams(wordExtractor(page?.content?.wordings, "message"), {
          displayName: <Text fontWeight="bold">{query?.email}</Text>,
          login_method: <>{loginMethodDisplay}</>,
        });
      } else if (loginMethod === "phone") {
        return injectParams(wordExtractor(page?.content?.wordings, "message"), {
          displayName: <Text fontWeight="bold">{query?.phone}</Text>,
          login_method: <>{loginMethodDisplay}</>,
        });
      }
    },
    [getLoginMethod, injectParams, page?.content?.wordings]
  );

  const {
    handleSubmit,
    register,
    setError,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();
  const handleResetPassword = useCallback(
    async ({ password }) => {
      try {
        const variables = {
          input: {
            email: query?.email??"",
            phone: query?.phone??"",
            password,
          },
        };

        const data = await UserPasswordResetByConsole({...variables.input});

        if(data){
          toast({
            status: "success",
            title: getWording("resentPassword.reset_password_successful_message"),
          });
        }

      } catch (e) {
        setError("password", {
          message: getWording("login.login_error_message"),
        });
      }
    },
    [getWording, setError]
  );

  console.log('errors', errors);

  return (
    <VStack py={[24, 48]}>
      <Container>
        <Text fontSize="4xl">
          {wordExtractor(page?.content?.wordings, "title")}
        </Text>
      </Container>
      <Container>
        <Wrap mt={8} spacing={1} align="center" px={1} borderRadius={8}>
          {getLoginMethodDisplay({ query })}
        </Wrap>
        <Box py={6} maxWidth={"md"}>
          <VStack
            as="form"
            onSubmit={handleSubmit(handleResetPassword)}
          >
          <FormControl isInvalid={!!errors?.password?.message}>
              <FormLabel>{getWording("emailVerify.password_label")}</FormLabel>
              <Input
                backgroundColor="#fff !important"
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

            <FormControl isInvalid={!!errors?.password_confirm}>
              <FormLabel>
                {getWording("emailVerify.password_confirm_label")}
              </FormLabel>
              <Input
                backgroundColor="#fff !important"
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
            {/* <FormControl>
              <FormLabel>{getWording("login.login_password_label")}</FormLabel>
              <Input
                type="password"
                placeholder={getWording("login.login_password_placeholder")}
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
              <FormHelperText color="red.500">
                {errors?.password?.message}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>{`確認${getWording(
                "login.login_password_label"
              )}`}</FormLabel>
              <Input
                name="confirmPassword"
                type="password"
                placeholder={`${getWording(
                  "login.login_password_placeholder"
                )}`}
                {...register("confirmPassword")}
              />
              <FormHelperText color="red.500">
                {errors?.confirmPassword?.message && getWording(errors?.confirmPassword?.message[0])}
              </FormHelperText>
            </FormControl> */}

            <Button
              backgroundColor="#F6D644"
              borderRadius="22px"
              height="44px"
              type="submit"
              isLoading={isSubmitting}
              d={"inline-block"}
              align="left"
            >
               {getWording("resentPassword.reset_password_email_title")}
            </Button>
          </VStack>
        </Box>
      </Container>
    </VStack>
  );
};

export default withPageCMS(AccountInfoPage, {
  key: PAGE_KEY,
  fields: [],
});
