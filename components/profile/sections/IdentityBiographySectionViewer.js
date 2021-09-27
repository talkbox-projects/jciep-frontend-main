import React, { useMemo } from "react";
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
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import { getYoutubeLink } from "../../../utils/general";
import wordExtractor from "../../../utils/wordExtractor";
import { useAppContext, useDisclosureWithParams } from "../../../store/AppStore";
import BiographyGallery from "../fragments/BiographyGallery";

export const IdentityBiographySectionViewer = () => {
  const { page, identity, setEditSection, isAdmin, editable, editSection } =
    IdentityProfileStore.useContext();

    const { identity: { type, organizationRole} = {} } = useAppContext();
    const galleryDisclosure = useDisclosureWithParams();

    const staffAccess = useMemo(() => {
      if (type === "staff" && organizationRole?.length > 0) {
        return (organizationRole ?? []).find(
          (role) =>
            role.organization.id === organizationRole[0].organization.id &&
            organizationRole[0].role === "staff" &&
            organizationRole[0].status === "joined"
        );
      }
      return false;
    }, [organizationRole, type]);


  return (
    <VStack px={8} pb={8} align="stretch">
      <HStack py={4} align="center">
        <Text flex={1} minW={0} w="100%" fontSize="2xl" fontFamily="SFNSDisplay"  >
          {wordExtractor(page?.content?.wordings, "biography_header_label")}
        </Text>

        {(isAdmin || editable || staffAccess) && !editSection && (
          <Button
            onClick={() => setEditSection("biography")}
            variant="link"
            leftIcon={<RiEdit2Line />}
          >
            {wordExtractor(page?.content?.wordings, "section_edit_label")}
          </Button>
        )}
      </HStack>
      {(identity?.biography?.blocks ?? []).map(
        ({ id, type, youtubeUrl, text, file, url, urlLabel = url }) => {
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
              }} alt="" src={file?.url} />;
              break;
              case "text":
                comp = <Text whiteSpace="pre-line" wordBreak="break-all">{text}</Text>;
                break;
              case "url":
                comp = <Link href={url} target="_blank"><Text whiteSpace="pre-line" wordBreak="break-all">{urlLabel}</Text></Link>;
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

export default IdentityBiographySectionViewer;
