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
  FormLabel,
  Input,
  FormHelperText,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { useForm } from "react-hook-form";
import { AiOutlineCloudUpload } from "react-icons/ai";
import wordExtractor from "../../../utils/wordExtractor";

const ProfilePicUploadModal = ({ page, isOpen, onClose }) => {
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
        <ModalBody>{uploadComponent}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProfilePicUploadModal;
