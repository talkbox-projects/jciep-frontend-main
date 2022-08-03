import React from "react";
import {
  AspectRatio,
  Avatar,
  Button,
  Image,
  VStack,
  Box,
  Tooltip
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { AiOutlinePlus } from "react-icons/ai";
import { useDisclosureWithParams } from "../../../store/AppStore";
import { getYoutubeLink } from "../../../utils/general";
import wordExtractor from "../../../utils/wordExtractor";
import BannerMediaUploadModal from "./BannerMediaUploadModal";
import ProfilePicUploadModal from "./ProfilePicUploadModal";

const BannerFragment = ({
  enableBannerMedia = true,
  entity,
  page,
  save,
  profilePicPropName = "profilePic",
  editable = true,
}) => {
  const bannerMediaDisclosure = useDisclosureWithParams();
  const profilePicDisclosure = useDisclosureWithParams();
  const RenderBanner = (entity) => {
    if (!entity?.bannerMedia?.videoUrl && !entity?.bannerMedia?.file?.url) {
      return (
        <AspectRatio ratio={16 / 9}>
          <Box fontSize={12} px={2}>
            {/* 可擺放相片或插入YouTube擺放自己的作品或與個人興趣、成就相關的相片/影片，注意每張相片不能大於4MB */}
            {wordExtractor(page?.content?.wordings, "banner_placeholder")}
          </Box>
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
      <RenderBanner />
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
          <Box position={"absolute"} top={0} right={0} fontSize={12}>
            <Tooltip label="建議使用較為端莊的相片，注意每張相片不能大於4MB" aria-label='建議使用較為端莊的相片，注意每張相片不能大於4MB'>
            <InfoOutlineIcon />
            </Tooltip>
          </Box>
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
