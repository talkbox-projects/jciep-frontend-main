import React, { useCallback, useEffect, useState } from "react";
import {
  AspectRatio,
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  VStack,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import wordExtractor from "../../../utils/wordExtractor";
import ProfileDropzone from "./ProfileDropzone";
import Cropper from "react-easy-crop";
import getCroppedImg, { blobToBase64, uuidv4 } from "../../../utils/general";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../../../utils/apollo";

const ProfilePicUploadModal = ({
  params: { entity, page, save, propName = "profilePic" },
  isOpen,
  onClose,
}) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      id: entity?.id,
      bannerMedia: entity?.bannerMedia,
    },
  });

  const [droppedImage, setDroppedImage] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onUploadCroppedImage = useCallback(async () => {
    try {
      const croppedImageBlobUrl = await getCroppedImg(
        droppedImage,
        croppedAreaPixels
      );
      const croppedImageBlob = await fetch(croppedImageBlobUrl).then((r) =>
        r.blob()
      );
      const croppedImageFile = new File([croppedImageBlob], `${uuidv4()}.png`, {
        type: "image/png",
      });

      const mutation = gql`
        mutation FileUpload($files: FileUpload!) {
          FileUpload(files: $files) {
            id
            url
            contentType
            fileSize
          }
        }
      `;
      const variables = {
        files: [croppedImageFile],
      };

      const data = await getGraphQLClient().request(mutation, variables);

      return data?.FileUpload?.[0];
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, droppedImage]);

  useEffect(() => {
    if (isOpen) {
      setDroppedImage(false);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Modal size="lg" {...{ isOpen, onClose }}>
      <ModalOverlay />
      <ModalContent
        as="form"
        onSubmit={handleSubmit(async (values) => {
          try {
            const croppedImage = await onUploadCroppedImage();
            await save({ ...values, [propName]: croppedImage });
            onClose();
          } catch (error) {
            console.error(error);
          }
        })}
      >
        <ModalHeader
          borderBottomWidth={1}
          fontWeight="normal"
          textAlign="center"
          color="black"
          fontSize="md"
        >
          <ModalCloseButton left={4} top={3} />
          {wordExtractor(
            page?.content?.wordings,
            "banner_media_upload_modal_title"
          )}
        </ModalHeader>
        <ModalBody as={VStack}>
          <Box w={240}>
            <Controller
              control={control}
              name={propName}
              defaultValue={entity?.[propName]}
              render={({ field: { value } }) => {
                return droppedImage ? (
                  <Box>
                    <AspectRatio ratio={1}>
                      <Cropper
                        image={droppedImage}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        maxZoom={5}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                      />
                    </AspectRatio>
                    <Slider
                      my={8}
                      aria-label="zoom-level"
                      value={zoom}
                      onChange={setZoom}
                      step={0.1}
                      min={1}
                      max={5}
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </Box>
                ) : (
                  <AspectRatio ratio={1}>
                    <ProfileDropzone
                      value={value}
                      onChange={async (files) => {
                        const base64 = await blobToBase64(files[0]);
                        setDroppedImage(`data:image/png;base64, ${base64}`);
                      }}
                      page={page}
                      isUpload={false}
                    />
                  </AspectRatio>
                );
              }}
            />
          </Box>
          <Button
            alignSelf="center"
            minW={24}
            mt={6}
            colorScheme="yellow"
            color="black"
            px={4}
            py={2}
            borderRadius="2em"
            type="submit"
            isLoading={isSubmitting}
          >
            {wordExtractor(page?.content?.wordings, "save_button_label")}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProfilePicUploadModal;
