import { useAppContext } from "../store/AppStore";
import { Controller, useForm } from "react-hook-form";
import { useCallback, useState } from "react";
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

const EmailVerifySentModal = () => {
  const { emailVerifySentModalDisclosure } = useAppContext();

  const getWording = useGetWording();

  return (
    <Modal
      isCentered
      isOpen={emailVerifySentModalDisclosure.isOpen}
      onClose={emailVerifySentModalDisclosure.onClose}
    >
      <ModalOverlay></ModalOverlay>
      <ModalContent maxW={600} w="95%" py={4}>
        <ModalHeader as={HStack} align="center" fontSize="3xl">
          <IconButton
            variant="ghost"
            icon={<FaArrowLeft />}
            onClick={() => {
              emailVerifySentModalDisclosure.onClose();
            }}
          ></IconButton>
          <Text>{getWording("emailVerifySent.title")}</Text>
        </ModalHeader>
        <ModalBody>
          <Text>{getWording("emailVerifySent.description")}</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EmailVerifySentModal;
