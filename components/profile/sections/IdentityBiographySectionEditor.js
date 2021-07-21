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
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import { RiEdit2Line } from "react-icons/ri";
import BiographyTypeSelector from "../fragments/BiographyTypeSelector";
import { AiOutlineDelete } from "react-icons/ai";
import ProfileDropzone from "../fragments/ProfileDropzone";

const IdentityBiographySectionEditor = () => {
  const { page, saveIdentity, identity, removeEditSection } =
    IdentityProfileStore.useContext();

  const {
    handleSubmit,
    control,
    register,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      id: identity.id,
      biography: identity?.biography ?? [],
    },
  });

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "biography.blocks",
  });

  return (
    <VStack
      as="form"
      onSubmit={handleSubmit(async (values) => {
        try {
          await saveIdentity(values);
          removeEditSection();
        } catch (error) {
          console.error(error);
        }
      })}
      align="stretch"
      pb={8}
    >
      <HStack px={8} py={4} align="center">
        <Text flex={1} minW={0} w="100%" fontSize="2xl" fontFamily="SFNSDisplay"  >
          {wordExtractor(page?.content?.wordings, "biography_header_label")}
        </Text>
        <VStack align="stretch">
          <HStack py={2} spacing={4} justifyContent="flex-end">
            <Button variant="link" onClick={removeEditSection}>
              {wordExtractor(page?.content?.wordings, "cancel_button_label")}
            </Button>
            <Button
              colorScheme="yellow"
              color="black"
              px={8}
              py={2}
              borderRadius="2em"
              type="submit"
              isLoading={isSubmitting}
            >
              {wordExtractor(page?.content?.wordings, "save_button_label")}
            </Button>
          </HStack>
        </VStack>
      </HStack>
      <VStack px={8} align="stretch">
        {(fields ?? []).map(({ id, type, youtubeUrl, text, file }, index) => {
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
                    {errors?.biography?.blocks?.[index]?.youtubeUrl?.message}
                  </FormHelperText>
                </FormControl>
              );
              break;
            case "image":
              comp = (
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
                    {errors?.biography?.blocks?.[index]?.youtubeUrl?.message}
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
              <VStack spacing={0.5} align="stretch" flex={1} minW={0} w="100%">
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
                  onArrayAppend={(defaultValue) => insert(index, defaultValue)}
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
      <HStack px={8} justifyContent="flex-end">
        <BiographyTypeSelector
          labelVisible={true}
          page={page}
          onArrayAppend={(defaultValue) => {
            append(defaultValue);
          }}
        />
      </HStack>
    </VStack>
  );
};

export default IdentityBiographySectionEditor;
