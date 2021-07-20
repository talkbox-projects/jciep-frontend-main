import React from "react";
import {
  Image,
  Icon,
  Text,
  VStack,
  IconButton,
  useToast,
  Box,
} from "@chakra-ui/react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useDropzone } from "react-dropzone";
import wordExtractor from "../../../utils/wordExtractor";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../../../utils/apollo";
import { RiCloseCircleFill } from "react-icons/ri";

const ProfileDropzone = ({ multiple = false, page, value, onChange }) => {
  const toast = useToast();

  const getDropErrorCodeMsg = (errCode) => {
    switch (errCode) {
      case "file-invalid-type":
        return "不支援的檔案類別，請上載PNG、JPG、PDF";
      // return wordExtractor(
      //   page?.content?.wordings,
      //   "dropzone_error_invalid_type"
      // );
      case "file-too-large":
        // return wordExtractor(
        //   page?.content?.wordings,
        //   "dropzone_error_file_too_large"
        // );
        return "檔案大小不能超過 1 MB";
      default:
        // return wordExtractor(page?.content?.wordings, "dropzone_error_general");
        return "不支援的檔案類別";
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple,
    accept: "image/*,application/pdf",
    maxSize: 1024 * 1024,
    onDrop: async (files) => {
      try {
        if (files?.length === 0) return;
        const mutation = gql`
          mutation FileUpload($files: FileUpload!) {
            FileUpload(files: $files) {
              id
              url
              contentType
              fileSize
            }
          }
        `;
        const variables = {
          files,
        };

        const data = await getGraphQLClient().request(mutation, variables);
        onChange(data?.FileUpload?.[0]);
      } catch (e) {
        console.error(e);
      }
    },
    onDropRejected: (files) => {
      files.map(({ errors, file }) => {
        toast({
          title: file.name,
          description: (
            <Box>
              {errors?.map((error, i) => (
                <Text key={i}>{getDropErrorCodeMsg(error.code)}</Text>
              ))}
            </Box>
          ),
          status: "error",
        });
      });
    },
  });

  return (
    <VStack
      align="center"
      w="100%"
      textAlign="center"
      borderStyle="dashed"
      borderWidth={2}
      borderColor="#aaa"
      {...getRootProps()}
      position="relative"
      cursor="pointer"
    >
      <>
        <input {...getInputProps()} />
        {!value?.url ? (
          <>
            <Icon as={AiOutlineCloudUpload} fontSize="4xl" color="#aaa" />
            <Text>
              {wordExtractor(page?.content?.wordings, "dropzone_label")}
              <br />
              {wordExtractor(
                page?.content?.wordings,
                "supported_image_format_label"
              )}
            </Text>
          </>
        ) : (value?.contentType ?? "").startsWith("image") ? (
          <>
            <Image src={value?.url} />
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
  );
};

export default ProfileDropzone;
