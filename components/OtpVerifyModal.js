import { useAppContext } from "../store/AppStore";
import { useForm } from "react-hook-form";
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
  useToast,
  Button,
  VStack,
  HStack,
  PinInput,
  PinInputField,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { useGetWording } from "../utils/wordings/useWording";
import { FaArrowLeft } from "react-icons/fa";

const OtpVerifyModal = () => {
  const { otpVerifyModalDisclosure, setUser } = useAppContext();

  const getWording = useGetWording();

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();
  const toast = useToast();

  const onOtpVerify = useCallback(() => {}, []);

  return (
    <Modal
      isOpen={otpVerifyModalDisclosure.isOpen}
      onClose={otpVerifyModalDisclosure.onClose}
    >
      <ModalOverlay></ModalOverlay>
      <ModalContent maxW={600} w="95%" py={4}>
        <ModalHeader as={HStack} align="center" mt={4} fontSize="3xl">
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
          <VStack as="form" onSubmit={handleSubmit(onOtpVerify)}>
            <FormControl>
              <FormLabel color="gray.400" fontWeight="normal">
                {getWording("otpVerify.sms_sent_message")}
              </FormLabel>
              <HStack
                w="100%"
                color="black"
                my={4}
                spacing={[1, 2, 4]}
                justifyContent="center"
              >
                <PinInput size="lg" placeholder="">
                  {[0, 1, 2, 3, 4, 5].map((x) => (
                    <PinInputField py={8} px={2} />
                  ))}
                </PinInput>
              </HStack>
              <FormHelperText>
                {getWording("otpVerify.failed_to_receive_message")}
                <Button size="sm" variant="link">
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
