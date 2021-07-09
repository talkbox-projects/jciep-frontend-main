import { Image, AspectRatio, Icon, Text, VStack } from "@chakra-ui/react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useDropzone } from "react-dropzone";
import wordExtractor from "../../../utils/wordExtractor";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../../../utils/apollo";
const ProfileDropzone = ({ multiple = false, page, value, onChange }) => {
  const { getRootProps, getInputProps } = useDropzone({
    multiple,
    onDrop: async (files) => {
      try {
        const mutation = gql`
          mutation _FileUpload($files: [FileUpload]!) {
            _FileUpload(files: $files) {
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

        console.log(1, files);
        const data = await getGraphQLClient().request(mutation, variables);
        console.log(data);
        onChange(data?.FileUpload);
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
        ) : (
          <AspectRatio ratio={4 / 3}>
            <Image src={value} />
          </AspectRatio>
        )}
      </>
    </VStack>
  );
};

export default ProfileDropzone;
