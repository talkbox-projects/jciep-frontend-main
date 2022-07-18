import {
  Button,
  Box,
  Image,
  Text,
  Grid,
  GridItem,
  Container,
  Flex,
  Code,
} from "@chakra-ui/react";
import Link from "next/link";
import { gql } from "graphql-request";
import { getPage } from "../../../utils/page/getPage";
import withPageCMS from "../../../utils/page/withPageCMS";
import { getGraphQLClient } from "../../../utils/apollo";
import wordExtractor from "../../../utils/wordExtractor";
import getSharedServerSideProps from "../../../utils/server/getSharedServerSideProps";
import { useCredential } from "../../../utils/user";
import { useAppContext } from "../../../store/AppStore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const PAGE_KEY = "app_user_register";

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
const AppUserRegister = ({ page }) => {
  const router = useRouter();
  const [, removeCredential] = useCredential();
  const [appRegistrationInfo, setAppRegistrationInfo] = useState({
    otp: "",
    type: "",
    email: "",
    token: "",
    phone: "",
  });
  const [otpValid, setOtpValid] = useState(null);
  const [otpVerifyStatus, setOtpVerifyStatus] = useState({ status: "" });
  const [isUserExist, setIsUserExist] = useState(false);

  const logout = () => {
    removeCredential();
    router.push("/");
  };

  useEffect(() => {
    window.WebContext = {};
    window.WebContext.getRegistrationInfoHandler = (response) => {
      const registrationInfo = JSON.parse(response);
      // alert(JSON.stringify(response));
      if (!registrationInfo.result) {
        setAppRegistrationInfo({
          status: "response not found",
        });
      } else {
        setAppRegistrationInfo(registrationInfo.result);
      }
    };
    const json = {
      name: "getRegistrationInfo",
      options: {
        callback: "getRegistrationInfoHandler",
      },
    };

    if (window && window.AppContext && window.AppContext.postMessage) {
      window.AppContext.postMessage(JSON.stringify(json));
    }
  }, []);

  const handleCloseWebView = () => {
    window.WebContext = {};
    window.WebContext.closeWebViewHandler = () => {
      console.log("close web view");
    };

    let json = {
      name: "closeWebView",
      options: {
        callback: "closeWebViewHandler",
        params: {},
      },
    };

    if (window && window.AppContext && window.AppContext.postMessage) {
      window.AppContext.postMessage(JSON.stringify(json));
    }
  };

  const handleCheckOTP = async () => {
    const { otp, phone, email, type, token } = appRegistrationInfo;
    switch (type) {
      case "google":
        router.replace(`/app/oauth/google/?accessToken=${token}`);
        break;

      case "facebook":
        router.replace(`/app/oauth/facebook/?accessToken=${token}`);
        break;

      case "apple":
        router.replace(`/app/oauth/apple/?accessToken=${token}`);
        break;

      case "phone":
        try {
          const query = gql`
            query UserPhoneValidityCheck($phone: String!, $otp: String!) {
              UserPhoneValidityCheck(phone: $phone, otp: $otp) {
                phone
                meta
              }
            }
          `;

          const data = await getGraphQLClient().request(query, {
            otp,
            phone,
          });

          if (data?.UserPhoneValidityCheck?.phone) {
            router.push(`/app/user/setPassword?phone=${phone}&otp=${otp}`);
          } else {
            setOtpVerifyStatus({ status: "Phone OTP invalid" });
          }
        } catch (e) {
          setOtpVerifyStatus({ status: "Phone OTP invalid" });
        }
        break;

      case "email":
        try {
          const query = gql`
            query UserEmailOTPValidityCheck($email: String!, $otp: String!) {
              UserEmailOTPValidityCheck(email: $email, otp: $otp) {
                email
                meta
              }
            }
          `;

          const data = await getGraphQLClient().request(query, {
            otp,
            email,
          });

          if (data?.UserEmailOTPValidityCheck?.email) {
            router.push(`/app/user/setPassword?email=${email}&otp=${otp}`);
          } else {
            setOtpVerifyStatus({ status: "Email OTP invalid" });
          }
        } catch (e) {
          setOtpVerifyStatus({ status: "Email OTP invalid" });
        }
        break;

      default:
        setOtpVerifyStatus({ status: "type not found" });
        break;
    }
  };

  const RenderRegistrationType = () => {
    switch (appRegistrationInfo?.type) {
      case "email":
        return (
          <Text
            dangerouslySetInnerHTML={{
              __html: page?.content?.remark?.text?.replace(
                " ",
                `<b>${appRegistrationInfo?.email}</b>`
              ),
            }}
          />
        );
      case "phone":
        return (
          <Text
            dangerouslySetInnerHTML={{
              __html: page?.content?.remark?.text?.replace(
                " ",
                `<b>${appRegistrationInfo?.phone}</b>`
              ),
            }}
          />
        );

      case "google":
        return (
          <Text
            dangerouslySetInnerHTML={{
              __html: page?.content?.remark?.text?.replace(
                " ",
                `<b>${page?.content?.remark?.googleText}</b>`
              ),
            }}
          />
        );

      case "facebook":
        return (
          <Text
            dangerouslySetInnerHTML={{
              __html: page?.content?.remark?.text?.replace(
                " ",
                `<b>${page?.content?.remark?.facebookText}</b>`
              ),
            }}
          />
        );

      default:
        return (
          <Text
            dangerouslySetInnerHTML={{
              __html: page?.content?.remark?.text?.replace(" ", `<b></b>`),
            }}
          />
        );
    }
  };

  useEffect(() => {
    const { otp, phone, email, type, token } = appRegistrationInfo;
    async function checkOTP() {
      switch (type) {
        case "phone":
          try {
            const query = gql`
              query UserPhoneValidityCheck($phone: String!, $otp: String!) {
                UserPhoneValidityCheck(phone: $phone, otp: $otp) {
                  phone
                  meta
                }
              }
            `;

            const data = await getGraphQLClient().request(query, {
              otp,
              phone,
            });

            if (!data?.UserPhoneValidityCheck?.phone) {
              setOtpVerifyStatus({ status: "Phone OTP invalid" });
              setOtpValid(false);
            }
          } catch (e) {
            setOtpVerifyStatus({ status: "Phone OTP invalid" });
            setOtpValid(false);
          }
          break;

        case "email":
          try {
            const query = gql`
              query UserEmailOTPValidityCheck($email: String!, $otp: String!) {
                UserEmailOTPValidityCheck(email: $email, otp: $otp) {
                  email
                  meta
                }
              }
            `;

            const data = await getGraphQLClient().request(query, {
              otp,
              email,
            });

            if (!data?.UserEmailOTPValidityCheck?.email) {
              setOtpVerifyStatus({ status: "Email OTP invalid" });
              setOtpValid(false);
            }
          } catch (e) {
            setOtpVerifyStatus({ status: "Email OTP invalid" });
            setOtpValid(false);
          }
          break;
      }
    }

    async function checkIsUserExist() {
      switch (type) {
        case "phone":
          try {
            const queryUserExist = gql`
              query UserExist($phone: String!) {
                UserExist(phone: $phone) {
                  phone
                }
              }
            `;

            const {UserExist} = await getGraphQLClient().request(
              queryUserExist,
              {
                phone,
              }
            );

            if(UserExist?.phone){
              setIsUserExist(true)
            }

          } catch (e) {
            console.log("e", e);
          }
          break;

        case "email":
          try {
            const queryUserExist = gql`
              query UserExist($email: String!) {
                UserExist(email: $email) {
                  email
                }
              }
            `;

            const {UserExist} = await getGraphQLClient().request(
              queryUserExist,
              {
                email,
              }
            );

            if(UserExist?.email){
              setIsUserExist(true)
            }

          } catch (e) {
            console.log("e", e);
          }
          break;

        case "facebook":
          try {
            const queryUserExist = gql`
              query UserExist($facebookId: String!) {
                UserExist(facebookId: $facebookId) {
                  facebookId
                }
              }
            `;

            const {UserExist} = await getGraphQLClient().request(
              queryUserExist,
              {
                facebookId: token,
              }
            );

            if(UserExist?.facebookId){
              setIsUserExist(true)
            }

          } catch (e) {
            console.log("e", e);
          }
          break;

        case "google":
          try {
            const queryUserExist = gql`
              query UserExist($googleId: String!) {
                UserExist(googleId: $googleId) {
                  googleId
                }
              }
            `;

            const {UserExist} = await getGraphQLClient().request(
              queryUserExist,
              {
                googleId: token,
              }
            );

            if(UserExist?.googleId){
              setIsUserExist(true)
            }

          } catch (e) {
            console.log("e", e);
          }
          break;
      }
    }
    checkIsUserExist();
    checkOTP();
  }, [appRegistrationInfo]);

  return (
    <Box pt={{ base: "64px" }}>
      <Grid
        templateColumns="repeat(3, 1fr)"
        width="100%"
        px={"20px"}
        alignItems="center"
        h={"48px"}
        backgroundColor="#F6D644"
      >
        <GridItem>
          <Image
            src={"/images/app/close.svg"}
            alt={""}
            cursor="pointer"
            onClick={() => handleCloseWebView()}
          />
        </GridItem>
      </Grid>
      <Box>
        <Box justifyContent="center" width="100%">
          <Box width="100%" textAlign="center" margin="auto">
            <Box
              backgroundColor="#F6D644"
              bgImage={`url('/images/app/welcome_top_bg.png')`}
              bgRepeat={"no-repeat"}
              bgPosition={"center center"}
              position={"relative"}
              h={"230px"}
            >
              <Image
                src={"/images/app/welcome_white_bg.svg"}
                w={"100%"}
                alt={""}
                zIndex={1}
                bottom={0}
                pos={"absolute"}
              />
            </Box>
            <Image
              alt=""
              height="200px"
              width="300px"
              margin="auto"
              src={page?.content?.startRegistration?.image}
              position={"relative"}
              zIndex={2}
              marginTop={"-120px"}
            />

            <Box
              bgImage={`url('/images/app/bottom_bg.png')`}
              bgRepeat={"no-repeat"}
              bgPosition={"bottom center"}
            >
              <Container>
                <Text fontWeight={700} fontSize={"24px"}>
                  {otpValid === false
                    ? wordExtractor(
                        page?.content?.wordings,
                        "invalid_otp_title"
                      )
                    : page?.content?.heading?.title}
                </Text>
                {otpValid === false ? (<Text color={"red"}>{ wordExtractor(page?.content?.wordings, "invalid_otp")}</Text>) : (
                  <Text
                    marginTop="10px"
                    dangerouslySetInnerHTML={{
                      __html: page?.content?.startRegistration?.content,
                    }}
                  />
                )}
              </Container>

              {isUserExist && <Box color="red">{page?.content?.isUserExistContent}</Box>}

              <Box>
                <Box px={"15px"} py={"12px"} mt={10} w="100%">
                  <Box width="100%" textAlign="center">
                    <Button
                      backgroundColor="#F6D644"
                      borderRadius="22px"
                      height="44px"
                      width="100%"
                      onClick={() => handleCheckOTP()}
                      disabled={otpValid === false || isUserExist}
                    >
                      {page?.content?.continue}
                    </Button>
                  </Box>
                  <Flex
                    direction={"column"}
                    gap={2}
                    py={6}
                    mt={10}
                    color={"#666666"}
                  >
                    <RenderRegistrationType />
                    <Box>
                      <Text as="span">{page?.content?.remark?.text02}</Text>{" "}
                      <Text as="span" onClick={() => logout()}>
                        {page?.content?.logout}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              </Box>
              {/* <Code fontSize={8}>
                {JSON.stringify(appRegistrationInfo)}
              </Code> */}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default withPageCMS(AppUserRegister, {
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
      name: "heading",
      label: "標題 Heading",
      component: "group",
      fields: [
        {
          name: "title",
          label: "標題 Title",
          component: "text",
        },
      ],
    },
    {
      name: "startRegistration",
      label: "開始 Start Registration",
      component: "group",
      fields: [
        {
          label: "身份 Image",
          name: "image",
          component: "image",
          uploadDir: () => "/identity",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          name: "description",
          label: "描述 description",
          component: "text",
        },
        {
          name: "content",
          label: "內容 content",
          component: "textarea",
        },
      ],
    },
    {
      name: "remark",
      label: "身份 current",
      component: "group",
      fields: [
        {
          name: "text",
          label: "文本 text",
          component: "text",
        },
        {
          name: "text02",
          label: "文本 text",
          component: "text",
        },
        {
          name: "googleText",
          label: "Google 文本 text",
          component: "text",
        },
        {
          name: "facebookText",
          label: "Facebook 文本 text",
          component: "text",
        },
        {
          name: "logout",
          label: "文本 text",
          component: "text",
        },
      ],
    },
    {
      name: "isUserExistContent",
      label: "此帳戶已存在 User Exist Label",
      component: "text",
    },
    {
      name: "continue",
      label: "開始設定 Continue Label",
      component: "text",
    },
    {
      name: "logout",
      label: "退出 Logout Label",
      component: "text",
    },
  ],
});
