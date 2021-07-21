import React from "react";
import { Text, Box, VStack, Wrap, Tag, Flex, HStack } from "@chakra-ui/react";
import moment from "moment";
import { useRouter } from "next/router";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import wordExtractor from "../../../utils/wordExtractor";
import Dot from "./Dot";

const EmploymentSubSectionViewer = () => {
  const { identity, page, enums } = IdentityProfileStore.useContext();
  const router = useRouter();
  return (
    <VStack spacing={4} width={["100%", "50%"]} align="stretch">
      <Text fontSize={["lg", "md"]}>
        {wordExtractor(page?.content?.wordings, "subsection_label_employment")}
      </Text>
      <VStack pl={2} spacing={0} align="stretch">
        {(identity?.employment ?? []).map(
          (
            {
              present,
              startDatetime,
              endDatetime,
              jobTitle,
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
                borderLeftColor="#eee"
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
                  align="start"
                >
                  {present && (
                    <Text color="#00BFBA">
                      {wordExtractor(page?.content?.wordings, "present_label")}
                    </Text>
                  )}
                  <Wrap color="#666666">
                    <Tag size="sm" fontWeight="normal">
                      {
                        enums?.EnumIndustryList?.find((x) => x.key === industry)
                          ?.value?.[router.locale]
                      }
                    </Tag>
                    <Text>
                      {startDatetime &&
                        `${moment(startDatetime).format("YYYY/MM")} - `}
                      {present
                        ? wordExtractor(
                            page?.content?.wordings,
                            "present_label"
                          )
                        : endDatetime && moment(endDatetime).format("YYYY/MM")}
                    </Text>
                  </Wrap>
                  <Text pt={2} fontSize={"md"} fontFamily="SFNSDisplay">
                    {jobTitle}
                  </Text>
                  <HStack>
                    <Text fontSize={"md"} color="#666666">
                      {companyName}
                    </Text>
                    {employmentType !== "unselected" && (
                      <Tag size="sm" fontWeight="normal">
                        {
                          enums?.EnumEmploymentModeList?.find(
                            (x) => x.key === employmentType
                          )?.value?.[router.locale]
                        }
                      </Tag>
                    )}
                  </HStack>
                </VStack>
              </Box>
            );
          }
        )}
      </VStack>
    </VStack>
  );
};

export default EmploymentSubSectionViewer;
