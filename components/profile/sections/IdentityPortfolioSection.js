import {
  Text,
  Button,
  HStack,
  VStack,
  AspectRatio,
  Box,
  Icon,
  SimpleGrid,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  RiAddFill,
  RiCloseCircleFill,
  RiEdit2Line,
  RiFilePdfLine,
} from "react-icons/ri";
import { useDisclosureWithParams } from "../../../store/AppStore";
import wordExtractor from "../../../utils/wordExtractor";
import PortfolioMediaUploadModal from "../fragments/PortfolioMediaUploadModal";
import SectionCard from "../fragments/SectionCard";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import { AiFillFilePdf, AiFillYoutube } from "react-icons/ai";
import PortfolioGallery from "../fragments/PortfolioGallery";

const IdentityPortfolioSection = () => {
  const {
    page,
    saveIdentity,
    identity,
    isAdmin,
    editSection,
    setEditSection,
    removeEditSection,
    editable,
  } = IdentityProfileStore.useContext();

  const [medias, setMedias] = useState(identity?.portfolio ?? []);
  useEffect(() => {
    setMedias(identity?.portfolio ?? []);
  }, [identity?.portfolio]);

  const portfolioMediaDisclosure = useDisclosureWithParams();
  const galleryDisclosure = useDisclosureWithParams();

  const isEditable = useMemo(() => editSection === "portfolio", [editSection]);

  const onItemRemove = useCallback(
    (index) => {
      setMedias((medias) => {
        const newMedias = [...medias];
        newMedias.splice(index, 1);
        return newMedias;
      });
    },
    [setMedias]
  );

  const onPortfolioItemClick = useCallback(
    (index) => {
      if (isEditable) {
        portfolioMediaDisclosure.onOpen({
          index,
          item: medias[index],
          onSubmit: (item) =>
            setMedias((_) => {
              const newMedias = [..._];
              newMedias.splice(index, 1, item);
              portfolioMediaDisclosure.onClose();
              return newMedias;
            }),
        });
      } else {
        galleryDisclosure.onOpen({
          item: medias[index],
        });
      }
    },
    [medias, galleryDisclosure, portfolioMediaDisclosure, isEditable]
  );

  const onSave = useCallback(async () => {
    try {
      await saveIdentity({ id: identity?.id, portfolio: medias });
      removeEditSection();
    } catch (error) {
      console.error(error);
    }
  }, [identity, medias]);

  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        <HStack w="100%" px={8} py={4} align="center">
          <Text flex={1} minW={0} w="100%" fontSize="2xl" fontFamily="SFNSDisplay" >
            {wordExtractor(page?.content?.wordings, "portfolio_header_label")}
          </Text>
          {isEditable ? (
            <VStack align="stretch">
              <HStack py={2} spacing={4} justifyContent="flex-end">
                <Button variant="link" onClick={removeEditSection}>
                  {wordExtractor(
                    page?.content?.wordings,
                    "cancel_button_label"
                  )}
                </Button>
                <Button
                  colorScheme="yellow"
                  color="black"
                  px={8}
                  py={2}
                  borderRadius="2em"
                  onClick={onSave}
                >
                  {wordExtractor(page?.content?.wordings, "save_button_label")}
                </Button>
              </HStack>
            </VStack>
          ) : (
            (isAdmin || editable) &&
            !editSection && (
              <Button
                w="fit-content"
                onClick={() => setEditSection("portfolio")}
                variant="link"
                leftIcon={<RiEdit2Line />}
              >
                {wordExtractor(page?.content?.wordings, "section_edit_label")}
              </Button>
            )
          )}
        </HStack>
        <SimpleGrid px={8} py={4} columns={[2, 2, 2, 4]} gap={3}>
          {(medias ?? []).map((media, index) => {
            let type = null;

            if (media?.videoUrl) {
              type = "video";
            } else if (media?.file) {
              if ((media?.file?.contentType ?? "").indexOf("image") >= 0) {
                type = "image";
              } else {
                type = "pdf";
              }
            }

            let comp = null;
            switch (type) {
              case "video":
                comp = (
                  <VStack spacing={0} fontSize="sm" color="#ddd">
                    <Icon as={AiFillYoutube} fontSize="4xl" />
                    <Text>Youtube</Text>
                  </VStack>
                );
                break;
              case "image":
                comp = (
                  <Box
                    w="100%"
                    h="100%"
                    bgImg={`url('${media?.file?.url}')`}
                    bgPos="center"
                    bgSize="cover"
                  />
                );
                break;
              case "pdf":
                comp = (
                  <VStack spacing={0} fontSize="sm" color="#ddd">
                    <Icon fontSize="4xl" as={AiFillFilePdf} />
                    <Text>PDF</Text>
                  </VStack>
                );
                break;
            }

            return (
              <AspectRatio ratio={1}>
                <Box
                  onClick={() => onPortfolioItemClick(index)}
                  cursor="pointer"
                  borderRadius={8}
                  boxShadow="sm"
                  position="relative"
                >
                  {isEditable && (
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemRemove(index);
                      }}
                      minW="auto"
                      p={1}
                      m={0}
                      position="absolute"
                      right={0}
                      top={0}
                      fontSize="lg"
                      color="gray.300"
                      icon={<RiCloseCircleFill />}
                      variant="link"
                    />
                  )}
                  {comp}
                </Box>
              </AspectRatio>
            );
          })}
          {isEditable && (
            <AspectRatio ratio={1}>
              <VStack
                onClick={() => onPortfolioItemClick(medias?.length)}
                boxShadow="sm"
                cursor="pointer"
              >
                <IconButton
                  fontSize="4xl"
                  icon={<RiAddFill />}
                  variant="link"
                />
                <Text>
                  {wordExtractor(page?.content?.wordings, "add_media_label")}
                </Text>
              </VStack>
            </AspectRatio>
          )}
        </SimpleGrid>
      </VStack>
      <PortfolioMediaUploadModal
        params={portfolioMediaDisclosure.params}
        page={page}
        isOpen={portfolioMediaDisclosure.isOpen}
        onClose={portfolioMediaDisclosure.onClose}
      />
      <PortfolioGallery
        params={galleryDisclosure.params}
        page={page}
        isOpen={galleryDisclosure.isOpen}
        onClose={galleryDisclosure.onClose}
      />
    </SectionCard>
  );
};

export default IdentityPortfolioSection;
