import React, { useEffect } from "react";
import {
  Text,
  Button,
  FormControl,
  HStack,
  VStack,
  Input,
  FormHelperText,
  IconButton,
  AspectRatio,
  Textarea,
} from "@chakra-ui/react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import wordExtractor from "../../../utils/wordExtractor";
import { RiEdit2Line } from "react-icons/ri";
import EventBiographyTypeSelector from "../fragments/EventBiographyTypeSelector";
import { AiOutlineDelete } from "react-icons/ai";
import ProfileDropzone from "../fragments/ProfileDropzone";
import { youtubeRegex } from "../../../utils/general";

const EventBiographySectionEditor = ({ page, handleSetValue }) => {
  const {
    control,
    register,
    formState: { errors },
    watch,
  } = useForm();

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "event.blocks",
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
        handleSetValue("additionalInformation", value.event?.blocks)
    }
    );
    return () => subscription.unsubscribe();
  }, [watch, handleSetValue]);

  return (
    <VStack as="form" align="stretch" pb={8}>
      <HStack align="center">
        <Text flex={1} minW={0} w="100%" fontSize="20px" fontWeight={700}>
          {wordExtractor(page?.content?.wordings, "more_information_label")}
        </Text>
        <HStack px={8} justifyContent="flex-end">
          <EventBiographyTypeSelector
            labelVisible={true}
            page={page}
            onArrayAppend={(defaultValue) => {
              append(defaultValue);
            }}
          />
        </HStack>
      </HStack>

      <VStack px={8} align="stretch">
        {(fields ?? []).map(
          ({ id, type, youtubeUrl, file, imageLabel }, index) => {
            let comp = null;
            const prefix = `event.blocks[${index}]`;
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
                          value: youtubeRegex,
                          message: wordExtractor(
                            page?.content?.wordings,
                            "invalid_youtube_link_message"
                          ),
                        },
                      })}
                      defaultValue={youtubeUrl ?? ""}
                    />
                    <FormHelperText color="red">
                      {errors?.biography?.blocks?.[index]?.youtubeUrl?.message}
                    </FormHelperText>
                  </FormControl>
                );
                break;
              case "image":
                comp = (
                  <>
                    <FormControl>
                      <Controller
                        control={control}
                        name={`${prefix}.file`}
                        defaultValue={file}
                        render={({ field: { value, onChange } }) => {
                          return (
                            <AspectRatio ratio={2.5}>
                              <ProfileDropzone
                                value={value}
                                onChange={onChange}
                                page={page}
                              />
                            </AspectRatio>
                          );
                        }}
                      />
                      <FormHelperText color="red">
                        {errors?.event?.blocks?.[index]?.youtubeUrl?.message}
                      </FormHelperText>
                    </FormControl>
                    {/* <FormControl>
                      <Input
                        placeholder="描述 Label"
                        {...register(`${prefix}.imageLabel`, {
                          required: wordExtractor(
                            page?.content?.wordings,
                            "empty_text_label"
                          ),
                        })}
                        defaultValue={imageLabel ?? ""}
                      />
                      <FormHelperText color="red">
                        {errors?.event?.blocks?.[index]?.imageLabel?.message}
                      </FormHelperText>
                    </FormControl> */}
                  </>
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
                  <EventBiographyTypeSelector
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
          }
        )}
      </VStack>
    </VStack>
  );
};

export default EventBiographySectionEditor;
