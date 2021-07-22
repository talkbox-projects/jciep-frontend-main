import React from "react";
import { useAppContext } from "../store/AppStore";
import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";
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
  IoLogoApple,
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
import AppleLogin from "react-apple-login";

const LoginModal = () => {
  const {
    loginModalDisclosure,
    registerModalDisclosure,
    otpVerifyModalDisclosure,
    resetPasswordModalDisclosure,
  } = useAppContext();

  const [tab, setTab] = useState("email");
  const getWording = useGetWording();
  const [setCredential] = useCredential();

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onPhoneLogin = useCallback(
    async ({ phone }) => {
      const mutation = gql`
        mutation UserPhoneVerify($phone: String!) {
          UserPhoneVerify(phone: $phone)
        }
      `;
      let result = await getGraphQLClient().request(mutation, { phone });
      if (result.UserPhoneVerify) {
        otpVerifyModalDisclosure.onOpen({ phone, type: "login" });
        loginModalDisclosure.onClose();
      } else {
        setError("phone", {
          message: getWording("login.login_error_message"),
        });
      }
    },
    [getWording, loginModalDisclosure, otpVerifyModalDisclosure, setError]
  );

  const responseFacebook = (response) => {
    router.push(`/oauth/facebook/?accessToken=${response.accessToken}`);
    loginModalDisclosure.onClose();
  };

  const responseGoogle = (response) => {
    router.push(`/oauth/google/?accessToken=${response.accessToken}`);
    loginModalDisclosure.onClose();
  };

  const onEmailLogin = useCallback(
    async ({ email, password }) => {
      try {
        const mutation = gql`
          mutation UserLogin($input: LoginInput) {
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
                  interestedIndustryOther
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

        const variables = {
          input: {
            email,
            password,
          },
        };

        const data = await getGraphQLClient().request(mutation, variables);
        setCredential(data?.UserLogin);
        loginModalDisclosure.onClose();
        if (data?.UserLogin) {
          const user = data?.UserLogin?.user;
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
                      resetPasswordModalDisclosure.onOpen();
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
                    {getWording("login.phone_verify_button_label")}
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
                appId="1091464314720526"
                fields="name,email,picture"
                callback={responseFacebook}
                redirectUri={`/oauth/facebook`}
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
              <AppleLogin
                clientId="com.talkboxapp.teamwork.service.hku"
                redirectURI="https://jciep.uat.talkbox.net/oauth/apple"
                responseType={"code"}
                responseMode={"query"}
                nonce="NONCE"
                usePopup={false}
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
              />
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
