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
  Tag,
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
  identity: { employment },
  page,
  enums,
  editModelDisclosure,
}) => {
  const router = useRouter();
  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "employment",
  });

  if (editModelDisclosure.isOpen) {
    return (
      <VStack
        spacing={4}
        width={editModelDisclosure.isOpen ? "100%" : ["100%", "50%"]}
        align="stretch"
      >
        <Text fontSize={["lg", "md"]}>
          {wordExtractor(
            page?.content?.wordings,
            "subsection_label_employment"
          )}
        </Text>
        <VStack pl={2} spacing={0} align="stretch">
          {(fields ?? []).map(
            (
              {
                id,
                jobTitle,
                companyName,
                employmentType,
                industry,
                present,
                startDatetime,
                endDatetime,
              },
              index
            ) => {
              const errors = errors?.employment?.[index];
              const prefix = `employment[${index}]`;
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
                      isInvalid={errors?.companyName}
                    >
                      <FormLabel w={24} fontSize="sm" color="#999" mb={0}>
                        {wordExtractor(
                          page?.content?.wordings,
                          "field_label_companyName"
                        )}
                      </FormLabel>
                      <Input
                        variant="flushed"
                        {...register(`${prefix}.companyName`, {})}
                        defaultValue={companyName}
                      />
                      <FormHelperText>
                        {errors?.companyName?.message}
                      </FormHelperText>
                    </FormControl>
                    <FormControl
                      as={HStack}
                      align="center"
                      isInvalid={errors?.industry?.message}
                    >
                      <FormLabel w={24} fontSize="sm" color="#999" mb={0}>
                        {wordExtractor(
                          page?.content?.wordings,
                          "field_label_employment_industry"
                        )}
                      </FormLabel>
                      <Select
                        variant="flushed"
                        {...register(`${prefix}.industry`, {})}
                        defaultValue={industry}
                      >
                        <option key={"unselected"} value={""}>
                          {wordExtractor(
                            page?.content?.wordings,
                            "empty_text_label"
                          )}
                        </option>
                        {(enums?.EnumIndustryList ?? []).map(
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
                        {errors?.industry?.message}
                      </FormHelperText>
                    </FormControl>
                    <FormControl
                      as={HStack}
                      align="center"
                      isInvalid={errors?.employmentType?.message}
                    >
                      <FormLabel w={24} fontSize="sm" color="#999" mb={0}>
                        {wordExtractor(
                          page?.content?.wordings,
                          "field_label_employment_employmentType"
                        )}
                      </FormLabel>
                      <Select
                        variant="flushed"
                        {...register(`${prefix}.employmentType`, {})}
                        defaultValue={employmentType}
                      >
                        <option key={"unselected"} value={""}>
                          {wordExtractor(
                            page?.content?.wordings,
                            "empty_text_label"
                          )}
                        </option>
                        {(enums?.EnumEmploymentModeList ?? []).map(
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
                        {errors?.employmentType?.message}
                      </FormHelperText>
                    </FormControl>
                    <FormControl
                      as={HStack}
                      align="center"
                      isInvalid={errors?.employment?.[index]?.jobTitle}
                    >
                      <FormLabel w={24} fontSize="sm" color="#999" mb={0}>
                        {wordExtractor(
                          page?.content?.wordings,
                          "field_label_jobTitle"
                        )}
                      </FormLabel>
                      <Input
                        variant="flushed"
                        {...register("jobTitle", {})}
                        defaultValue={jobTitle}
                      />
                      <FormHelperText>
                        {errors?.employment?.[index]?.jobTitle?.message}
                      </FormHelperText>
                    </FormControl>
                    <HStack pt={2} w="100%" spacing={2}>
                      <FormControl
                        w="50%"
                        as={HStack}
                        align="center"
                        isInvalid={errors?.industry?.message}
                      >
                        <FormLabel w={32} fontSize="sm" color="#999" mb={0}>
                          {wordExtractor(
                            page?.content?.wordings,
                            "field_label_employment_startDatetime"
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
                            "field_label_employment_endDatetime"
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
                      isInvalid={errors?.employment?.[index]?.jobTitle}
                    >
                      <FormLabel fontSize="sm" color="#999" mb={0}>
                        <Checkbox>
                          {wordExtractor(
                            page?.content?.wordings,
                            "field_label_employment_present"
                          )}
                        </Checkbox>
                      </FormLabel>
                      <FormHelperText>
                        {errors?.employment?.[index]?.jobTitle?.message}
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
          {wordExtractor(
            page?.content?.wordings,
            "subsection_label_employment"
          )}
        </Text>
        <VStack pl={2} spacing={0} align="stretch">
          {(employment ?? []).map(
            (
              {
                present,
                startDatetime,
                endDatetime,
                companyName,
                industry,
                employmentType,
              },
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
                    <Wrap color="#aaa">
                      <Tag size="sm" fontWeight="normal">
                        {
                          enums?.EnumIndustryList?.find(
                            (x) => x.key === industry
                          )?.value?.[router.locale]
                        }
                      </Tag>
                      <Text>
                        {moment(startDatetime).format("MM/YYYY")} -{" "}
                        {present
                          ? moment(endDatetime).format("MM/YYYY")
                          : wordExtractor(
                              page?.content?.wordings,
                              "present_label"
                            )}
                      </Text>
                    </Wrap>
                    <Text pt={2}>{companyName}</Text>
                    <Text>
                      {
                        enums?.EnumEmploymentModeList?.find(
                          (x) => x.key === employmentType
                        )?.value?.[router.locale]
                      }
                    </Text>
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
