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
import { useCallback, useState } from "react";
import moment from "moment";
import { useRouter } from "next/router";
import EducationSubSection from "../fragments/EducationSubSection";
import EmploymentSubSection from "../fragments/EmploymentSubSection";
import Dot from "../fragments/Dot";

const ExperienceSection = ({ identity, page, enums, editable }) => {
  const router = useRouter();

  const [education, setEducation] = useState([
    {
      school: "Talkbox University",
      degree: "diploma",
      fieldOfStudy: "Information Systems",
      startDatetime: null,
      endDatetime: null,
      present: true,
    },
    {
      school: "Talkbox University",
      degree: "diploma",
      fieldOfStudy: "Information Systems",
      startDatetime: null,
      endDatetime: null,
      present: false,
    },
    {
      school: "Talkbox University",
      degree: "diploma",
      fieldOfStudy: "Information Systems",
      startDatetime: null,
      endDatetime: null,
      present: false,
    },
  ]);

  const [employment, setEmployement] = useState([
    {
      employmentType: "freelance",
      companyName: "HKU",
      industry: "filmmaking",
      startDatetime: null,
      endDatetime: null,
      present: true,
    },
    {
      employmentType: "partTime",
      companyName: "Talkbox",
      industry: "musicSoundDesign",
      startDatetime: null,
      endDatetime: null,
      present: false,
    },
    {
      employmentType: "fullTime",
      companyName: "GreenTomato",
      industry: "softwareMobileAppDesign",
      startDatetime: null,
      endDatetime: null,
      present: false,
    },
  ]);

  const form = useForm({
    defaultValues: {
      education,
      employment,
    },
  });
  const { handleSubmit, register, control } = form;
  const editModelDisclosure = useDisclosureWithParams();

  const onSubmit = useCallback(() => {}, []);

  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        <HStack px={8} py={4} align="center">
          <Text flex={1} minW={0} w="100%" fontSize="2xl">
            {wordExtractor(page?.content?.wordings, "experience_header_label")}
          </Text>
          {editModelDisclosure.isOpen ? (
            <Button
              onClick={editModelDisclosure.onClose}
              variant="link"
              leftIcon={<RiEdit2Line />}
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
        <Stack
          px={1}
          direction={
            editModelDisclosure.isOpen
              ? "column"
              : ["column", "column", "column", "row"]
          }
          px={8}
          spacing={4}
        >
          <EducationSubSection
            form={form}
            page={page}
            enums={enums}
            identity={{ education }}
            editable={editable}
            editModelDisclosure={editModelDisclosure}
          />
          <EmploymentSubSection
            form={form}
            page={page}
            enums={enums}
            identity={{ employment }}
            editable={editable}
            editModelDisclosure={editModelDisclosure}
          />
        </Stack>
      </VStack>
    </SectionCard>
  );
};

export default ExperienceSection;
