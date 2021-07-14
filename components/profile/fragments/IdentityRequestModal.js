import {
  AspectRatio,
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import wordExtractor from "../../../utils/wordExtractor";
import ProfileDropzone from "./ProfileDropzone";

const IdentityRequestModal = ({
  params: { entity, page, save, propName = "profilePic" },
  isOpen,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      id: entity?.id,
      bannerMedia: entity?.bannerMedia,
    },
  });

  return (
    <Modal size="lg" {...{ isOpen, onClose }}>
      <ModalOverlay />
      <ModalContent
        as="form"
        onSubmit={handleSubmit(async (values) => {
          try {
            await save(values);
            onClose();
          } catch (error) {
            console.error(error);
          }
        })}
      >
        <ModalHeader
          borderBottomWidth={1}
          fontWeight="normal"
          textAlign="center"
          color="black"
          fontSize="md"
        >
          <ModalCloseButton left={4} top={3} />
          {wordExtractor(
            page?.content?.wordings,
            "banner_media_upload_modal_title"
          )}
        </ModalHeader>
        <ModalBody as={VStack}>
          <Box w={240}>
            <Controller
              control={control}
              name={propName}
              defaultValue={entity?.[propName]}
              render={({ field: { value, onChange } }) => {
                return (
                  <AspectRatio ratio={1}>
                    <ProfileDropzone
                      value={value}
                      onChange={onChange}
                      page={page}
                    />
                  </AspectRatio>
                );
              }}
            />
          </Box>
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

export default IdentityRequestModal;
