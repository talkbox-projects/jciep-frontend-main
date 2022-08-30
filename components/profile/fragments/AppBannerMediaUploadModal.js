/* eslint-disable no-useless-escape */
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
  Icon,
  Image,
  IconButton
} from "@chakra-ui/react";
import { gql } from "graphql-request";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import wordExtractor from "../../../utils/wordExtractor";
import { getGraphQLClient } from "../../../utils/apollo";
import { AiOutlineCloudUpload } from "react-icons/ai";
import ProfileDropzone from "./ProfileDropzone";
import { RiCloseCircleFill } from "react-icons/ri";

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
    setValue,
  } = useForm({
    defaultValues: {
      id: entity?.id,
      bannerMedia: entity?.bannerMedia,
    },
  });

  const FileUploadmutation = gql`
    mutation FileUpload($file: FileUpload!) {
      FileUpload(files: $file) {
        id
        url
        contentType
        fileSize
      }
    }
  `;

  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const handlePickFile = (fieldName) => {
    window.WebContext = {};
    window.WebContext.pickFileHandler = async (response) => {
      const fileInfo = JSON.parse(response);
      if (!fileInfo.result) {
        return;
      } else {
        let file = dataURLtoFile(
          fileInfo.result?.data[0]?.data,
          fileInfo.result?.data[0]?.name
        );
        let bannerUploadData;

        if (file) {
          bannerUploadData = await getGraphQLClient().request(
            FileUploadmutation,
            {
              file: file,
            }
          );

          try {
            setValue("bannerMedia.file", bannerUploadData?.FileUpload?.[0]);
          } catch (error) {
            console.error(error);
          }
        }
      }
    };

    let json = {
      name: "pickFile",
      options: {
        callback: "pickFileHandler",
        params: {
          maxFileSize: 4194304,
          maxFileCount: 1,
          minFileCount: 1,
          mimeType: "image/*",
          supportCrop: true,
        },
      },
    };

    if (window && window.AppContext && window.AppContext.postMessage) {
      window.AppContext.postMessage(JSON.stringify(json));
    }
  };

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
                <VStack
                  align="center"
                  w="100%"
                  textAlign="center"
                  borderStyle="dashed"
                  borderWidth={2}
                  borderColor="#aaa"
                  position="relative"
                  cursor="pointer"
                  onClick={() => handlePickFile()}
                >
                  <>
                    {!value?.url ? (
                      <>
                        <Icon
                          as={AiOutlineCloudUpload}
                          fontSize="4xl"
                          color="#aaa"
                        />
                        <Text>
                          {wordExtractor(
                            page?.content?.wordings,
                            "supported_image_format_label"
                          )}
                        </Text>
                      </>
                    ) : (value?.contentType ?? "").startsWith("image") ? (
                      <>
                        <Image
                          alt={wordExtractor(
                            page?.content?.wordings,
                            "upload_profile_alt_text"
                          )}
                          src={value?.url}
                          w="100%"
                        />
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            onChange(null);
                          }}
                          minW="auto"
                          position="absolute"
                          right={2}
                          top={0}
                          fontSize="lg"
                          color="gray.300"
                          icon={<RiCloseCircleFill />}
                          variant="link"
                        />
                      </>
                    ) : (
                      <Text>
                        {value?.url?.slice(
                          value?.url?.lastIndexOf("/") + 1,
                          value?.url?.length
                        )}
                      </Text>
                    )}
                  </>
                </VStack>
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
