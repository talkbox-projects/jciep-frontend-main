import { useForm } from "react-hook-form";
import {
  Box,
  Text,
  Button,
  HStack,
  VStack,
  Stack,
  Wrap,
  Tag,
} from "@chakra-ui/react";
import wordExtractor from "../../../utils/wordExtractor";
import SectionCard from "../fragments/SectionCard";
import { RiEdit2Line } from "react-icons/ri";
import { useDisclosureWithParams } from "../../../store/AppStore";
import { useState } from "react";
import moment from "moment";
import { useRouter } from "next/router";

const Dot = (props) => {
  return <Box {...props} borderRadius="50%" d="inline-block" />;
};

const ExperienceSection = ({ identity, page, enums, editable }) => {
  const form = useForm();

  const router = useRouter();

  const [education, setEducation] = useState([
    {
      school: "Talkbox University",
      degree: "diploma",
      fieldOfStudy: "Information Systems",
      startDatetime: 0,
      endDatetime: 0,
      present: true,
    },
    {
      school: "Talkbox University",
      degree: "diploma",
      fieldOfStudy: "Information Systems",
      startDatetime: 0,
      endDatetime: 0,
      present: false,
    },
    {
      school: "Talkbox University",
      degree: "diploma",
      fieldOfStudy: "Information Systems",
      startDatetime: 0,
      endDatetime: 0,
      present: false,
    },
  ]);

  const [employment, setEmployement] = useState([
    {
      employmentType: "freelance",
      companyName: "HKU",
      industry: "filmmaking",
      startDatetime: 0,
      endDatetime: 0,
      present: true,
    },
    {
      employmentType: "partTime",
      companyName: "Talkbox",
      industry: "musicSoundDesign",
      startDatetime: 0,
      endDatetime: 0,
      present: false,
    },
    {
      employmentType: "fullTime",
      companyName: "GreenTomato",
      industry: "softwareMobileAppDesign",
      startDatetime: 0,
      endDatetime: 0,
      present: false,
    },
  ]);

  const editModeDisclosure = useDisclosureWithParams();

  const view = (
    <Stack
      px={1}
      direction={["column", "column", "column", "row"]}
      px={8}
      spacing={4}
    >
      <VStack spacing={4} width={["100%", "50%"]} align="stretch">
        <Text fontSize={["lg", "md"]}>
          {wordExtractor(page?.content?.wordings, "subsection_label_education")}
        </Text>
        <VStack pl={2} spacing={0} align="stretch">
          {(education ?? []).map(
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
                  pb={4}
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
      <VStack spacing={4} width={["100%", "50%"]} align="stretch">
        <Text fontSize={["lg", "md"]}>
          {wordExtractor(
            page?.content?.wordings,
            "subsection_label_employment"
          )}
        </Text>
        <VStack pl={2} pb={8} spacing={0} align="stretch">
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
    </Stack>
  );

  const editor = <></>;

  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        <HStack px={8} py={4} align="center">
          <Text flex={1} minW={0} w="100%" fontSize="2xl">
            {wordExtractor(page?.content?.wordings, "experience_header_label")}
          </Text>
          {editModeDisclosure.isOpen ? (
            <Button
              onClick={editModeDisclosure.onClose}
              variant="link"
              leftIcon={<RiEdit2Line />}
            >
              {wordExtractor(page?.content?.wordings, "save_button_label")}
            </Button>
          ) : (
            <Button
              onClick={editModeDisclosure.onOpen}
              variant="link"
              leftIcon={<RiEdit2Line />}
            >
              {wordExtractor(page?.content?.wordings, "section_edit_label")}
            </Button>
          )}
        </HStack>

        {editModeDisclosure.isOpen ? editor : view}
      </VStack>
    </SectionCard>
  );
};

export default ExperienceSection;
