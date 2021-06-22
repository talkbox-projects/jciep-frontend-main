import { useAppContext } from "../store/AppStore";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
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
} from "@chakra-ui/react";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../utils/apollo";
import { useGetWording } from "../utils/wordings/useWording";

const LoginModal = () => {
  const { loginModalDisclosure } = useAppContext();
  const getWording = useGetWording();

  const { handleSubmit, errors, register } = useForm();
  const toast = useToast();

  const onLogin = useCallback(async ({ email, password }) => {
    try {
      const mutation = gql`
        mutation UserLogin($input: LoginInput) {
          UserLogin(input: $input) {
            email
            identities {
              id
            }
          }
        }
      `;

      const variables = {
        input: {
          email,
          password,
        },
      };

      const data = await getGraphQLClient().request(mutation, variables);
      toast({
        title: "登入中",
        description: "We've created your account for you.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Failed",
        description: "We've created your account for you.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.error(e);
    }
  }, []);
  return (
    <Modal
      isOpen={loginModalDisclosure.isOpen}
      onClose={loginModalDisclosure.onClose}
    >
      <ModalOverlay></ModalOverlay>
      <ModalContent>
        <ModalHeader>{getWording("login.login_title")}</ModalHeader>
        <ModalBody>
          <Box as="form" onSubmit={handleSubmit(onLogin)}>
            <FormControl>
              <FormLabel>{getWording("login.login_email_label")}</FormLabel>
              <Input {...register("email")} />
              <FormHelperText>{errors?.email?.message}</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>{getWording("login.login_password_label")}</FormLabel>
              <Input type="password" {...register("password")} />
              <FormHelperText>{errors?.password?.message}</FormHelperText>
            </FormControl>
            <FormControl>
              <Button type="submit" variant="outline">
                {getWording("login.login_button_label")}
              </Button>
            </FormControl>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
