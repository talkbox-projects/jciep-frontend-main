import {
  AspectRatio,
  Text,
  Avatar,
  Box,
  Button,
  chakra,
  Image,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
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
      {entity?.bannerMedia?.videoUrl ? (
        <AspectRatio ratio={16 / 9}>
          <iframe
            src={getYoutubeLink(entity?.bannerMedia?.videoUrl)}
            w="100%"
          />
        </AspectRatio>
      ) : (
        <AspectRatio ratio={2.5}>
          <Image
            w="100%"
            src={
              entity?.bannerMedia?.file?.url ??
              page?.content?.headerSection?.bannerPlaceholder
            }
          ></Image>
        </AspectRatio>
      )}
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
      ></Avatar>
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
