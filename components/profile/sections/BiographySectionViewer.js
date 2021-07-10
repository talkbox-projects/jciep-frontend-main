import {
  Text,
  Button,
  HStack,
  VStack,
  AspectRatio,
  Image,
} from "@chakra-ui/react";
import { RiEdit2Line } from "react-icons/ri";
import ProfileStore from "../../../store/ProfileStore";
import wordExtractor from "../../../utils/wordExtractor";

export const BiographySectionViewer = () => {
  const { page, identity, setEditSection } = ProfileStore.useContext();

  return (
    <VStack px={8} pb={8} align="stretch">
      <HStack py={4} align="center">
        <Text flex={1} minW={0} w="100%" fontSize="2xl">
          {wordExtractor(page?.content?.wordings, "biography_header_label")}
        </Text>

        <Button
          onClick={() => setEditSection("biography")}
          variant="link"
          leftIcon={<RiEdit2Line />}
        >
          {wordExtractor(page?.content?.wordings, "section_edit_label")}
        </Button>
      </HStack>
      {(identity?.biography?.blocks ?? []).map(
        ({ id, type, youtubeUrl, text, file }, index) => {
          let comp = null;
          const prefix = `biography.blocks[${index}]`;
          switch (type) {
            case "youtube":
              const match = (youtubeUrl ?? "").match(
                /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
              );
              const youtubeId =
                match && match[7].length == 11 ? match[7] : null;
              comp = (
                <AspectRatio w="100%" ratio={16 / 9}>
                  <iframe
                    src={`https://youtube.com/embed/${youtubeId}`}
                    allowFullScreen
                  />
                </AspectRatio>
              );
              break;
            case "image":
              comp = <Image src={file?.url} />;
              break;
            case "text":
              comp = <Text whiteSpace="pre-line">{text}</Text>;
              break;
            default:
          }
          return (
            <HStack key={id} align="start">
              {comp}
            </HStack>
          );
        }
      )}
    </VStack>
  );
};

export default BiographySectionViewer;
