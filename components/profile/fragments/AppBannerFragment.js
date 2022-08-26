import React, { useEffect, useState } from "react";
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
  Code
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { AiOutlinePlus, AiOutlineInfoCircle } from "react-icons/ai";
import {
  useDisclosureWithParams,
  useAppContext,
} from "../../../store/AppStore";
import { gql } from "graphql-request";
import { getYoutubeLink } from "../../../utils/general";
import wordExtractor from "../../../utils/wordExtractor";
import BannerMediaUploadModal from "./BannerMediaUploadModal";
import ProfilePicUploadModal from "./ProfilePicUploadModal";
import { useRouter } from "next/router";
import { getGraphQLClient } from "../../../utils/apollo";

const AppBannerFragment = ({
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
  const [debugResult, setDebugResult] = useState("");
  const bannerMediaDisclosure = useDisclosureWithParams();
  const profilePicDisclosure = useDisclosureWithParams();
  const RenderBanner = ({ entity }) => {
    if (!entity?.bannerMedia?.videoUrl && !entity?.bannerMedia?.file?.url) {
      return (
        <AspectRatio ratio={16 / 9}>
          {editable ? (
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

  const FileUploadmutation = gql`
    mutation FileUpload($file: FileUpload!) {
      FileUpload(files: $file) {
        id
        url
        contentType
        fileSize
      }
    }
  `;

  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const handlePickFile = (fieldName) => {
    window.WebContext = {};
    window.WebContext.pickFileHandler = async (response) => {
      const fileInfo = JSON.parse(response);
      if (!fileInfo.result) {
        setDebugResult(
          JSON.stringify(
            {
              status: "response not found",
            },
            null,
            4
          )
        );
      } else {
        let file = dataURLtoFile(
          fileInfo.result?.data[0]?.data,
          fileInfo.result?.data[0]?.name
        );
        let bannerUploadData;

        if (file) {
          bannerUploadData = await getGraphQLClient().request(
            FileUploadmutation,
            {
              file: file,
            }
          );

          const updateData = {
            ...entity,
            [fieldName]: bannerUploadData?.FileUpload?.[0]
          }

          try {
            setDebugResult(updateData)
            await save({ ...entity, [fieldName]: bannerUploadData?.FileUpload?.[0] });
          } catch (error) {
            setDebugResult(error)
            console.error(error);
          }
          
        }
      }
    };

    let json = {
      name: "pickFile",
      options: {
        callback: "pickFileHandler",
        params: {
          maxFileSize: 4194304,
          maxFileCount: 1,
          minFileCount: 1,
          mimeType: "image/*",
          supportCrop: true,
        },
      },
    };

    if (window && window.AppContext && window.AppContext.postMessage) {
      window.AppContext.postMessage(JSON.stringify(json));
    }
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
            onClick: ()=>handlePickFile('profilePic'),
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
      {/* <ProfilePicUploadModal
        params={{ entity, page, save, propName: profilePicPropName }}
        page={page}
        isOpen={profilePicDisclosure.isOpen}
        onClose={profilePicDisclosure.onClose}
      /> */}
      {debugResult && <Code fontSize={10}>{JSON.stringify(debugResult)}</Code>}
    </VStack>
  );
};

export default AppBannerFragment;
