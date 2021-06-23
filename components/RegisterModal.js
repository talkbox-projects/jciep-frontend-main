import { useAppContext } from "../store/AppStore";
import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalOverlay,
  useToast,
  Button,
  VStack,
  HStack,
  Text,
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  IoLogoFacebook,
  IoLogoGoogle,
  IoLogoApple,
  IoMdPhonePortrait,
} from "react-icons/io";
import { AiOutlineMail } from "react-icons/ai";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../utils/apollo";
import { useGetWording } from "../utils/wordings/useWording";

const RegisterModal = () => {
  const {
    registerModalDisclosure,
    loginModalDisclosure,
    otpVerifyModalDisclosure,
    emailVerifySentModalDisclosure,
  } = useAppContext();

  const [tab, setTab] = useState("email");
  const getWording = useGetWording();

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();
  const toast = useToast();

  const onPhoneRegister = useCallback(async ({ phone }) => {
    try {
      const mutation = gql`
        mutation UserPhoneVerify($phone: String!) {
          UserPhoneVerify(phone: $phone)
        }
      `;
      await getGraphQLClient().request(mutation, { phone });
      otpVerifyModalDisclosure.onOpen({ phone, type: "register" });
      registerModalDisclosure.onClose();
    } catch (e) {
      setError("email", {
        message: getWording("register.register_error_message"),
      });
    }
  }, []);

  const onEmailRegister = useCallback(async ({ email }) => {
    try {
      const mutation = gql`
        mutation UserEmailVerify($email: String!) {
          UserEmailVerify(email: $email)
        }
      `;
      await getGraphQLClient().request(mutation, { email });
      emailVerifySentModalDisclosure.onOpen();
      registerModalDisclosure.onClose();
    } catch (e) {
      setError("phone", {
        message: getWording("register.register_error_message"),
      });
    }
  }, []);

  return (
    <Modal
      isOpen={registerModalDisclosure.isOpen}
      onClose={registerModalDisclosure.onClose}
    >
      <ModalOverlay></ModalOverlay>
      <ModalContent maxW={400} w="95%" py={4}>
        <ModalHeader mt={4} fontSize="3xl">
          {getWording("register.register_title")}
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            {tab === "email" && (
              <VStack as="form" onSubmit={handleSubmit(onEmailRegister)}>
                <FormControl>
                  <FormLabel>
                    {getWording("register.register_email_label")}
                  </FormLabel>
                  <Input
                    placeholder="testing@example.com"
                    {...register("email")}
                  />
                  <FormHelperText>{errors?.email?.message}</FormHelperText>
                </FormControl>
                <FormControl>
                  <Button
                    color="black"
                    w="100%"
                    fontWeight="bold"
                    lineHeight={3}
                    borderRadius="3xl"
                    colorScheme="primary"
                    bgColor="primary.400"
                    isLoading={isSubmitting}
                    type="submit"
                  >
                    {getWording("register.register_button_label")}
                  </Button>
                </FormControl>
              </VStack>
            )}
            {tab === "phone" && (
              <VStack as="form" onSubmit={handleSubmit(onPhoneRegister)}>
                <FormControl>
                  <FormLabel>
                    {getWording("register.register_phone_label")}
                  </FormLabel>
                  <Input placeholder="91234567" {...register("phone")} />
                  <FormHelperText>{errors?.phone?.message}</FormHelperText>
                </FormControl>
                <FormControl>
                  <Button
                    color="black"
                    w="100%"
                    fontWeight="bold"
                    lineHeight={3}
                    borderRadius="3xl"
                    colorScheme="primary"
                    bgColor="primary.400"
                    isLoading={isSubmitting}
                    type="submit"
                  >
                    {getWording("register.phone_verify_button_label")}
                  </Button>
                </FormControl>
              </VStack>
            )}
            <HStack py={2} align="center">
              <Box
                flex={1}
                minW={0}
                w="100%"
                borderBottomWidth={1}
                borderColor="gray.200"
              ></Box>
              <Box fontSize="sm" color="gray.400">
                {getWording("register.or_label")}
              </Box>
              <Box
                flex={1}
                minW={0}
                w="100%"
                borderBottomWidth={1}
                borderColor="gray.200"
              ></Box>
            </HStack>

            <VStack align="stretch">
              {tab === "email" && (
                <Button
                  onClick={() => setTab("phone")}
                  variant="outline"
                  borderWidth={2}
                  borderColor="black"
                  colorScheme="gray"
                >
                  <HStack w="100%">
                    <IoMdPhonePortrait size={18} />
                    <Text flex={1} minW={0} w="100%">
                      Sign Up With Phone
                    </Text>
                  </HStack>
                </Button>
              )}
              {tab === "phone" && (
                <Button
                  onClick={() => setTab("email")}
                  variant="outline"
                  borderWidth={2}
                  borderColor="black"
                  colorScheme="gray"
                >
                  <HStack w="100%">
                    <AiOutlineMail size={18} />
                    <Text flex={1} minW={0} w="100%">
                      Sign Up With Email
                    </Text>
                  </HStack>
                </Button>
              )}
              <Button colorScheme="facebook" color="white">
                <HStack w="100%">
                  <IoLogoFacebook size={18} color="white" />
                  <Text flex={1} minW={0} w="100%">
                    Sign Up With Facebook
                  </Text>
                </HStack>
              </Button>
              <Button
                variant="solid"
                _hover={{ bgColor: "black" }}
                bgColor="black"
                color="white"
              >
                <HStack w="100%">
                  <IoLogoApple size={18} color="white" />
                  <Text flex={1} minW={0} w="100%">
                    Sign Up With Apple
                  </Text>
                </HStack>
              </Button>
              <Button colorScheme="google" color="white">
                <HStack w="100%">
                  <IoLogoGoogle size={18} color="white" />
                  <Text flex={1} minW={0} w="100%">
                    Sign Up With Google
                  </Text>
                </HStack>
              </Button>
            </VStack>
            <Button
              alignSelf="start"
              variant="link"
              color="black"
              fontWeight="normal"
              onClick={() => {
                registerModalDisclosure.onClose();
                loginModalDisclosure.onOpen();
              }}
            >
              {getWording("register.login_message_link")}
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RegisterModal;
