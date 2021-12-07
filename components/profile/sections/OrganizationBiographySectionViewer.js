import React from "react";
import {
  Text,
  Button,
  HStack,
  VStack,
  AspectRatio,
  Image,
  Link,
} from "@chakra-ui/react";
import { RiEdit2Line } from "react-icons/ri";
import OrganizationProfileStore from "../../../store/OrganizationProfileStore";
import { getYoutubeLink } from "../../../utils/general";
import wordExtractor from "../../../utils/wordExtractor";
import { useDisclosureWithParams } from "../../../store/AppStore";
import BiographyGallery from "../fragments/BiographyGallery";

export const OrganizationBiographySectionViewer = () => {
  const { page, organization, setEditSection, isAdmin, editable, editSection } =
    OrganizationProfileStore.useContext();

  const galleryDisclosure = useDisclosureWithParams();
  return (
    <VStack px={8} pb={8} align="stretch">
      <HStack py={4} align="center">
        <Text flex={1} minW={0} w="100%" fontSize="2xl">
          {wordExtractor(page?.content?.wordings, "biography_header_label")}
        </Text>

        {(isAdmin || editable) && !editSection && (
          <Button
            onClick={() => setEditSection("biography")}
            variant="link"
            leftIcon={<RiEdit2Line />}
          >
            {wordExtractor(page?.content?.wordings, "section_edit_label")}
          </Button>
        )}
      </HStack>
      {(organization?.biography?.blocks ?? []).map(
        ({ id, type, youtubeUrl, text, file, imageLabel, url, urlLabel = url }) => {
          let comp = null;
          switch (type) {
            case "youtube": {
              const youtubeLink = getYoutubeLink(youtubeUrl);
              comp = (
                <AspectRatio w="100%" ratio={16 / 9}>
                  <iframe src={youtubeLink} allowFullScreen />
                </AspectRatio>
              );
              break;
            }
            case "image":
              comp = <Image cursor="pointer" onClick={() => {
                galleryDisclosure.onOpen({
                  item: { file },
                });
              }} alt={imageLabel} src={file?.url} />;
              break;
            case "text":
              comp = <Text whiteSpace="pre-line" wordBreak="break-word">{text}</Text>;
              break;
            case "url":
              comp = <Link href={url} target="_blank"><Text whiteSpace="pre-line" wordBreak="break-word">{urlLabel}</Text></Link>;
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
      <BiographyGallery
        params={galleryDisclosure.params}
        page={page}
        isOpen={galleryDisclosure.isOpen}
        onClose={galleryDisclosure.onClose}
      />
    </VStack>
  );
};

export default OrganizationBiographySectionViewer;
