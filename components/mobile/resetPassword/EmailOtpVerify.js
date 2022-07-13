import { useAppContext } from "../../../store/AppStore";
import { Controller, useForm } from "react-hook-form";
import React from "react";
import {
  FormControl,
  FormLabel,
  Text,
  VStack,
  Button,
  Box,
  IconButton,
  PinInput,
  PinInputField,
  HStack,
  FormHelperText,
  Progress,
  Flex,
} from "@chakra-ui/react";
import { useGetWording } from "../../../utils/wordings/useWording";
import { getGraphQLClient } from "../../../utils/apollo";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/router";
import { gql } from "graphql-request";

const OtpVerify = ({page}) => {
  const {
    resetPasswordPhoneModalDisclosure: { isOpen, onClose },
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
        query UserEmailOTPValidityCheck($email: String!, $otp: String!) {
          UserEmailOTPValidityCheck(email: $email, otp: $otp) {
            email
            meta
          }
        }
      `;

      const data = await getGraphQLClient().request(query, {
        otp,
        email: resetPasswordStatus?.email,
      });

      if (data?.UserEmailOTPValidityCheck?.email) {
        setResetPasswordStatus({
          ...resetPasswordStatus,
          otp: otp,
          step: 'resetPassword'
        });
      } else {
        setError("otp", {
          message: page?.content?.otpVerify?.invalid_otp_message,
        });
      }
    } catch (e) {
      setError("otp", {
        message: page?.content?.otpVerify?.invalid_otp_message,
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
          <Text>{page?.content?.otpVerify?.otpVerify_title}</Text>
        </Flex>
      </Box>
      <Box width="100%" background="#FFF">
        <VStack spacing={8} as="form" onSubmit={handleSubmit(onOtpVerify)}>
          <Box px={"15px"} width="100%">
            <FormControl>
              <FormLabel color="gray.800" fontWeight="normal">
                {/* {getWording("otpVerify.sms_sent_message", {
                  params: { phone: resetPasswordStatus?.phone },
                })} */}
                {page?.content?.otpVerify?.otpVerify_title_description}
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
                {/* {getWording("otpVerify.failed_to_receive_message")} */}
                {page?.content?.otpVerify?.failed_to_receive_message}
                <Button size="sm" variant="link" color="gray.900">
                  {/* {getWording("otpVerify.resend_link_label")} */}
                  {page?.content?.otpVerify?.resend_link_label}
                </Button>
              </FormHelperText>
            </FormControl>
          </Box>
          {/* <Box
            style={{
              background:
                "linear-gradient(180deg, rgba(57, 57, 57, 0.0001) 0%, #393939 100%)",
              marginTop: "60px",
            }}
            h={"16px"}
            w={"100%"}
            opacity={0.2}
          /> */}
          {/* <Box px={"15px"} py={"12px"} w="100%">
            <FormControl textAlign="center">
              <Button
                backgroundColor="#F6D644"
                borderRadius="22px"
                height="44px"
                width="100%"
                type="submit"
                isLoading={isSubmitting}
              >
                {page?.content?.otpVerify?.submit_button}
              </Button>
            </FormControl>
          </Box> */}
        </VStack>
      </Box>
    </Box>
  );
};

export default OtpVerify;
