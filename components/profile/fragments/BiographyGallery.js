import React from "react";
import {
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import { useCallback } from "react";

const BiographyGallery = ({ isOpen, onClose, params }) => {


  const getImageComponent = useCallback((item) => {
    return (
      <VStack align="stretch">
        <Image alt={item?.description ?? " "} src={item?.file?.url} allowFullScreen />
      </VStack>
    );
  }, []);


  return (
    <Modal size="3xl" onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>{getImageComponent(params?.item)}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BiographyGallery;
