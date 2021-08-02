import React from "react";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import wordExtractor from "../../../utils/wordExtractor";

const PortfolioPublishApproveModal = ({
  isOpen,
  onClose,
  params: { page, onSubmit },
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {wordExtractor(page?.content?.wordings, "approve_publish_title")}
        </ModalHeader>
        <ModalBody>
          {wordExtractor(page?.content?.wordings, "approve_publish_message")}
        </ModalBody>
        <ModalFooter as={HStack} justifyContent="flex-end">
          <Button variant="ghost" onClick={onClose}>
            {wordExtractor(page?.content?.wordings, "cancel_button_label")}
          </Button>
          <Button colorScheme="green" onClick={onSubmit}>
            {wordExtractor(page?.content?.wordings, "ok_button_label")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PortfolioPublishApproveModal;
