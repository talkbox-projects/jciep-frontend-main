import {
  Textarea,
  Box,
  HStack,
  Input,
  VStack,
  FormControl,
  FormLabel,
  FormHelperText,
  Button,
} from "@chakra-ui/react";
import moment from "moment";
import { useFieldArray } from "react-hook-form";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import wordExtractor from "../../../utils/wordExtractor";
import Dot from "./Dot";

const ActivitySubSectionEditor = ({ form: { register, control } }) => {
  const { page } = IdentityProfileStore.useContext();
  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "activity",
  });
  return (
    <VStack spacing={4} width={"100%"} align="stretch">
      <VStack pl={2} spacing={0} align="stretch">
        {(fields ?? []).map(
          ({ id, name, description, startDatetime }, index) => {
            const errors = {} 
            errors?.activity?.[index];
            const prefix = `activity[${index}]`;
            const borderColor = "#eee";
            console.log(startDatetime);
            return (
              <Box
                pl={2}
                key={id}
                borderLeftColor={borderColor}
                borderLeftWidth={2}
                position="relative"
              >
                <Dot
                  position="absolute"
                  top={"-5px"}
                  left={"-5px"}
                  h={"8px"}
                  w={"8px"}
                  bgColor={borderColor}
                />
                <VStack
                  pl={2}
                  mt={-3}
                  mb={12}
                  spacing={0.5}
                  fontSize={["lg", "sm"]}
                  spacing={0}
                  align="start"
                >
                  <HStack alignSelf="flex-end" pt={2}>
                    <Button
                      onClick={() => insert(index, {})}
                      colorScheme="yellow"
                      size="sm"
                      variant="ghost"
                      leftIcon={<AiOutlinePlus />}
                    >
                      {wordExtractor(
                        page?.content?.wordings,
                        "button_label_insert"
                      )}
                    </Button>
                    <Button
                      onClick={() => remove(index)}
                      colorScheme="red"
                      size="sm"
                      variant="ghost"
                      leftIcon={<AiOutlineDelete />}
                    >
                      {wordExtractor(
                        page?.content?.wordings,
                        "button_label_remove"
                      )}
                    </Button>
                  </HStack>
                  <FormControl
                    as={HStack}
                    align="center"
                    isInvalid={errors?.name}
                  >
                    <FormLabel w={24} fontSize="sm" color="#999" mb={0}>
                      {wordExtractor(
                        page?.content?.wordings,
                        "field_label_activity_name"
                      )}
                    </FormLabel>
                    <Input
                      variant="flushed"
                      {...register(`${prefix}.name`, {})}
                      defaultValue={name}
                    />
                    <FormHelperText>{errors?.name?.message}</FormHelperText>
                  </FormControl>
                  <FormControl
                    as={HStack}
                    align="start"
                    isInvalid={errors?.activity?.[index]?.description}
                  >
                    <FormLabel mt={2} w={24} fontSize="sm" color="#999" mb={0}>
                      {wordExtractor(
                        page?.content?.wordings,
                        "field_label_activity_description"
                      )}
                    </FormLabel>
                    <Textarea
                      resize="none"
                      rows={5}
                      variant="flushed"
                      {...register(`${prefix}.description`, {})}
                      defaultValue={description}
                    />
                    <FormHelperText>
                      {errors?.activity?.[index]?.description?.message}
                    </FormHelperText>
                  </FormControl>
                  <FormControl
                    as={HStack}
                    align="center"
                    isInvalid={errors?.startDatetime?.message}
                  >
                    <FormLabel w={24} fontSize="sm" color="#999" mb={0}>
                      {wordExtractor(
                        page?.content?.wordings,
                        "field_label_activity_startDatetime"
                      )}
                    </FormLabel>
                    <Input
                      variant="flushed"
                      type="date"
                      defaultValue={moment(startDatetime).format("YYYY-MM-DD")}
                      {...register(`${prefix}.startDatetime`, {})}
                    ></Input>
                    <FormHelperText color="red">
                      {errors?.startDatetime?.message}
                    </FormHelperText>
                  </FormControl>
                </VStack>
              </Box>
            );
          }
        )}
        {
          <Box pl={2} borderLeftColor={"#eee"} borderLeftWidth={2}>
            <Button
              my={4}
              px={2}
              size="sm"
              alignSelf="flex-start"
              variant="outline"
              onClick={() => append({})}
              leftIcon={<AiOutlinePlus />}
            >
              {wordExtractor(page?.content?.wordings, "button_label_append")}
            </Button>
          </Box>
        }
      </VStack>
    </VStack>
  );
};

export default ActivitySubSectionEditor;
