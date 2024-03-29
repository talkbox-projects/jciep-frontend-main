import React from "react";
import { useAppContext } from "../store/AppStore";
import { Controller, useForm } from "react-hook-form";
import { useCallback } from "react";
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalOverlay,
  Button,
  VStack,
  HStack,
  PinInput,
  PinInputField,
  IconButton,
  Text,
  Progress,
} from "@chakra-ui/react";
import { useGetWording } from "../utils/wordings/useWording";
import { FaArrowLeft } from "react-icons/fa";
import { useCredential } from "../utils/user";
import { useRouter } from "next/router";
import userLogin from "../utils/api/UserLogin";
import { getGraphQLClient } from "../utils/apollo";
import { gql } from "graphql-request";

const OtpVerifyModal = () => {
  const { otpVerifyModalDisclosure, resetPasswordResetModalDisclosure } = useAppContext();
  const { type, phone } = otpVerifyModalDisclosure?.params;
  const router = useRouter();

  const getWording = useGetWording();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onOtpVerify =
    async ({ otp }) => {
      try {
        const query = gql`
        query UserPhoneValidityCheck($phone: String!,$otp: String!) {
          UserPhoneValidityCheck(phone: $phone, otp: $otp) {
            phone
            meta
          }
        }
      `;

        const data = await getGraphQLClient().request(query, {
          otp, phone,
        });

        if (data?.UserPhoneValidityCheck?.phone) {
          resetPasswordResetModalDisclosure.onOpen({ otp, phone, type })
          otpVerifyModalDisclosure.onClose();
        }
      } catch (e) {
        setError("otp", {
          message: getWording("otpVerify.invalid_otp_message"),
        });
      }
    };

  return (
    <Modal
      isCentered
      isOpen={otpVerifyModalDisclosure.isOpen}
      onClose={otpVerifyModalDisclosure.onClose}
    >
      <ModalOverlay></ModalOverlay>
      <ModalContent maxW={600} w="95%" py={4}>
        <ModalHeader as={HStack} align="center" fontSize="3xl">
          <IconButton
            variant="ghost"
            icon={<FaArrowLeft />}
            onClick={() => {
              otpVerifyModalDisclosure.onClose();
            }}
          ></IconButton>
          <Text>{getWording("otpVerify.otpVerify_title")}</Text>
        </ModalHeader>
        <ModalBody>
          <VStack>
            <FormControl>
              <FormLabel color="gray.800" fontWeight="normal">
                {getWording("otpVerify.sms_sent_message", {
                  params: { phone },
                })}
              </FormLabel>
              <HStack
                w="100%"
                color="black"
                my={4}
                spacing={[1, 2, 4]}
                justifyContent="center"
              >
                <Controller
                  control={control}
                  name="otp"
                  render={(props) => (
                    <PinInput
                      autoFocus
                      isDisabled={isSubmitting}
                      {...props.field}
                      size="lg"
                      onComplete={handleSubmit(onOtpVerify)}
                      placeholder=""
                    >
                      {[0, 1, 2, 3, 4, 5].map((x) => (
                        <PinInputField aria-label={router.locale === "en" ? `${x + 1}th digit field` : `第${x + 1}位數字欄位`} key={x} py={8} px={2} />
                      ))}
                    </PinInput>
                  )}
                ></Controller>
              </HStack>
              {isSubmitting && <Progress isAnimated={true}></Progress>}
              {errors?.otp?.message && (
                <FormHelperText color="red.500">
                  {errors?.otp?.message}
                </FormHelperText>
              )}
              <FormHelperText color="gray.900">
                {getWording("otpVerify.failed_to_receive_message")}
                <Button size="sm" variant="link" color="gray.900">
                  {getWording("otpVerify.resend_link_label")}
                </Button>
              </FormHelperText>
            </FormControl>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OtpVerifyModal;
