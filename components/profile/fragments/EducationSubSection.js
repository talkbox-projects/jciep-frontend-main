import {
  Text,
  Box,
  HStack,
  Input,
  Select,
  Checkbox,
  VStack,
  FormControl,
  FormLabel,
  FormHelperText,
  Wrap,
  Button,
} from "@chakra-ui/react";
import moment from "moment";
import { useRouter } from "next/router";
import { Controller, useFieldArray } from "react-hook-form";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import wordExtractor from "../../../utils/wordExtractor";
import Dot from "./Dot";
import MonthPicker from "./MonthPicker";

const EducationSubSection = ({
  form: { register, control },
  identity,
  page,
  enums,
  editModelDisclosure,
}) => {
  const router = useRouter();
  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "education",
  });

  if (editModelDisclosure.isOpen) {
    return (
      <VStack
        spacing={4}
        width={editModelDisclosure.isOpen ? "100%" : ["100%", "50%"]}
        align="stretch"
      >
        <Text fontSize={["lg", "md"]}>
          {wordExtractor(page?.content?.wordings, "subsection_label_education")}
        </Text>
        <VStack pl={2} spacing={0} align="stretch">
          {(fields ?? []).map(
            (
              {
                id,
                fieldOfStudy,
                school,
                degree,
                present,
                startDatetime,
                endDatetime,
              },
              index
            ) => {
              const errors = errors?.education?.[index];
              const prefix = `education[${index}]`;
              const borderColor = present ? "#00BFBA" : "#eee";
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
                        onClick={() => insert(index)}
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
                      isInvalid={errors?.school}
                    >
                      <FormLabel w={24} fontSize="sm" color="#999" mb={0}>
                        {wordExtractor(
                          page?.content?.wordings,
                          "field_label_school"
                        )}
                      </FormLabel>
                      <Input
                        variant="flushed"
                        {...register(`${prefix}.school`, {})}
                        defaultValue={school}
                      />
                      <FormHelperText>{errors?.school?.message}</FormHelperText>
                    </FormControl>
                    <FormControl
                      as={HStack}
                      align="center"
                      isInvalid={errors?.degree?.message}
                    >
                      <FormLabel w={24} fontSize="sm" color="#999" mb={0}>
                        {wordExtractor(
                          page?.content?.wordings,
                          "field_label_degree"
                        )}
                      </FormLabel>
                      <Select
                        variant="flushed"
                        {...register(`${prefix}.degree`, {})}
                        defaultValue={degree}
                      >
                        <option key={"unselected"} value={""}>
                          {wordExtractor(
                            page?.content?.wordings,
                            "empty_text_label"
                          )}
                        </option>
                        {(enums?.EnumDegreeList ?? []).map(
                          ({
                            key: value,
                            value: { [router.locale]: label } = {},
                          }) => {
                            return (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            );
                          }
                        )}
                      </Select>
                      <FormHelperText color="red">
                        {errors?.degree?.message}
                      </FormHelperText>
                    </FormControl>
                    <FormControl
                      as={HStack}
                      align="center"
                      isInvalid={errors?.education?.[index]?.fieldOfStudy}
                    >
                      <FormLabel w={24} fontSize="sm" color="#999" mb={0}>
                        {wordExtractor(
                          page?.content?.wordings,
                          "field_label_fieldOfStudy"
                        )}
                      </FormLabel>
                      <Input
                        variant="flushed"
                        {...register("fieldOfStudy", {})}
                        defaultValue={fieldOfStudy}
                      />
                      <FormHelperText>
                        {errors?.education?.[index]?.fieldOfStudy?.message}
                      </FormHelperText>
                    </FormControl>
                    <HStack pt={2} w="100%" spacing={2}>
                      <FormControl
                        w="50%"
                        as={HStack}
                        align="center"
                        isInvalid={errors?.degree?.message}
                      >
                        <FormLabel w={32} fontSize="sm" color="#999" mb={0}>
                          {wordExtractor(
                            page?.content?.wordings,
                            "field_label_education_startDatetime"
                          )}
                        </FormLabel>
                        <Controller
                          name={`${prefix}.startDatetime`}
                          control={control}
                          defaultValue={startDatetime}
                          render={({ field }) => (
                            <MonthPicker page={page} {...field} />
                          )}
                        />
                        <FormHelperText color="red">
                          {errors?.startDatetime?.message}
                        </FormHelperText>
                      </FormControl>
                      <FormControl
                        w="50%"
                        as={HStack}
                        align="center"
                        isInvalid={errors?.endDatetime?.message}
                      >
                        <FormLabel w={24} fontSize="sm" color="#999" mb={0}>
                          {wordExtractor(
                            page?.content?.wordings,
                            "field_label_education_endDatetime"
                          )}
                        </FormLabel>
                        <Controller
                          name={`${prefix}.endDatetime`}
                          control={control}
                          defaultValue={endDatetime}
                          render={({ field }) => (
                            <MonthPicker page={page} {...field} />
                          )}
                        />
                        <FormHelperText color="red">
                          {errors?.endDatetime?.message}
                        </FormHelperText>
                      </FormControl>
                    </HStack>

                    <FormControl
                      pt={2}
                      pl={24}
                      as={HStack}
                      align="center"
                      isInvalid={errors?.education?.[index]?.fieldOfStudy}
                    >
                      <FormLabel fontSize="sm" color="#999" mb={0}>
                        <Checkbox>
                          {wordExtractor(
                            page?.content?.wordings,
                            "field_label_education_present"
                          )}
                        </Checkbox>
                      </FormLabel>
                      <FormHelperText>
                        {errors?.education?.[index]?.fieldOfStudy?.message}
                      </FormHelperText>
                    </FormControl>

                    {index === fields?.length - 1 && (
                      <Box>
                        <Button
                          mt={4}
                          px={2}
                          size="sm"
                          alignSelf="flex-start"
                          variant="outline"
                          onClick={() => append()}
                          leftIcon={<AiOutlinePlus />}
                        >
                          {wordExtractor(
                            page?.content?.wordings,
                            "button_label_append"
                          )}
                        </Button>
                      </Box>
                    )}
                  </VStack>
                </Box>
              );
            }
          )}
        </VStack>
      </VStack>
    );
  } else {
    return (
      <VStack spacing={4} width={["100%", "50%"]} align="stretch">
        <Text fontSize={["lg", "md"]}>
          {wordExtractor(page?.content?.wordings, "subsection_label_education")}
        </Text>
        <VStack pl={2} spacing={0} align="stretch">
          {(identity?.education ?? []).map(
            (
              { present, startDatetime, endDatetime, school, fieldOfStudy },
              index
            ) => {
              const borderColor = present ? "#00BFBA" : "#eee";
              return (
                <Box
                  pl={2}
                  key={index}
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
                    mb={8}
                    spacing={0.5}
                    fontSize={["lg", "sm"]}
                    spacing={0}
                    align="start"
                  >
                    {present && (
                      <Text color="#00BFBA">
                        {wordExtractor(
                          page?.content?.wordings,
                          "present_label"
                        )}
                      </Text>
                    )}
                    <Text color="#aaa">
                      {moment(startDatetime).format("MM/YYYY")} -{" "}
                      {present
                        ? moment(endDatetime).format("MM/YYYY")
                        : wordExtractor(
                            page?.content?.wordings,
                            "present_label"
                          )}
                    </Text>
                    <Text>{fieldOfStudy}</Text>
                    <Text>{school}</Text>
                  </VStack>
                </Box>
              );
            }
          )}
        </VStack>
      </VStack>
    );
  }
};

export default EducationSubSection;
