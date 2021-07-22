import React from "react";
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
  Button,
  SimpleGrid,
  GridItem
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Controller, useFieldArray } from "react-hook-form";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import wordExtractor from "../../../utils/wordExtractor";
import Dot from "./Dot";
import MonthPicker from "./MonthPicker";

const EducationSubSectionEditor = ({ form: { register, control, watch } }) => {
  const { identity, page, enums } = IdentityProfileStore.useContext();
  const router = useRouter();
  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "education",
  });

  return (
    <VStack spacing={4} width={"100%"} align="stretch">
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
            const errors = {} 
            errors?.education?.[index];
            const prefix = `education[${index}]`;
            const borderColor = present ? "#00BFBA" : "#eee";

            const isCurrent = watch(`${prefix}.present`);
            return (
              <Box
                pl={[0,2]}
                key={id}
                borderLeftColor={["transparent","#eee"]}
                borderLeftWidth={2}
                position="relative"
              >
                <Dot
                  position="absolute"
                  top={"-5px"}
                  left={"-5px"}
                  h={"8px"}
                  w={"8px"}
                  bgColor={["transparent",borderColor]}
                />
                <VStack
                  pl={[0,2]}
                  mt={-3}
                  mb={12}
                  spacing={0.5}
                  fontSize={["lg", "sm"]}
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
                      {...register(`${prefix}.fieldOfStudy`, {})}
                      defaultValue={fieldOfStudy}
                    />
                    <FormHelperText>
                      {errors?.education?.[index]?.fieldOfStudy?.message}
                    </FormHelperText>
                  </FormControl>
                  
                    <SimpleGrid columns={[1, 1, 1, 2]} width="100%">
                    <GridItem >
                    <FormControl
                      as={HStack}
                      align="center"
                      isInvalid={errors?.degree?.message}
                    >
                      <FormLabel w={[24,24,32]} fontSize="sm" color="#999" mb={0}>
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
                    </GridItem>
                    <GridItem>
                    <FormControl
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
                          <MonthPicker
                            page={page}
                            {...field}
                            isDisabled={isCurrent}
                          />
                        )}
                      />
                      <FormHelperText color="red">
                        {errors?.endDatetime?.message}
                      </FormHelperText>
                    </FormControl>
                    </GridItem>
                    </SimpleGrid>
                   
                    

                  <FormControl
                    pt={2}
                    pl={24}
                    as={HStack}
                    align="center"
                    isInvalid={errors?.education?.[index]?.fieldOfStudy}
                  >
                    <FormLabel fontSize="sm" color="#999" mb={0}>
                      <Checkbox
                        defaultChecked={present}
                        {...register(`${prefix}.present`, {})}
                      >
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
                </VStack>
              </Box>
            );
          }
        )}
        {
          <Box pl={[0,2]} borderLeftColor={["transparent", "#eee"]} borderLeftWidth={2}>
            <Button
              my={4}
              px={2}
              size="sm"
              w={["100%", "auto"]}
              borderRadius="15px"
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

export default EducationSubSectionEditor;
