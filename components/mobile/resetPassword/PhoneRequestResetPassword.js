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
  FormErrorMessage,
} from "@chakra-ui/react";
import { phoneRegex } from "../../../utils/general";
import { useGetWording } from "../../../utils/wordings/useWording";
import UserPasswordResetPhoneSend from "../../../utils/api/UserPasswordResetPhoneSend";

const PhoneRequestResetPassword = () => {
  const {
    user,
    resetPasswordPhoneModalDisclosure: { isOpen, onClose },
    resetPasswordStatus,
    setResetPasswordStatus
  } = useAppContext();

  const getWording = useGetWording();

  const {
    handleSubmit,
    reset,
    register,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      phone: user?.phone,
    },
  });

  const toast = useToast();
  const onResetPasswordPhoneSent = async ({ phone }) => {
    try {
      const sent = await UserPasswordResetPhoneSend({ phone });

      if (!sent) {
        throw new Error("Failed!");
      }

      toast({
        status: "success",
        title: getWording("resentPassword.reset_password_phone_sent_success"),
      });


      setResetPasswordStatus({
        ...resetPasswordStatus,
        phone: phone,
        type: "resetPassword",
        step: "verify"
      })
    } catch (error) {
      console.error(error);
      toast({
        status: "error",
        title: getWording("resentPassword.reset_password_phone_sent_fail"),
      });
    }
  };
  useEffect(() => {
    if (isOpen) {
      reset({ phone: user?.phone ?? "" });
    }
  }, [isOpen, user, reset]);
  return (
    <Box py={{ base: 24 }}>
      <Box mb={{ base: 4 }}>
        <Text
          fontSize="24px"
          letterSpacing="1.5px"
          fontWeight={600}
          px={"15px"}
        >
          {getWording("resentPassword.reset_password_phone_title")}
        </Text>
        <Text color="#757575" w="100%" fontSize="sm" px={"15px"}>
          {getWording("resentPassword.reset_password_phone_description")}
        </Text>
      </Box>
      <Box width="100%" background="#FFF">
        <VStack
          spacing={8}
          as="form"
          onSubmit={handleSubmit(onResetPasswordPhoneSent)}
        >
          <Box px={"15px"} width="100%">
            <FormControl isInvalid={errors?.phone?.message}>
              <FormLabel m={0} p={0}>
                {getWording("resentPassword.reset_password_phone_label")}
              </FormLabel>
              <Input
                variant="flushed"
                {...register("phone", {
                  required: getWording(
                    "resentPassword.reset_password_phone_error_message"
                  ),
                  pattern: {
                    value: phoneRegex,
                    message: getWording(
                      "resentPassword.reset_password_phone_error_message"
                    ),
                  },
                })}
              ></Input>
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
                {getWording("resentPassword.send_phone_button_label")}
              </Button>
            </FormControl>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default PhoneRequestResetPassword;
