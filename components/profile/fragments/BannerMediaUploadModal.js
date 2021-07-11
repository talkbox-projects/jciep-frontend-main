import {
  AspectRatio,
  Text,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
} from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import wordExtractor from "../../../utils/wordExtractor";
import ProfileDropzone from "./ProfileDropzone";

const BannerMediaUploadModal = ({
  isOpen,
  onClose,
  params: { entity, page, save },
}) => {
  const [mode, setMode] = useState("upload"); // mode = [upload, youtube]

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

  const getUploadComponent = () => (
    <VStack color="#aaa" align="stretch" spacing={4} py={8} px={8} w="100%">
      <AspectRatio ratio={2.5}>
        <Controller
          control={control}
          name="bannerMedia.file"
          rules={[]}
          defaultValue={entity?.bannerMedia}
          render={({ field: { value, onChange } }) => {
            return (
              <AspectRatio ratio={2.5}>
                <ProfileDropzone
                  value={value}
                  onChange={onChange}
                  page={page}
                />
              </AspectRatio>
            );
          }}
        />
      </AspectRatio>
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
      <Text textAlign="center" mt={6}>
        {wordExtractor(page?.content?.wordings, "or_label")}{" "}
        <Button
          onClick={() => setMode("youtube")}
          fontWeight="normal"
          variant="link"
          colorScheme="green"
        >
          {wordExtractor(page?.content?.wordings, "insert_youtube_link_label")}
        </Button>
      </Text>
    </VStack>
  );

  const getYoutubeComponent = () => (
    <VStack align="center" spacing={4} py={8} px={8}>
      <FormControl
        as={VStack}
        align="center"
        isInvalid={errors?.bannerMedia?.message}
      >
        <FormLabel color="#aaa" fontWeight="normal">
          {wordExtractor(page?.content?.wordings, "form_label_youtube_link")}
        </FormLabel>
        <Input
          borderRadius="2em"
          {...register("bannerMedia.videoUrl", {
            pattern: {
              value: /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
              message: wordExtractor(
                page?.content?.wordings,
                "invalid_youtube_link_message"
              ),
            },
          })}
        ></Input>
        {errors?.bannerMedia?.message && (
          <FormHelperText color="red">
            {errors?.bannerMedia?.message}
          </FormHelperText>
        )}
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
      <Text mt={6}>
        {wordExtractor(page?.content?.wordings, "or_label")}{" "}
        <Button
          onClick={() => setMode("upload")}
          fontWeight="normal"
          variant="link"
          colorScheme="green"
        >
          {wordExtractor(page?.content?.wordings, "upload_image_label")}
        </Button>
      </Text>
    </VStack>
  );

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
        <ModalBody>
          {mode === "upload" ? getUploadComponent() : getYoutubeComponent()}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BannerMediaUploadModal;
