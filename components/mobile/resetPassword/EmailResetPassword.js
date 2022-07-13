import { useForm } from "react-hook-form";
import React from "react";
import { useAppContext } from "../../../store/AppStore";
import {
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
  VStack,
  Button,
  Box,
  FormHelperText,
} from "@chakra-ui/react";
import { passwordRegex } from "../../../utils/general";
import { useGetWording } from "../../../utils/wordings/useWording";
import userLogin from "../../../utils/api/UserLogin";

const EmailResetPassword = ({page}) => {
  const getWording = useGetWording();

  const {
    resetPasswordStatus
  } = useAppContext();

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
    getValues,
  } = useForm();

  const toast = useToast();

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

  const onReset = async ({ password }) => {
    try {
      const user = await userLogin({ input: { email: resetPasswordStatus?.email, otp: resetPasswordStatus?.otp, password } });
      toast({
        status: "success",
        title: getWording(
          "resetPasswordResetModal.reset_password_phone_success"
        ),
      });
      if (user) {
        setTimeout(() => {
          handleCloseWebView()
        }, 1000);
      }
    } catch (error) {
      toast({
        status: "error",
        title: getWording("resetPasswordResetModal.reset_password_phone_fail"),
      });
    }
  };

  console.log('page-',page)

  return (
    <Box py={{ base: 24 }}>
      <Box mb={{ base: 4 }}>
        <Text
          fontSize="24px"
          letterSpacing="1.5px"
          fontWeight={600}
          px={"15px"}
        >
          {page?.content?.resetPassword?.reset_password_title}
        </Text>
      </Box>
      <Box width="100%" background="#FFF">
        <VStack spacing={8} as="form" onSubmit={handleSubmit(onReset)}>
          <Box px={"15px"} width="100%">
            <FormControl>
              <FormLabel>
                {page?.content?.resetPassword?.reset_password_label}
              </FormLabel>
              <Input
                variant="flushed"
                type="password"
                {...register("password", {
                  required: {
                    value: true,
                    message: getWording(
                      "resetPasswordResetModal.password_error_message"
                    ),
                  },
                  pattern: {
                    value: passwordRegex,
                    message: getWording(
                      "resetPasswordResetModal.register_password_pattern"
                    ),
                  },
                })}
              />
              <FormHelperText color="red.500">
                {errors?.password?.message}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>
                {page?.content?.resetPassword?.confirm_reset_password_label}
              </FormLabel>
              <Input
                type="password"
                variant="flushed"
                {...register("confirm_password", {
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
              <FormHelperText color="red.500">
                {errors?.confirm_password?.message}
              </FormHelperText>
            </FormControl>
          </Box>
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
          <Box px={"15px"} w="100%">
            <FormControl textAlign="center">
              <Button
                backgroundColor="#F6D644"
                borderRadius="22px"
                height="44px"
                width="100%"
                type="submit"
                isLoading={isSubmitting}
              >
              {page?.content?.resetPassword?.reset_password_submit}
              </Button>
            </FormControl>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default EmailResetPassword;
