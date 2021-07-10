import {
  AspectRatio,
  Avatar,
  Box,
  Button,
  chakra,
  HStack,
  Image,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { AiOutlinePlus } from "react-icons/ai";
import ProfileStore from "../../../store/ProfileStore";
import wordExtractor from "../../../utils/wordExtractor";
import BannerMediaUploadModal from "./BannerMediaUploadModal";
import ProfilePicUploadModal from "./ProfilePicUploadModal";

const Iframe = chakra("frame");
const BannerFragment = () => {
  const { identity, page } = ProfileStore.useContext();
  const bannerMediaDisclosure = useDisclosure();
  const profilePicDisclosure = useDisclosure();

  return (
    <VStack align="stretch" spacing={0} position="relative">
      <Box>
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
      </Box>
      <AspectRatio ratio={2.5}>
        {identity?.bannerMedia?.videoUrl ? (
          <Iframe src={identity?.bannerMedia?.videoUrl} w="100%" />
        ) : (
          <Image
            w="100%"
            src={
              identity?.bannerMedia?.file?.url ??
              page?.content?.headerSection?.bannerPlaceholder
            }
          ></Image>
        )}
      </AspectRatio>
      <Avatar
        cursor="pointer"
        onClick={profilePicDisclosure.onOpen}
        size="xl"
        position="absolute"
        left={8}
        bottom={-12}
        borderWidth={2}
        borderColor="white"
        src={identity?.profilePic?.url}
      ></Avatar>
      <BannerMediaUploadModal
        page={page}
        isOpen={bannerMediaDisclosure.isOpen}
        onClose={bannerMediaDisclosure.onClose}
      />
      <ProfilePicUploadModal
        page={page}
        isOpen={profilePicDisclosure.isOpen}
        onClose={profilePicDisclosure.onClose}
      />
    </VStack>
  );
};

export default BannerFragment;
