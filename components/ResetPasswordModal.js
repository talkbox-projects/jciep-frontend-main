import { useAppContext } from "../store/AppStore";
import { useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";
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
import wordExtractor from "../utils/wordExtractor";
import { emailRegex } from "../utils/general";
import { useGetWording } from "../utils/wordings/useWording";
import UserPasswordResetEmailSend from "../utils/api/UserPasswordResetEmailSend";

const ResetPasswordModal = () => {
  const {
    user,
    resetPasswordModalDisclosure: { isOpen, onClose },
  } = useAppContext();

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
  const onResetPasswordEmailSent = useCallback(async ({ email }) => {
    try {
      const sent = await UserPasswordResetEmailSend({ email });
      toast({
        status: "success",
        title: getWording("resentPassword.reset_password_email_sent_success"),
      });

      if (!sent) {
        throw new Error("Failed!");
      }
    } catch (error) {
      console.error(error);
      toast({
        status: "error",
        title: getWording("resentPassword.reset_password_email_sent_fail"),
      });
    }
  }, []);
  useEffect(() => {
    if (isOpen) {
      reset({ email: user?.email ?? "" });
    }
  }, [isOpen, user, reset]);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onResetPasswordEmailSent)}>
        <ModalHeader>
          {getWording("resentPassword.reset_password_email_title")}
        </ModalHeader>
        <ModalBody spacing={4} as={VStack} align="center">
          <Text color="#999" w="100%" fontSize="sm">
            {getWording("resentPassword.reset_password_email_description")}
          </Text>

          <FormControl isInvalid={errors?.email?.message}>
            <FormLabel m={0} p={0}>
              {getWording("resentPassword.reset_password_email_label")}
            </FormLabel>
            <Input
              variant="flushed"
              {...register("email", {
                required: getWording(
                  "resentPassword.reset_password_email_error_message"
                ),
                pattern: {
                  value: emailRegex,
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

export default ResetPasswordModal;
