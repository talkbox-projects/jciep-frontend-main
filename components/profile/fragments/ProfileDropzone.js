import { Image, AspectRatio, Icon, Text, VStack } from "@chakra-ui/react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useDropzone } from "react-dropzone";
import wordExtractor from "../../../utils/wordExtractor";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../../../utils/apollo";
const ProfileDropzone = ({ multiple = false, page, value, onChange }) => {
  const { getRootProps, getInputProps } = useDropzone({
    multiple,
    accept: "image/*,application/pdf",
    maxSize: 1024,
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
  });

  return (
    <VStack
      align="center"
      w="100%"
      py={6}
      textAlign="center"
      borderStyle="dashed"
      borderWidth={2}
      borderRadius={16}
      borderColor="#aaa"
      {...getRootProps()}
    >
      <>
        <input {...getInputProps()} />
        {!value ? (
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
          <Image src={value?.url} />
        ) : (
          <Text>{value?.url}</Text>
        )}
      </>
    </VStack>
  );
};

export default ProfileDropzone;
