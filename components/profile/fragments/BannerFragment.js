import React, { useEffect } from "react";
import {
  AspectRatio,
  Avatar,
  Button,
  Image,
  VStack,
  Box,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  IconButton,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { AiOutlinePlus, AiOutlineInfoCircle } from "react-icons/ai";
import {
  useDisclosureWithParams,
  useAppContext,
} from "../../../store/AppStore";
import { getYoutubeLink } from "../../../utils/general";
import wordExtractor from "../../../utils/wordExtractor";
import BannerMediaUploadModal from "./BannerMediaUploadModal";
import ProfilePicUploadModal from "./ProfilePicUploadModal";
import { useRouter } from "next/router";

const BannerFragment = ({
  enableBannerMedia = true,
  entity,
  page,
  save,
  profilePicPropName = "profilePic",
  editable = true,
}) => {
  const router = useRouter();
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setTimeout(() => {
        document.querySelector(`[data-tag='${hash}']`).scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
      }, 300);
    }
  }, [router]);

  const bannerMediaDisclosure = useDisclosureWithParams();
  const profilePicDisclosure = useDisclosureWithParams();
  const RenderBanner = ({ entity }) => {

    if (!entity?.bannerMedia?.videoUrl && !entity?.bannerMedia?.file?.url) {
      return (
        <AspectRatio ratio={16 / 9}>
          {editable && enableBannerMedia ? (
            <Box fontSize={12} px={2}>
              {wordExtractor(page?.content?.wordings, "banner_placeholder")}
            </Box>
          ) : (
            <Image
              alt={wordExtractor(
                page?.content?.wordings,
                "banner_media_alt_text"
              )}
              w="100%"
              src={
                page?.content?.headerSection?.bannerPlaceholder
              }
            />
          )}
        </AspectRatio>
      );
    }

    if (entity?.bannerMedia?.videoUrl) {
      return (
        <AspectRatio ratio={16 / 9}>
          <iframe
            src={getYoutubeLink(entity?.bannerMedia?.videoUrl)}
            w="100%"
          />
        </AspectRatio>
      );
    }

    return (
      <AspectRatio ratio={2.5}>
        <Image
          alt={wordExtractor(page?.content?.wordings, "banner_media_alt_text")}
          w="100%"
          src={
            entity?.bannerMedia?.file?.url ??
            page?.content?.headerSection?.bannerPlaceholder
          }
        />
      </AspectRatio>
    );
  };

  return (
    <VStack align="stretch" spacing={0} position="relative">
      {editable && enableBannerMedia && (
        <Button
          borderRadius={16}
          leftIcon={<AiOutlinePlus />}
          bgColor="white"
          boxShadow="md"
          position="absolute"
          top={4}
          right={4}
          zIndex={2}
          onClick={bannerMediaDisclosure.onOpen}
        >
          {wordExtractor(page?.content?.wordings, "add_banner_media_label")}
        </Button>
      )}
      <RenderBanner entity={entity} />
      <Box position={"relative"}>
        <Avatar
          {...(!!entity?.[profilePicPropName]?.url && { bgColor: "white" })}
          {...(editable && {
            cursor: "pointer",
            onClick: profilePicDisclosure.onOpen,
          })}
          size="xl"
          position="absolute"
          left={8}
          bottom={-12}
          borderWidth={2}
          borderColor="white"
          objectFit="contain"
          src={entity?.[profilePicPropName]?.url}
        >
          {editable && (
            <Box position={"absolute"} bottom={"-16px"} right={"-32px"}>
              <Popover trigger="hover">
                <PopoverTrigger>
                  <IconButton
                    aria-label={wordExtractor(
                      page?.content?.wordings,
                      "profile_image_placeholder"
                    )}
                    icon={<AiOutlineInfoCircle fontSize={"32px"} />}
                    variant="link"
                  ></IconButton>
                </PopoverTrigger>
                <PopoverContent fontSize="sm" bg="black" color="white">
                  <PopoverArrow bg="black" />
                  <PopoverBody>
                    {wordExtractor(
                      page?.content?.wordings,
                      "profile_image_placeholder"
                    )}
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Box>
          )}
        </Avatar>
      </Box>
      <BannerMediaUploadModal
        params={{ entity, page, save }}
        isOpen={bannerMediaDisclosure.isOpen}
        onClose={bannerMediaDisclosure.onClose}
      />
      <ProfilePicUploadModal
        params={{ entity, page, save, propName: profilePicPropName }}
        page={page}
        isOpen={profilePicDisclosure.isOpen}
        onClose={profilePicDisclosure.onClose}
      />
    </VStack>
  );
};

export default BannerFragment;
