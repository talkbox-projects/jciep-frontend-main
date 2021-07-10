import {
  AspectRatio,
  Avatar,
  Box,
  Button,
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

const BannerFragment = () => {
  const { identity, page, enums, editable } = ProfileStore.useContext();
  const bannerMediaDisclosure = useDisclosure();
  const profilePicDisclosure = useDisclosure();
  const onUpload = useCallback(({ bannerMedia }) => {
    try {
      // TODO: upload image
    } catch (error) {
      console.error(error);
    }
  }, []);

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
        <Image
          w="100%"
          src={
            identity?.bannerMedia?.url ??
            page?.content?.headerSection?.bannerPlaceholder
          }
        ></Image>
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
