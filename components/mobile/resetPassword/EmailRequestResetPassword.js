import { useAppContext } from "../../../store/AppStore";
import { useForm } from "react-hook-form";
import React, { useEffect } from "react";
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
import { useGetWording } from "../../../utils/wordings/useWording";
import UserPasswordResetEmailOTPSend from "../../../utils/api/UserPasswordResetEmailOTPSend";

const EmailRequestResetPassword = ({ page }) => {
  const { user, resetPasswordStatus, setResetPasswordStatus } = useAppContext();

  const getWording = useGetWording();

  const {
    handleSubmit,
    reset,
    register,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      email: user?.email,
    },
  });

  const toast = useToast();
  const onResetPasswordEmailSent = async ({ email }) => {
    try {
      const sent = await UserPasswordResetEmailOTPSend({ email });
      toast({
        status: "success",
        title: getWording("resentPassword.reset_password_email_sent_success"),
      });

      if (!sent) {
        throw new Error("Failed!");
      }

      setResetPasswordStatus({
        ...resetPasswordStatus,
        email: email,
        type: "resetPassword",
        step: "verify",
      });

    } catch (error) {
      console.error(error);
      toast({
        status: "error",
        title: getWording("resentPassword.reset_password_email_sent_fail"),
      });
    }
  };

  return (
    <Box py={{ base: 24 }}>
      <Box mb={{ base: 4 }}>
        <Text
          fontSize="24px"
          letterSpacing="1.5px"
          fontWeight={600}
          px={"15px"}
        >
          {page?.content?.emailResetPassword?.email_title_label}
        </Text>
        <Text color="#757575" w="100%" fontSize="sm" px={"15px"}>
          {page?.content?.emailResetPassword?.email_description}
        </Text>
      </Box>
      <Box width="100%" background="#FFF">
        <VStack
          spacing={8}
          as="form"
          onSubmit={handleSubmit(onResetPasswordEmailSent)}
        >
          <Box px={"15px"} width="100%">
            <FormControl isInvalid={errors?.email?.message}>
              <FormLabel m={0} p={0}>
                {page?.content?.emailResetPassword?.email_label}
              </FormLabel>
              <Input
                type="email"
                variant="flushed"
                {...register("email", {
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message:
                      page?.content?.emailResetPassword?.email_format_error,
                  },
                  required:
                    page?.content?.emailResetPassword?.email_required_error,
                })}
              ></Input>
              <FormHelperText color="red">
                {errors?.email?.message}
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
                {page?.content?.emailResetPassword?.email_button_label}
              </Button>
            </FormControl>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default EmailRequestResetPassword;
