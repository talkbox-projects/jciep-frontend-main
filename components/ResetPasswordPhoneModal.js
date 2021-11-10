import { useAppContext } from "../store/AppStore";
import { useForm } from "react-hook-form";
import React, { useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  Input,
  Text,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
  VStack,
  Button,
  Box,
} from "@chakra-ui/react";
import { phoneRegex } from "../utils/general";
import { useGetWording } from "../utils/wordings/useWording";
import UserPasswordResetPhoneSend from "../utils/api/UserPasswordResetPhoneSend";

const ResetPasswordPhoneModal = () => {
  const {
    user,
    resetPasswordPhoneModalDisclosure: { isOpen, onClose },
    otpVerifyModalDisclosure
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
        title: getWording("resentPassword.reset_password_email_sent_success"),
      });

      onClose();
      otpVerifyModalDisclosure.onOpen({ phone, type: "resetPassword" });

    } catch (error) {
      console.error(error);
      toast({
        status: "error",
        title: getWording("resentPassword.reset_password_email_sent_fail"),
      });
    }
  };
  useEffect(() => {
    if (isOpen) {
      reset({ phone: user?.phone ?? "" });
    }
  }, [isOpen, user, reset]);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onResetPasswordPhoneSent)}>
        <ModalHeader>
          {getWording("resentPassword.reset_password_email_title")}
        </ModalHeader>
        <ModalBody spacing={4} as={VStack} align="center">
          <Text color="#999" w="100%" fontSize="sm">
            {getWording("resentPassword.reset_password_email_description")}
          </Text>

          <FormControl isInvalid={errors?.phone?.message}>
            <FormLabel m={0} p={0}>
              {getWording("resentPassword.reset_password_email_label")}
            </FormLabel>
            <Input
              variant="flushed"
              {...register("phone", {
                required: getWording(
                  "resentPassword.reset_password_email_error_message"
                ),
                pattern: {
                  value: phoneRegex,
                  message: getWording(
                    "resentPassword.reset_password_email_error_message"
                  ),
                },
              })}
            ></Input>
          </FormControl>
          <Box py={3}>
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
              {getWording("resentPassword.send_email_button_label")}
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ResetPasswordPhoneModal;
