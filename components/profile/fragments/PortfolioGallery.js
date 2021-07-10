import {
  AspectRatio,
  chakra,
  IconButton,
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

const Iframe = chakra("iframe");

const PortfolioGallery = ({ isOpen, onClose, params }) => {
  const getVideoComponent = useCallback((item) => {
    const match = (item?.videoUrl ?? "").match(
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    );
    const youtubeId = match && match[7].length == 11 ? match[7] : null;
    return (
      <VStack align="stretch">
        <AspectRatio ratio={5 / 3}>
          <iframe
            src={`https://youtube.com/embed/${youtubeId}`}
            allowFullScreen
          />
        </AspectRatio>
        <Text color="gray.500" fontSize="sm">
          {item?.description}
        </Text>
      </VStack>
    );
  }, []);

  const getImageComponent = useCallback((item) => {
    return (
      <VStack align="stretch">
        <Image src={item?.file?.url} allowFullScreen />
        <Text color="gray.500" fontSize="sm">
          {item?.description}
        </Text>
      </VStack>
    );
  }, []);

  const getPdfComponent = useCallback((item) => {
    return (
      <VStack align="stretch">
        <Iframe h="90vh" src={item?.file?.url} />
        <Text color="gray.500" fontSize="sm">
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
  }, []);

  return (
    <Modal size="3xl" onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {params?.item?.title ?? ""}
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>{getComponent(params?.item)}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PortfolioGallery;
