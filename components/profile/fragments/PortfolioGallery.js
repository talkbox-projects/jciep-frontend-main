import React from "react";
import {
  AspectRatio,
  chakra,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { getYoutubeLink } from "../../../utils/general";
import { useRouter } from "next/router";

const Iframe = chakra("iframe");

const PortfolioGallery = ({ isOpen, onClose, params }) => {

  const router = useRouter();

  const getVideoComponent = useCallback((item) => {
    const youtubeLink = getYoutubeLink(item?.videoUrl);
    return (
      <VStack align="stretch">
        <AspectRatio ratio={5 / 3}>
          <iframe src={youtubeLink} allowFullScreen />
        </AspectRatio>
        <Text whiteSpace="pre" color="gray.500" fontSize="sm">
          {item?.description}
        </Text>
      </VStack>
    );
  }, []);

  const getImageComponent = useCallback((item) => {
    return (
      <VStack align="stretch">
        <Image alt={item?.description ? item?.description : "相片集圖片"} src={item?.file?.url} allowFullScreen />
        <Text whiteSpace="pre" color="gray.500" fontSize="sm">
          {item?.description}
        </Text>
      </VStack>
    );
  }, []);

  const getPdfComponent = useCallback((item) => {
    return (
      <VStack align="stretch">
        <Iframe h="90vh" src={item?.file?.url} />
        <Text whiteSpace="pre" color="gray.500" fontSize="sm">
          {item?.description}
        </Text>
      </VStack>
    );
  }, []);

  const getComponent = useCallback((item) => {
    if (item?.videoUrl) {
      return getVideoComponent(item);
    } else if (item?.file?.contentType?.indexOf("image") >= 0) {
      return getImageComponent(item);
    } else if (item?.file?.contentType?.indexOf("pdf") >= 0) {
      return getPdfComponent(item);
    } else {
      return <></>;
    }
  }, [getImageComponent, getPdfComponent, getVideoComponent]);

  return (
    <Modal size="3xl" onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {params?.item?.title ?? " "}
          <ModalCloseButton aria-label={router.locale === "en" ? "Close" : "關閉"} />
        </ModalHeader>
        <ModalBody>{getComponent(params?.item)}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PortfolioGallery;
