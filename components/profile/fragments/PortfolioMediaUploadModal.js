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
  Select,
  VStack,
  Box,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Textarea,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineCloudUpload } from "react-icons/ai";
import wordExtractor from "../../../utils/wordExtractor";

const PortfolioMediaUploadModal = ({
  portfolioItem,
  page,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [mode, setMode] = useState("upload"); // mode = [upload, youtube]

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (!isOpen) {
      reset();
      setMode("upload");
    }
  }, [isOpen]);

  const onSubmitButtonClick = useCallback((item) => {
    console.log(item);
    onSubmit(item);
  }, []);

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
          <VStack
            as="form"
            onSubmit={handleSubmit(onSubmitButtonClick)}
            py={8}
            align="stretch"
          >
            <FormControl>
              <Select value={null} onChange={(e) => setMode(e.target.value)}>
                <option value="upload">
                  {wordExtractor(
                    page?.content?.wordings,
                    "upload_button_label"
                  )}{" "}
                </option>
                <option value="youtube">
                  {wordExtractor(
                    page?.content?.wordings,
                    "insert_youtube_link_label"
                  )}
                </option>
              </Select>
            </FormControl>
            <VStack p={8} spacing={4} align="stretch">
              {mode === "upload" && (
                <AspectRatio ratio={2.5}>
                  <Controller
                    control={control}
                    name="url"
                    render={({ field: { value, onChange } }) => {
                      return (
                        <Dropzone>
                          {({ getRootProps, getInputProps }) => (
                            <VStack
                              align="stretch"
                              w="100%"
                              borderStyle="dashed"
                              borderWidth={2}
                              borderRadius={8}
                              borderColor="#aaa"
                              {...getRootProps()}
                            >
                              <Icon
                                as={AiOutlineCloudUpload}
                                fontSize="4xl"
                                color="#aaa"
                              />
                              <input {...getInputProps()} />
                              <Text>
                                {wordExtractor(
                                  page?.content?.wordings,
                                  "dropzone_label"
                                )}
                                <br />
                                {wordExtractor(
                                  page?.content?.wordings,
                                  "supported_image_format_label"
                                )}
                              </Text>
                            </VStack>
                          )}
                        </Dropzone>
                      );
                    }}
                  />
                </AspectRatio>
              )}

              {mode === "youtube" && (
                <>
                  <FormControl isInvalid={errors?.url?.message}>
                    <FormLabel>
                      {wordExtractor(
                        page?.content?.wordings,
                        "form_label_youtube_link"
                      )}
                    </FormLabel>
                    <Input
                      {...register("url", {
                        required: wordExtractor(
                          page?.content?.wordings,
                          "invalid_youtube_link_message"
                        ),
                        pattern: {
                          value:
                            /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
                          message: wordExtractor(
                            page?.content?.wordings,
                            "invalid_youtube_link_message"
                          ),
                        },
                      })}
                    ></Input>
                    {errors?.url?.message && (
                      <FormHelperText color="red">
                        {errors?.url?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </>
              )}

              <FormControl>
                <FormLabel>
                  {wordExtractor(
                    page?.content?.wordings,
                    "field_label_media_description"
                  )}
                </FormLabel>
                <Textarea
                  resize="none"
                  rows={5}
                  {...register("description", {})}
                />
              </FormControl>
            </VStack>
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
              {wordExtractor(page?.content?.wordings, "upload_button_label")}
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PortfolioMediaUploadModal;
