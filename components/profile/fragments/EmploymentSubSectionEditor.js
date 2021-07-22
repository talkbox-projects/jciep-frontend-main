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
  GridItem,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Controller, useFieldArray } from "react-hook-form";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import wordExtractor from "../../../utils/wordExtractor";
import Dot from "./Dot";
import MonthPicker from "./MonthPicker";

const EmploymentSubSectionEditor = ({ form: { register, control, watch } }) => {
  const router = useRouter();
  const { page, enums } = IdentityProfileStore.useContext();
  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "employment",
  });

  return (
    <VStack spacing={4} width={"100%"} align="stretch">
      <Text fontSize={["lg", "md"]}>
        {wordExtractor(page?.content?.wordings, "subsection_label_employment")}
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
            console.log("field item=", {
              id,
              jobTitle,
              companyName,
              employmentType,
              industry,
              present,
              startDatetime,
              endDatetime,
            });
            const errors = {};
            errors?.employment?.[index];
            const prefix = `employment[${index}]`;
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
                      {...register(`${prefix}.jobTitle`, {})}
                      defaultValue={jobTitle}
                    />
                    <FormHelperText>
                      {errors?.employment?.[index]?.jobTitle?.message}
                    </FormHelperText>
                  </FormControl>
                  <SimpleGrid columns={[1, 1, 1, 2]} width="100%">
                    <GridItem>
                      <FormControl
                        as={HStack}
                        align="center"
                        isInvalid={errors?.industry?.message}
                      >
                        <FormLabel
                          w={[24, 24, 32]}
                          fontSize="sm"
                          color="#999"
                          mb={0}
                        >
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
                            "field_label_employment_endDatetime"
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
                    isInvalid={errors?.employment?.[index]?.jobTitle}
                  >
                    <FormLabel fontSize="sm" color="#999" mb={0}>
                      <Checkbox
                        defaultChecked={present}
                        {...register(`${prefix}.present`, {})}
                      >
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
                </VStack>
              </Box>
            );
          }
        )}
        {
          <Box pl={[0,2]} borderLeftColor={["transparent","#eee"]} borderLeftWidth={2}>
            <Button
              my={4}
              px={2}
              size="sm"
              w={["100%", "auto"]}
              alignSelf="flex-start"
              borderRadius="15px"
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

export default EmploymentSubSectionEditor;
