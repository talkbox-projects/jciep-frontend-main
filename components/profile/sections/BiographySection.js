import { useFieldArray, useForm } from "react-hook-form";
import {
  Textarea,
  Input,
  Text,
  Button,
  HStack,
  VStack,
  Box,
  Icon,
  FormControl,
  IconButton,
  FormHelperText,
  AspectRatio,
} from "@chakra-ui/react";
import Dropzone from "react-dropzone";
import wordExtractor from "../../../utils/wordExtractor";
import SectionCard from "../fragments/SectionCard";
import { RiAddFill, RiEdit2Line } from "react-icons/ri";
import {
  useAppContext,
  useDisclosureWithParams,
} from "../../../store/AppStore";
import { useCallback, useEffect } from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  AiOutlineCloudUpload,
  AiOutlineDelete,
  AiOutlineInsertRowAbove,
} from "react-icons/ai";
import BiographyTypeSelector from "../fragments/BiographyTypeSelector";
import ProfileDropzone from "../fragments/ProfileDropzone";

const BiographySection = ({ identity, page, enums, editable }) => {
  const editModelDisclosure = useDisclosureWithParams();
  const { updateIdentity } = useAppContext();

  const form = useForm({ defaultValues: identity });
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = form;

  useEffect(() => {
    console.log(identity);
    if (!editModelDisclosure.isOpen) {
      reset(identity);
    }
  }, [editModelDisclosure.isOpen, reset, identity]);

  const {
    fields = [],
    append,
    insert,
    remove,
  } = useFieldArray({
    control,
    name: "biography.blocks",
  });

  const onSubmit = useCallback((values) => {
    alert("updated");

    console.log("biography", values);
    updateIdentity(values?.id, values);
    editModelDisclosure.onClose();
  }, []);

  return (
    <SectionCard>
      <VStack as="form" spacing={1} align="stretch">
        <HStack px={8} py={4} align="center">
          <Text flex={1} minW={0} w="100%" fontSize="2xl">
            {wordExtractor(page?.content?.wordings, "biography_header_label")}
          </Text>
          {editModelDisclosure.isOpen ? (
            <Button
              variant="link"
              leftIcon={<RiEdit2Line />}
              onClick={handleSubmit(onSubmit)}
            >
              {wordExtractor(page?.content?.wordings, "save_button_label")}
            </Button>
          ) : (
            <Button
              onClick={editModelDisclosure.onOpen}
              variant="link"
              leftIcon={<RiEdit2Line />}
            >
              {wordExtractor(page?.content?.wordings, "section_edit_label")}
            </Button>
          )}
        </HStack>

        {editModelDisclosure.isOpen ? (
          <VStack p={8} align="stretch">
            <VStack align="stretch">
              {(fields ?? []).map(({ id, type, youtubeUrl, text }, index) => {
                let comp = null;
                const prefix = `biography.blocks[${index}]`;
                switch (type) {
                  case "youtube":
                    comp = (
                      <FormControl>
                        <Input
                          placeholder={wordExtractor(
                            page?.content?.wordings,
                            "field_placeholder_biography_youtube_link"
                          )}
                          {...register(`${prefix}.youtubeUrl`, {
                            required: wordExtractor(
                              page?.content?.wordings,
                              "invalid_youtube_link_message"
                            ),
                            pattern: {
                              value:
                                /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
                              message: wordExtractor(
                                page?.content?.wordings,
                                "invalid_youtube_link_message"
                              ),
                            },
                          })}
                          defaultValue={youtubeUrl ?? ""}
                        />
                        <FormHelperText color="red">
                          {
                            errors?.biography?.blocks?.[index]?.youtubeUrl
                              ?.message
                          }
                        </FormHelperText>
                      </FormControl>
                    );
                    break;
                  case "image":
                    comp = (
                      <FormControl>
                        <ProfileDropzone page={page} />
                        <FormHelperText color="red">
                          {
                            errors?.biography?.blocks?.[index]?.youtubeUrl
                              ?.message
                          }
                        </FormHelperText>
                      </FormControl>
                    );
                    break;
                  case "text":
                    comp = (
                      <FormControl>
                        <Textarea
                          rows={5}
                          resize="none"
                          {...register(`${prefix}.text`, {
                            required: wordExtractor(
                              page?.content?.wordings,
                              "empty_text_label"
                            ),
                          })}
                          defaultValue={text ?? ""}
                        />
                        <FormHelperText color="red">
                          {errors?.biography?.blocks?.[index]?.text?.message}
                        </FormHelperText>
                      </FormControl>
                    );
                    break;
                  default:
                }
                return (
                  <HStack pb={8} key={id} align="start">
                    <VStack
                      spacing={0.5}
                      align="stretch"
                      flex={1}
                      minW={0}
                      w="100%"
                    >
                      <Text fontSize="sm" color="#666">
                        {wordExtractor(
                          page?.content?.wordings,
                          "button_label_biography_" + type
                        )}
                      </Text>
                      <Input
                        type="hidden"
                        {...register(`${prefix}.type`, {})}
                        defaultValue={type}
                      />
                      {comp}
                    </VStack>
                    <VStack spacing={0}>
                      <BiographyTypeSelector
                        labelVisible={false}
                        page={page}
                        onArrayAppend={(defaultValue) =>
                          insert(index, defaultValue)
                        }
                      />
                      <IconButton
                        size="sm"
                        p={1}
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => remove(index)}
                        icon={<AiOutlineDelete />}
                      ></IconButton>
                    </VStack>
                  </HStack>
                );
              })}
            </VStack>
            <HStack justifyContent="flex-end">
              <BiographyTypeSelector
                labelVisible={true}
                page={page}
                onArrayAppend={(defaultValue) => append(defaultValue)}
              />
            </HStack>
          </VStack>
        ) : (
          <VStack px={8} pb={8} align="stretch">
            {(fields ?? []).map(({ id, type, youtubeUrl, text }, index) => {
              let comp = null;
              const prefix = `biography.blocks[${index}]`;
              switch (type) {
                case "youtube":
                  const match = (youtubeUrl ?? "").match(
                    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
                  );
                  const youtubeId =
                    match && match[7].length == 11 ? match[7] : null;
                  comp = (
                    <AspectRatio w="100%" ratio={16 / 9}>
                      <iframe
                        src={`https://youtube.com/embed/${youtubeId}`}
                        allowFullScreen
                      />
                    </AspectRatio>
                  );
                  break;
                case "image":
                  comp = (
                    <FormControl>
                      <ProfileDropzone page={page} />
                      <FormHelperText color="red">
                        {
                          errors?.biography?.blocks?.[index]?.youtubeUrl
                            ?.message
                        }
                      </FormHelperText>
                    </FormControl>
                  );
                  break;
                case "text":
                  comp = <Text whiteSpace="pre-line">{text}</Text>;
                  break;
                default:
              }
              return (
                <HStack key={id} align="start">
                  <Input
                    type="hidden"
                    {...register(`${prefix}.type`, {})}
                    defaultValue={type}
                  />
                  {comp}
                </HStack>
              );
            })}
          </VStack>
        )}
      </VStack>
    </SectionCard>
  );
};

export default BiographySection;
