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
import OrganizationMemberInvite from "../../../utils/api/OrganizationMemberInvite";
import { emailRegex } from "../../../utils/general";
import wordExtractor from "../../../utils/wordExtractor";

const OrganzationMemberInviteModal = ({ isOpen, onClose, params }) => {
  const { page, enums } = OrganizationProfileStore.useContext();
  const router = useRouter();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: {},
  });

  const onInvite = useCallback(
    async (values) => {
      try {
        if (!params?.id) return;
        await OrganizationMemberInvite({
          input: { id: params?.id, ...values },
        });
        onClose();
        alert("invited!");
      } catch (error) {
        console.error(error);
      }
    },
    [params]
  );
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay></ModalOverlay>
      <ModalContent as="form" onSubmit={handleSubmit(onInvite)}>
        <ModalHeader>
          {wordExtractor(
            page?.content?.wordings,
            "field_label_invite_modal_header"
          )}
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody as={VStack} align="stretch">
          <FormControl>
            <FormLabel>
              {wordExtractor(page?.content?.wordings, "field_label_join_role")}
            </FormLabel>
            <Select
              defaultValue={"member"}
              {...register("role", {
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
              })}
            >
              {enums?.EnumJoinRoleList?.map(
                ({ key: value, value: { [router.locale]: label } }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                )
              )}
            </Select>
            <FormHelperText color="red">{errors?.role?.message}</FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>
              {wordExtractor(
                page?.content?.wordings,
                "field_label_invitation_email"
              )}
            </FormLabel>
            <Input
              {...register("email", {
                required: wordExtractor(
                  page?.content?.wordings,
                  "field_error_message_required"
                ),
                pattern: {
                  value: emailRegex,
                  message: wordExtractor(
                    page?.content?.wordings,
                    "field_error_message_invalid_email"
                  ),
                },
              })}
            ></Input>
            <FormHelperText color="red">
              {errors?.email?.message}
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

export default OrganzationMemberInviteModal;
