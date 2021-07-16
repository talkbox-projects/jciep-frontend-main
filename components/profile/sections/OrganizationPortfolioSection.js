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
import { useCallback, useMemo, useState } from "react";
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
import OrganizationProfileStore from "../../../store/OrganizationProfileStore";
import { AiFillFilePdf, AiFillYoutube } from "react-icons/ai";
import PortfolioGallery from "../fragments/PortfolioGallery";

const IdentityPortfolioSection = () => {
  const {
    page,
    saveOrganization,
    organization,
    editSection,
    setEditSection,
    removeEditSection,
    isAdmin,
    editable,
  } = OrganizationProfileStore.useContext();

  const [medias, setMedias] = useState(organization?.portfolio ?? []);

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
      await saveOrganization({ id: organization?.id, portfolio: medias });
      removeEditSection();
    } catch (error) {
      console.error(error);
    }
  }, [organization, medias]);

  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        <HStack px={8} py={4} align="center">
          <Text flex={1} minW={0} w="100%" fontSize="2xl">
            {wordExtractor(page?.content?.wordings, "portfolio_header_label")}
          </Text>
          {isEditable ? (
            <Button onClick={onSave} variant="link" leftIcon={<RiEdit2Line />}>
              {wordExtractor(page?.content?.wordings, "save_button_label")}
            </Button>
          ) : (
            (isAdmin || editable) &&
            !editSection && (
              <Button
                onClick={() => setEditSection("portfolio")}
                variant="link"
                leftIcon={<RiEdit2Line />}
              >
                {wordExtractor(page?.content?.wordings, "section_edit_label")}
              </Button>
            )
          )}
        </HStack>
        <SimpleGrid px={8} py={4} columns={4} gap={3}>
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
