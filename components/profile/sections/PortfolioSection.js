import {
  Text,
  Button,
  HStack,
  VStack,
  AspectRatio,
  Box,
  Icon,
  SimpleGrid,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import Dropzone from "react-dropzone";
import { AiOutlineClose, AiOutlineDelete } from "react-icons/ai";
import {
  RiAddFill,
  RiCloseCircleFill,
  RiDeleteBin2Line,
  RiEdit2Line,
  RiFilePdfLine,
  RiPulseLine,
} from "react-icons/ri";
import { useDisclosureWithParams } from "../../../store/AppStore";
import wordExtractor from "../../../utils/wordExtractor";
import PortfolioMediaUploadModal from "../fragments/PortfolioMediaUploadModal";
import SectionCard from "../fragments/SectionCard";

const PortfolioSection = ({ identity, page, enums, editable }) => {
  //TODO: demo media
  const [medias, setMedias] = useState([
    {
      id: "media-1",
      title: "Title 1",
      description: "description 1",
      type: "video",
      url: "https://www.youtube.com/watch?v=i9I55MZLYYY",
    },
    {
      id: "media-2",
      title: "Title 2",
      description: "description 2",
      type: "image",
      url: "https://loremflickr.com/800/600/dog",
    },
    {
      id: "media-3",
      title: "Title 3",
      description: "description 3",
      type: "image",
      url: "https://loremflickr.com/800/600/cat",
    },
    {
      id: "media-4",
      title: "Title pdf 3",
      description: "description 3",
      type: "pdf",
      url: "http://www.africau.edu/images/default/sample.pdf",
    },
    {
      id: "media-5",
      title: "Title 3",
      description: "description 3",
      type: "image",
      url: "https://loremflickr.com/800/600/cat",
    },
    {
      id: "media-6",
      title: "Title pdf 3",
      description: "description 3",
      type: "pdf",
      url: "http://www.africau.edu/images/default/sample.pdf",
    },
  ]);

  const lightBoxDisclosure = useDisclosureWithParams();
  const portfolioMediaDisclosure = useDisclosure();
  const editModeDisclosure = useDisclosure();

  const onItemRemove = useCallback(
    (index) => {
      setMedias((medias) => {
        const newMedias = [...medias];
        newMedias.splice(index, 1);
        return newMedias;
      });
    },
    [setMedias]
  );

  const onPortfolioItemClick = useCallback(
    (item) => {
      if (editModeDisclosure.isOpen) {
        portfolioMediaDisclosure.onOpen({
          item,
        });
      } else {
        lightBoxDisclosure.onOpen({
          item,
        });
      }
    },
    [editModeDisclosure.isOpen]
  );

  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        <HStack px={8} py={4} align="center">
          <Text flex={1} minW={0} w="100%" fontSize="2xl">
            {wordExtractor(page?.content?.wordings, "portfolio_header_label")}
          </Text>
          {editModeDisclosure.isOpen ? (
            <Button
              onClick={editModeDisclosure.onClose}
              variant="link"
              leftIcon={<RiEdit2Line />}
            >
              {wordExtractor(page?.content?.wordings, "save_button_label")}
            </Button>
          ) : (
            <Button
              onClick={editModeDisclosure.onOpen}
              variant="link"
              leftIcon={<RiEdit2Line />}
            >
              {wordExtractor(page?.content?.wordings, "section_edit_label")}
            </Button>
          )}
        </HStack>
        <SimpleGrid px={8} py={4} columns={4} gap={3}>
          {(medias ?? []).map((media, index) => {
            let comp = null;
            switch (media.type) {
              case "video":
                comp = <Icon as={RiFilePdfLine} fontSize="4xl" color="#ddd" />;
                break;
              case "image":
                comp = (
                  <Box
                    w="100%"
                    h="100%"
                    bgImg={`url('${media?.url}')`}
                    bgPos="center"
                    bgSize="cover"
                  />
                );
                break;
              case "pdf":
                comp = (
                  <Icon
                    fontSize="4xl"
                    as={RiFilePdfLine}
                    fontSize="4xl"
                    color="#ddd"
                  />
                );
                break;
            }

            return (
              <AspectRatio ratio={1}>
                <Box
                  onClick={onPortfolioItemClick}
                  cursor="pointer"
                  borderRadius={8}
                  boxShadow="sm"
                  position="relative"
                >
                  {editModeDisclosure.isOpen && (
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemRemove(index);
                      }}
                      minW="auto"
                      p={1}
                      m={0}
                      position="absolute"
                      right={0}
                      top={0}
                      fontSize="lg"
                      color="gray.300"
                      icon={<RiCloseCircleFill />}
                      variant="link"
                    />
                  )}
                  {comp}
                </Box>
              </AspectRatio>
            );
          })}
          {(editModeDisclosure.isOpen || medias.length === 0) && (
            <AspectRatio ratio={1}>
              <VStack
                onClick={onPortfolioItemClick}
                boxShadow="sm"
                onClick={portfolioMediaDisclosure.onOpen}
                cursor="pointer"
              >
                <IconButton
                  fontSize="4xl"
                  icon={<RiAddFill />}
                  variant="link"
                />
                <Text>
                  {wordExtractor(page?.content?.wordings, "add_media_label")}
                </Text>
              </VStack>
            </AspectRatio>
          )}
        </SimpleGrid>
      </VStack>
      <PortfolioMediaUploadModal
        page={page}
        isOpen={portfolioMediaDisclosure.isOpen}
        onClose={portfolioMediaDisclosure.onClose}
      />
    </SectionCard>
  );
};

export default PortfolioSection;
