import React, { useEffect } from "react";
import { useAppContext } from "../store/AppStore";
import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";
import getConfig from "next/config";
import {
  Box,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalOverlay,
  Button,
  VStack,
  HStack,
  Text,
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  IoLogoFacebook,
  IoLogoGoogle,
  IoMdPhonePortrait,
} from "react-icons/io";
import { AiOutlineMail } from "react-icons/ai";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../utils/apollo";
import { useGetWording } from "../utils/wordings/useWording";
import { useCredential } from "../utils/user";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import router from "next/router";
import GoogleLogin from "react-google-login";
import userLogin from "../utils/api/UserLogin";

const LoginModal = () => {
  const {
    loginModalDisclosure,
    registerModalDisclosure,
    otpVerifyModalDisclosure,
    resetPasswordEmailModalDisclosure,
    resetPasswordPhoneModalDisclosure
  } = useAppContext();

  const [tab, setTab] = useState("email");
  const getWording = useGetWording();
  const [setCredential] = useCredential();

  const [publicRuntimeConfig, setPublicRuntimeConfig] = useState({});
  useEffect(() => {
    setPublicRuntimeConfig(getConfig().publicRuntimeConfig);
  }, []);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onPhoneLogin =
    async ({ phone, password }) => {
      try {
        const variables = {
          input: {
            phone,
            password,
          },
        };
        const user = await userLogin(variables);
        setCredential(user);
        loginModalDisclosure.onClose();
        if (user) {
          if (user?.identities?.length === 0) {
            router.push("/user/identity/select");
          } else {
            router.push("/");
          }
        }
      } catch (e) {
        setError("password", {
          message: getWording("login.login_error_message"),
        });
      }
    };

  const responseFacebook = (response) => {
    if (!response.accessToken) return;
    loginModalDisclosure.onClose();
    router.replace(`/oauth/facebook/?accessToken=${response.accessToken}`);
  };

  const responseGoogle = (response) => {
    if (!response.accessToken) return;
    router.replace(`/oauth/google/?accessToken=${response.accessToken}`);
    loginModalDisclosure.onClose();
  };

  const onEmailLogin = useCallback(
    async ({ email, password }) => {
      try {
        const variables = {
          input: {
            email,
            password,
          },
        };
        const user = await userLogin(variables);
        setCredential(user);
        loginModalDisclosure.onClose();
        if (user) {
          if (user?.identities?.length === 0) {
            router.push("/user/identity/select");
          } else {
            router.push("/");
          }
        }
      } catch (e) {
        setError("password", {
          message: getWording("login.login_error_message"),
        });
      }
    },
    [getWording, loginModalDisclosure, setCredential, setError]
  );

  return (
    <Modal
      isOpen={loginModalDisclosure.isOpen}
      onClose={loginModalDisclosure.onClose}
    >
      <ModalOverlay></ModalOverlay>
      <ModalContent maxW={400} w="95%" py={4}>
        <ModalHeader mt={4} fontSize="3xl">
          {getWording("login.login_title")}
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            {tab === "email" && (
              <VStack as="form" onSubmit={handleSubmit(onEmailLogin)}>
                <FormControl>
                  <FormLabel>{getWording("login.login_email_label")}</FormLabel>
                  <Input
                    placeholder={getWording("login.login_email_placeholder")}
                    {...register("email")}
                  />
                  <FormHelperText>{errors?.email?.message}</FormHelperText>
                </FormControl>
                <FormControl>
                  <FormLabel>
                    {getWording("login.login_password_label")}
                  </FormLabel>
                  <Input
                    type="password"
                    placeholder={getWording("login.login_password_placeholder")}
                    {...register("password")}
                  />
                  <FormHelperText color="red.500">
                    {errors?.password?.message}
                  </FormHelperText>
                </FormControl>
                <FormControl as={VStack} align="end">
                  <Button
                    onClick={() => {
                      loginModalDisclosure.onClose();
                      resetPasswordEmailModalDisclosure.onOpen();
                    }}
                    fontWeight="normal"
                    variant="link"
                    textDecor="underline"
                    color="black"
                  >
                    {getWording("login.forget_password_label")}
                  </Button>
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
                    {getWording("login.login_button_label")}
                  </Button>
                </FormControl>
              </VStack>
            )}
            {tab === "phone" && (
              <VStack as="form" onSubmit={handleSubmit(onPhoneLogin)}>
                <FormControl>
                  <FormLabel>{getWording("login.login_phone_label")}</FormLabel>
                  <Input placeholder="91234567" {...register("phone")} />
                  <FormHelperText color="red">
                    {errors?.phone?.message}
                  </FormHelperText>
                </FormControl>
                <FormControl>
                  <FormLabel>
                    {getWording("login.login_password_label")}
                  </FormLabel>
                  <Input
                    type="password"
                    placeholder={getWording("login.login_password_placeholder")}
                    {...register("password")}
                  />
                  <FormHelperText color="red.500">
                    {errors?.password?.message}
                  </FormHelperText>
                </FormControl>
                <FormControl as={VStack} align="end">
                  <Button
                    onClick={() => {
                      loginModalDisclosure.onClose();
                      resetPasswordPhoneModalDisclosure.onOpen();
                    }}
                    fontWeight="normal"
                    variant="link"
                    textDecor="underline"
                    color="black"
                  >
                    {getWording("login.forget_password_label")}
                  </Button>
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
                    {getWording("login.login_button_label")}
                  </Button>
                </FormControl>
              </VStack>
            )}
            <HStack py={2} align="center">
              <Box
                flex={1}
                minW={0}
                w="100%"
                borderBottomWidth={1}
                borderColor="gray.200"
              ></Box>
              <Box fontSize="sm" color="gray.400">
                {getWording("login.or_label")}
              </Box>
              <Box
                flex={1}
                minW={0}
                w="100%"
                borderBottomWidth={1}
                borderColor="gray.200"
              ></Box>
            </HStack>

            <VStack align="stretch">
              {tab === "email" && (
                <Button
                  onClick={() => setTab("phone")}
                  variant="outline"
                  borderWidth={2}
                  borderColor="black"
                  colorScheme="gray"
                >
                  <HStack w="100%">
                    <IoMdPhonePortrait size={18} />
                    <Text flex={1} minW={0} w="100%">
                      {getWording("login.sign_in_with_phone")}
                    </Text>
                  </HStack>
                </Button>
              )}
              {tab === "phone" && (
                <Button
                  onClick={() => setTab("email")}
                  variant="outline"
                  borderWidth={2}
                  borderColor="black"
                  colorScheme="gray"
                >
                  <HStack w="100%">
                    <AiOutlineMail size={18} />
                    <Text flex={1} minW={0} w="100%">
                      {getWording("login.sign_in_with_email")}
                    </Text>
                  </HStack>
                </Button>
              )}
              <FacebookLogin
                isMobile={false}
                appId={publicRuntimeConfig.FACEBOOK_APP_ID}
                fields="name,email,picture"
                callback={responseFacebook}
                redirectUri={publicRuntimeConfig.FACEBOOK_APP_REDIRECT_URI}
                render={(renderProps) => (
                  <Button
                    colorScheme="facebook"
                    color="white"
                    onClick={renderProps.onClick}
                  >
                    <HStack w="100%">
                      <IoLogoFacebook size={18} color="white" />
                      <Text flex={1} minW={0} w="100%">
                        {getWording("login.sign_in_with_facebook")}
                      </Text>
                    </HStack>
                  </Button>
                )}
              />

              <GoogleLogin
                autoLoad={false}
                clientId={publicRuntimeConfig.GOOGLE_CLIENT_ID}
                render={(renderProps) => (
                  <Button
                    colorScheme="google"
                    color="white"
                    onClick={renderProps.onClick}
                  >
                    <HStack w="100%">
                      <IoLogoGoogle size={18} color="white" />
                      <Text flex={1} minW={0} w="100%">
                        {getWording("login.sign_in_with_google")}
                      </Text>
                    </HStack>
                  </Button>
                )}
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={"single_host_origin"}
              />
              {/* <AppleLogin
                clientId="com.talkboxapp.teamwork.service.hku"
                redirectURI="https://jciep.uat.talkbox.net/oauth/apple"
                responseType={"code id_token"}
                responseMode={"form_post"}
                scope="email name"
                usePopup={false}
                nonce="NONCE"
                render={(renderProps) => {
                  return (
                    <Button
                      variant="solid"
                      _hover={{ bgColor: "black" }}
                      bgColor="black"
                      color="white"
                      onClick={renderProps.onClick}
                    >
                      <HStack w="100%">
                        <IoLogoApple size={18} color="white" />
                        <Text flex={1} minW={0} w="100%">
                          {getWording("login.sign_in_with_apple")}
                        </Text>
                      </HStack>
                    </Button>
                  );
                }}
              /> */}
            </VStack>
            <Button
              alignSelf="start"
              variant="link"
              color="black"
              fontWeight="normal"
              onClick={() => {
                loginModalDisclosure.onClose();
                registerModalDisclosure.onOpen();
              }}
            >
              {getWording("login.register_message_link")}
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
