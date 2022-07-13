import { useAppContext } from "../../../../store/AppStore";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, } from "react-icons/fa";
import { CloseIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormLabel,
  Text,
  VStack,
  Button,
  Box,
  Flex,
} from "@chakra-ui/react";
import withPageCMS from "../../../../utils/page/withPageCMS";
import { getPage } from "../../../../utils/page/getPage";
import { useGetWording } from "../../../../utils/wordings/useWording";
import getSharedServerSideProps from "../../../../utils/server/getSharedServerSideProps";
import EmailResetFlow from "./email";
import PhoneResetFlow from "./phone";

const PAGE_KEY = "password_reset";

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

const RenderResetFlow = ({ method, page }) => {
  switch (method) {
    case "email":
      return <EmailResetFlow page={page}/>;

    case "phone":
      return <PhoneResetFlow page={page}/>;

    default:
      return <></>;
  }
};

const ResetPasswordSelector = ({ setResetMethod, page }) => {
  return (
    <Box py={{ base: 24 }}>
      <Box mb={{ base: 4 }}>
        <Text
          fontSize="24px"
          letterSpacing="1.5px"
          fontWeight={600}
          px={"15px"}
        >
         {page?.content?.resentPassword?.reset_password_selector_title}
        </Text>
        <Text color="#757575" w="100%" fontSize="sm" px={"15px"}>
          {page?.content?.resentPassword?.reset_password_selector_description}
        </Text>
      </Box>
      <Box width="100%" background="#FFF">
        <VStack spacing={8}>
          <Box px={"15px"} width="100%">
            <FormControl>
              <Flex gap={2} py={4}>
                <Button
                  flex={1}
                  backgroundColor={"transparent"}
                  border={`2px solid #999999`}
                  height="38px"
                  onClick={() => setResetMethod("email")}
                >
                  {page?.content?.resetPassword?.email_label}
                </Button>
                <Button
                  flex={1}
                  backgroundColor={"transparent"}
                  border={`2px solid #999999`}
                  height="38px"
                  onClick={() => setResetMethod("phone")}
                >
                  {page?.content?.resetPassword?.phone_label}
                </Button>
              </Flex>
            </FormControl>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

const ResetPasswordPage = ({page}) => {
  const [resetMethod, setResetMethod] = useState("");
  return (
    <Box position={'relative'}>
      {resetMethod && (<Box position="absolute" top={'75px'} left={'15px'} fontSize={'12px'} onClick={() => setResetMethod("")}><CloseIcon/></Box>)}
      <Box pt={4}>
      {resetMethod === "" && (<ResetPasswordSelector
        resetMethod={resetMethod}
        setResetMethod={setResetMethod}
        page={page}
      />)}
      <RenderResetFlow method={resetMethod} page={page} />
      </Box>
    </Box>
  );
};

export default withPageCMS(ResetPasswordPage, {
  key: PAGE_KEY,
  fields: [
    {
      name: "resentPassword",
      label: "重設密碼選項 content",
      component: "group",
      fields: [
        {
          name: "reset_password_selector_title",
          label: "標題 text",
          component: "text",
        },
        {
          name: "reset_password_selector_description",
          label: "標題簡介 text",
          component: "text",
        },
      ],
    },
    {
      name: "resetPassword",
      label: "重設密碼 content",
      component: "group",
      fields: [
        {
          name: "phone_label",
          label: "電話 text",
          component: "text",
        },
        {
          name: "email_label",
          label: "電郵 text",
          component: "text",
        },
        {
          name: "reset_password_title",
          label: "設定密碼 text",
          component: "text",
        },
        {
          name: "reset_password_description",
          label: "請輸入你的新密碼 text",
          component: "text",
        },
        {
          name: "reset_password_label",
          label: "密碼 text",
          component: "text",
        },
        {
          name: "confirm_reset_password_label",
          label: "重新輸入密碼 text",
          component: "text",
        },
        {
          name: "reset_password_submit",
          label: "設定密碼 text",
          component: "text",
        },
      ],
    },
    {
      name: "emailResetPassword",
      label: "電郵及電話重設密碼 content",
      component: "group",
      fields: [
        {
          name: "email_title_label",
          label: "標題 text",
          component: "text",
        },
        {
          name: "email_description",
          label: "標題簡介 text",
          component: "text",
        },
        {
          name: "phone_description",
          label: "標題電話簡介 text",
          component: "text",
        },
        {
          name: "email_label",
          label: "電郵 text",
          component: "text",
        },
        {
          name: "phone_label",
          label: "電話 text",
          component: "text",
        },
        {
          name: "email_button_label",
          label: "發送驗證碼 button",
          component: "text",
        },
        {
          name: "email_required_error",
          label: "錯誤 message",
          component: "text",
        },
        {
          name: "email_format_error",
          label: "錯誤格式 message",
          component: "text",
        },
      ],
    },
    {
      name: "otpVerify",
      label: "驗證碼 content",
      component: "group",
      fields: [
        {
          name: "otpVerify_title",
          label: "標題 text",
          component: "text",
        },
        {
          name: "otpVerify_title_description",
          label: "標題簡介 text",
          component: "text",
        },
        {
          name: "failed_to_receive_message",
          label: "沒有收到驗證碼嗎? text",
          component: "text",
        },
        {
          name: "resend_link_label",
          label: "30秒後重新發送 text",
          component: "text",
        },
        {
          name: "invalid_otp_message",
          label: "錯誤的驗證碼 text",
          component: "text",
        },
        {
          name: "submit_button",
          label: "提交 message",
          component: "text",
        },
      ],
    },
  ],
});
