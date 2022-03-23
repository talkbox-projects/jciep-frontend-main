import { useAppContext } from "../store/AppStore";
import { useForm } from "react-hook-form";
import React, { useEffect } from "react";
import {
  FormHelperText,
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
import { emailRegex, passwordRegex } from "../utils/general";
import { useGetWording } from "../utils/wordings/useWording";
import { useCredential } from "../utils/user";
import { useRouter } from "next/router";
import userLogin from "../utils/api/UserLogin";

const ResetPasswordResetModal = () => {
  const {
    user,
    resetPasswordResetModalDisclosure: {
      isOpen,
      onClose,
      params: { phone, otp },
    },
  } = useAppContext();

  const getWording = useGetWording();

  const {
    handleSubmit,
    reset,
    register,
    formState: { isSubmitting, errors },
    getValues,
  } = useForm({
    defaultValues: {
      email: user?.email,
    },
  });

  const toast = useToast();
  const [setCredential] = useCredential();
  const router = useRouter();
  const onReset = async ({ password }) => {
    try {
      const user = await userLogin({ input: { phone, otp, password } });
      toast({
        status: "success",
        title: getWording(
          "resetPasswordResetModal.reset_password_phone_success"
        ),
      });
      if (user) {
        onClose();
        setCredential(user);
        if (user?.identities?.length === 0) {
          router.push("/user/identity/select");
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        status: "error",
        title: getWording("resetPasswordResetModal.reset_password_phone_fail"),
      });
    }
  };
  useEffect(() => {
    if (isOpen) {
      reset({ email: user?.email ?? "" });
    }
  }, [isOpen, user, reset]);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onReset)}>
        <ModalHeader>
          {getWording("resetPasswordResetModal.reset_password_phone_title")}
        </ModalHeader>
        <ModalBody spacing={4} as={VStack} align="center">
          <Text color="#757575" w="100%" fontSize="sm">
            {getWording(
              "resetPasswordResetModal.reset_password_phone_description"
            )}
          </Text>

          <FormControl>
            <FormLabel>
              {getWording("resetPasswordResetModal.password_label")}
            </FormLabel>
            <Input
              type="password"
              placeholder={getWording(
                "resetPasswordResetModal.password_placeholder"
              )}
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
              {getWording("resetPasswordResetModal.confirm_password_label")}
            </FormLabel>
            <Input
              type="password"
              placeholder={getWording(
                "resetPasswordResetModal.confirm_password_placeholder"
              )}
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
              {getWording("resetPasswordResetModal.reset_button_label")}
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ResetPasswordResetModal;
