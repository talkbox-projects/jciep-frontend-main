import { useAppContext } from "../store/AppStore";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalOverlay,
  HStack,
  IconButton,
  Text,
  UnorderedList,
  ListItem
} from "@chakra-ui/react";
import { useGetWording } from "../utils/wordings/useWording";
import { FaArrowLeft } from "react-icons/fa";
import React from 'react';
import { useRouter } from "next/router";

const EmailVerifySentModal = () => {
  const { emailVerifySentModalDisclosure, email } = useAppContext();


  const getWording = useGetWording();
  const router = useRouter();

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
            aria-label={router.locale === "en" ? "back button":  "返回"}
            variant="ghost"
            icon={<FaArrowLeft />}
            onClick={() => {
              emailVerifySentModalDisclosure.onClose();
            }}
          ></IconButton>
          <Text textAlign="center" width="80%">{getWording("emailVerifySent.title")}</Text>
        </ModalHeader>
        <ModalBody>
          <Text fontSize="15px">{getWording("emailVerifySent.description_header_first_half")} {email} {getWording("emailVerifySent.description_header_second_half")}</Text>
          <Text fontSize="15px" marginTop="8px">{getWording("emailVerifySent.description_body_ques")} </Text>
          <Text fontSize="15px" marginTop="8px">{getWording("emailVerifySent.description_body_text")} </Text>
          <UnorderedList>
            <ListItem fontSize="15px">{getWording("emailVerifySent.description_body_list1")}</ListItem>
            <ListItem fontSize="15px">{getWording("emailVerifySent.description_body_list2")}</ListItem>
            <ListItem fontSize="15px">{getWording("emailVerifySent.description_body_list3")}</ListItem>
          </UnorderedList>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EmailVerifySentModal;
