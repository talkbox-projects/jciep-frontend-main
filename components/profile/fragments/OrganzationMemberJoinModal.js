import {
  FormControl,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  Button,
  VStack,
  Input,
  Select,
  FormHelperText,
  FormLabel,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import OrganizationProfileStore from "../../../store/OrganizationProfileStore";
import OrganizationInvitationCodeValidity from "../../../utils/api/OrganizationInvitationCodeValidity";
import wordExtractor from "../../../utils/wordExtractor";

const OrganizationMemberJoinModal = ({
  isOpen,
  onClose,
  params: { onSubmit, page, organizationType } = {},
}) => {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: {},
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay></ModalOverlay>
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>
          {wordExtractor(
            page?.content?.wordings,
            "field_label_join_modal_header"
          )}
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody as={VStack} align="stretch">
          <FormControl onInvalid={!!errors?.invitationCode?.message}>
            <FormLabel>
              {wordExtractor(page?.content?.wordings, "invitation_code_label")}
            </FormLabel>
            <Input
              type="text"
              placeholder={wordExtractor(
                page?.content?.wordings,
                "invitation_code_label"
              )}
              {...register("invitationCode", {
                validate: {
                  validity: async (invitationCode) => {
                    try {
                      const valid = await OrganizationInvitationCodeValidity({
                        invitationCode,
                        organizationType,
                      });
                      if (!valid) {
                        return wordExtractor(
                          page?.content?.wordings,
                          "invitation_code_error_message"
                        );
                      }
                      return true;
                    } catch (error) {
                      console.error(error);
                      return wordExtractor(
                        page?.content?.wordings,
                        "invitation_code_error_message"
                      );
                    }
                  },
                },
                pattern: {
                  value: /^[0-9]{6,6}$/,
                  message: wordExtractor(
                    page?.content?.wordings,
                    "invitation_code_error_message"
                  ),
                },
              })}
            />
            <FormHelperText color="red">
              {errors?.invitationCode?.message}
            </FormHelperText>
          </FormControl>
          <Button
            alignSelf="center"
            minW={24}
            mt={6}
            colorScheme="yellow"
            color="black"
            px={4}
            py={2}
            borderRadius="2em"
            type="submit"
            isLoading={isSubmitting}
          >
            {wordExtractor(page?.content?.wordings, "save_button_label")}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OrganizationMemberJoinModal;
