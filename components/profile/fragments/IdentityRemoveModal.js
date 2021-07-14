import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react";
import { useState } from "react";
import wordExtractor from "../../../utils/wordExtractor";

const IdentityRemoveModal = ({
  isOpen,
  onClose,
  params: { page, onSubmit },
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          {wordExtractor(page?.content?.wordings, "remove_confirmation_title")}
        </ModalHeader>
        <ModalBody>
          {wordExtractor(
            page?.content?.wordings,
            "remove_confirmation_message"
          )}
        </ModalBody>
        <ModalFooter as={HStack} justifyContent="flex-end">
          <Button variant="ghost" onClick={onClose}>
            {wordExtractor(page?.content?.wordings, "cancel_button_label")}
          </Button>
          <Button
            colorScheme="red"
            isLoading={loading}
            onClick={async () => {
              try {
                setLoading(true);
                await onSubmit();
                setLoading(false);
              } catch (error) {
                console.error(error);
              }
            }}
          >
            {wordExtractor(page?.content?.wordings, "remove_button_label")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default IdentityRemoveModal;
