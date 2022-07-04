import { useAppContext } from "../../../store/AppStore";
import { Controller, useForm } from "react-hook-form";
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
  IconButton,
  PinInput,
  PinInputField,
  HStack,
  FormHelperText,
  Progress,
  Flex,
} from "@chakra-ui/react";
import { phoneRegex } from "../../../utils/general";
import { useGetWording } from "../../../utils/wordings/useWording";
import { getGraphQLClient } from "../../../utils/apollo";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/router";
import UserPasswordResetPhoneSend from "../../../utils/api/UserPasswordResetPhoneSend";
import OtpVerifyModal from "../../../components/OtpVerifyModal";
import { gql } from "graphql-request";

const OtpVerify = () => {
  const {
    user,
    resetPasswordPhoneModalDisclosure: { isOpen, onClose },
    otpVerifyModalDisclosure,
    resetPasswordResetModalDisclosure,
    resetPasswordStatus,
    setResetPasswordStatus,
  } = useAppContext();
  const router = useRouter();

  const getWording = useGetWording();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onOtpVerify = async ({ otp }) => {
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
        phone: resetPasswordStatus?.phone,
      });

      if (data?.UserPhoneValidityCheck?.phone) {
        setResetPasswordStatus({
          ...resetPasswordStatus,
          otp: otp,
          step: 'resetPassword'
        });
      }
    } catch (e) {
      setError("otp", {
        message: getWording("otpVerify.invalid_otp_message"),
      });
    }
  };

  return (
    <Box py={{ base: 24 }}>
      <Box mb={{ base: 4 }}>
        <Flex direction={"row"} align="center">
          <IconButton
            variant="ghost"
            icon={<FaArrowLeft />}
            onClick={() => {
              setResetPasswordStatus({
                ...resetPasswordStatus,
                type: "",
                step: "requestOtp",
              });
            }}
          />
          <Text>{getWording("otpVerify.otpVerify_title")}</Text>
        </Flex>
      </Box>
      <Box width="100%" background="#FFF">
        <VStack spacing={8} as="form" onSubmit={handleSubmit(onOtpVerify)}>
          <Box px={"15px"} width="100%">
            <FormControl>
              <FormLabel color="gray.800" fontWeight="normal">
                {getWording("otpVerify.sms_sent_message", {
                  params: { phone: resetPasswordStatus?.phone },
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
                        <PinInputField
                          aria-label={
                            router.locale === "en"
                              ? `${x + 1}th digit field`
                              : `第${x + 1}位數字欄位`
                          }
                          key={x}
                          py={8}
                          px={2}
                        />
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

export default OtpVerify;
