import {
  AspectRatio,
  Text,
  Icon,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  Box,
  FormControl,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import Dropzone from "react-dropzone";
import { useForm } from "react-hook-form";
import { AiOutlineCloudUpload } from "react-icons/ai";
import wordExtractor from "../../../utils/wordExtractor";

const BannerMediaUploadModal = ({ page, isOpen, onClose }) => {
  const [mode, setMode] = useState("upload"); // mode = [upload, youtube]

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = useCallback(({ bannerMedia }) => {
    try {
    } catch (error) {
      console.error(error);
    }
  }, []);

  const uploadComponent = (
    <VStack color="#aaa" align="stretch" spacing={4} py={8} px={8} w="100%">
      <AspectRatio ratio={2.5}>
        <Dropzone>
          {({ getRootProps, getInputProps }) => (
            <VStack
              align="stretch"
              w="100%"
              borderStyle="dashed"
              borderWidth={2}
              borderRadius={16}
              borderColor="#aaa"
              {...getRootProps()}
            >
              <Icon as={AiOutlineCloudUpload} fontSize="4xl" color="#aaa" />
              <input {...getInputProps()} />
              <Text>
                {wordExtractor(page?.content?.wordings, "dropzone_label")}
                <br />
                {wordExtractor(
                  page?.content?.wordings,
                  "supported_image_format_label"
                )}
              </Text>
            </VStack>
          )}
        </Dropzone>
      </AspectRatio>
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

  const youtubeComponent = (
    <VStack
      as="form"
      onSubmit={handleSubmit(onYoutubeLinkInsert)}
      color="#aaa"
      align="center"
      spacing={4}
      py={8}
      px={8}
    >
      <FormControl isInvalid={errors?.bannerMedia?.message}>
        <FormLabel></FormLabel>
        <Input
          borderRadius="2em"
          {...register("bannerMedia", {
            valiate: {
              pattern: {
                value: /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
                message: wordExtractor(
                  page?.content?.wording,
                  "invalid_youtube_link_message"
                ),
              },
            },
          })}
        ></Input>
        <Button
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
      </FormControl>
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
      <ModalContent>
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
          {mode === "upload" ? uploadComponent : youtubeComponent}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BannerMediaUploadModal;
