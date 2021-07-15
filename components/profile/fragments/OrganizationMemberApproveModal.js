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

const OrganizationMemberApproveModal = ({
  isOpen,
  onClose,
  params: { page, onSubmit },
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {wordExtractor(page?.content?.wordings, "approve_confirmation_title")}
        </ModalHeader>
        <ModalBody>
          {wordExtractor(
            page?.content?.wordings,
            "approve_confirmation_message"
          )}
        </ModalBody>
        <ModalFooter as={HStack} justifyContent="flex-end">
          <Button variant="ghost" onClick={onClose}>
            {wordExtractor(page?.content?.wordings, "cancel_button_label")}
          </Button>
          <Button colorScheme="green" onClick={onSubmit}>
            {wordExtractor(page?.content?.wordings, "approve_button_label")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OrganizationMemberApproveModal;
