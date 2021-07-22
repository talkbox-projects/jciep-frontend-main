import { useAppContext } from "../store/AppStore";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import GoogleLogin from "react-google-login";
import React from "react";

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
  useToast,
  Button,
  VStack,
  HStack,
  Text,
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  IoLogoFacebook,
  IoLogoGoogle,
  IoLogoApple,
  IoMdPhonePortrait,
} from "react-icons/io";
import { AiOutlineMail } from "react-icons/ai";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../utils/apollo";
import { useGetWording } from "../utils/wordings/useWording";
import router from "next/router";
import AppleLogin from "react-apple-login";
import { emailRegex } from "../utils/general";

const RegisterModal = () => {
  const {
    registerModalDisclosure,
    loginModalDisclosure,
    otpVerifyModalDisclosure,
    emailVerifySentModalDisclosure,
    setEmail,
  } = useAppContext();

  const [tab, setTab] = useState("email");
  const getWording = useGetWording();

  const {
    handleSubmit,
    register,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const toast = useToast();

  useEffect(() => {
    if (!registerModalDisclosure.isOpen) {
      reset();
    }
  }, [registerModalDisclosure.isOpen]);

  const onPhoneRegister = useCallback(async ({ e, phone }) => {
    try {
      const mutation = gql`
        mutation UserPhoneVerify($phone: String!) {
          UserPhoneVerify(phone: $phone)
        }
      `;
      let result = await getGraphQLClient().request(mutation, { phone });
      if (result.UserPhoneVerify) {
        otpVerifyModalDisclosure.onOpen({ phone, type: "register" });
        registerModalDisclosure.onClose();
        e.preventDefault();
      } else {
        setError("phone", {
          message: getWording("register.register_error_message"),
        });
      }
    } catch (e) {
      setError("email", {
        message: getWording("register.register_error_message"),
      });
    }
  });

  const responseFacebook = (response) => {
    registerModalDisclosure.onClose();
    router.push(`/oauth/facebook/?accessToken=${response.accessToken}`);
  };

  const responseGoogle = (response) => {
    registerModalDisclosure.onClose();
    router.push(`/oauth/google/?accessToken=${response.accessToken}`);
  };

  const onEmailRegister = useCallback(async ({ e, email }) => {
    try {
      console.log(email);

      const mutation = gql`
        mutation UserEmailVerify($email: String!) {
          UserEmailVerify(email: $email)
        }
      `;
      await getGraphQLClient().request(mutation, { email });
      setEmail(email);
      emailVerifySentModalDisclosure.onOpen();
      registerModalDisclosure.onClose();
      e.preventDefault();
    } catch (e) {
      setError("phone", {
        message: getWording("register.register_error_message"),
      });
    }
  });

  return (
    <Modal
      isOpen={registerModalDisclosure.isOpen}
      onClose={registerModalDisclosure.onClose}
    >
      <ModalOverlay></ModalOverlay>
      <ModalContent maxW={400} w="95%" py={4}>
        <ModalHeader mt={4} fontSize="3xl">
          {getWording("register.register_title")}
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            {tab === "email" && (
              <VStack as="form" onSubmit={handleSubmit(onEmailRegister)}>
                <FormControl>
                  <FormLabel>
                    {getWording("register.register_email_label")}
                  </FormLabel>
                  <Input
                    placeholder={getWording(
                      "register.register_email_placeholder"
                    )}
                    {...register("email", {
                      required: getWording(
                        "register.register_email_error_message"
                      ),
                      pattern: {
                        value: emailRegex,
                        message: getWording(
                          "register.register_email_error_message"
                        ),
                      },
                    })}
                  />
                  <FormHelperText color="red">
                    {errors?.email?.message}
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
                    {getWording("register.register_button_label")}
                  </Button>
                </FormControl>
              </VStack>
            )}
            {tab === "phone" && (
              <VStack as="form" onSubmit={handleSubmit(onPhoneRegister)}>
                <FormControl>
                  <FormLabel>
                    {getWording("register.register_phone_label")}
                  </FormLabel>
                  <Input
                    placeholder="91234567"
                    {...register("phone", {
                      required: getWording(
                        "register.register_phone_error_message"
                      ),
                      pattern: {
                        value: emailRegex,
                        message: getWording(
                          "register.register_phone_error_message"
                        ),
                      },
                    })}
                  />
                  <FormHelperText>{errors?.phone?.message}</FormHelperText>
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
                    {getWording("register.phone_verify_button_label")}
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
                {getWording("register.or_label")}
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
                      {getWording("register.sign_up_with_phone")}
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
                      {getWording("register.sign_up_with_email")}
                    </Text>
                  </HStack>
                </Button>
              )}
              <FacebookLogin
                appId="1091464314720526"
                fields="name,email,picture"
                callback={responseFacebook}
                render={(renderProps) => (
                  <Button
                    colorScheme="facebook"
                    color="white"
                    onClick={renderProps.onClick}
                  >
                    <HStack w="100%">
                      <IoLogoFacebook size={18} color="white" />
                      <Text flex={1} minW={0} w="100%">
                        {getWording("register.sign_up_with_facebook")}
                      </Text>
                    </HStack>
                  </Button>
                )}
              />
              <GoogleLogin
                clientId="452094479729-ra8prl39vh78qc4rucrpdu5p0l15e1rb.apps.googleusercontent.com"
                render={(renderProps) => (
                  <Button
                    colorScheme="google"
                    color="white"
                    onClick={renderProps.onClick}
                  >
                    <HStack w="100%">
                      <IoLogoGoogle size={18} color="white" />
                      <Text flex={1} minW={0} w="100%">
                        {getWording("register.sign_up_with_google")}
                      </Text>
                    </HStack>
                  </Button>
                )}
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={"single_host_origin"}
              />
              <AppleLogin
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
                          {getWording("register.sign_up_with_apple")}
                        </Text>
                      </HStack>
                    </Button>
                  );
                }}
              />
            </VStack>
            <Button
              alignSelf="start"
              variant="link"
              color="black"
              fontWeight="normal"
              onClick={() => {
                registerModalDisclosure.onClose();
                loginModalDisclosure.onOpen();
              }}
            >
              {getWording("register.login_message_link")}
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RegisterModal;
