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
import {
  useAppContext,
  useDisclosureWithParams,
} from "../../../store/AppStore";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { useRouter } from "next/router";
import EducationSubSection from "../fragments/EducationSubSection";
import EmploymentSubSection from "../fragments/EmploymentSubSection";

const ExperienceSection = ({ identity, page, enums, editable }) => {
  const router = useRouter();

  const { updateIdentity } = useAppContext();

  const form = useForm({
    defaultValues: identity,
  });
  useEffect(() => {
    form.reset(identity);
  }, [identity]);

  const { handleSubmit } = form;
  const editModelDisclosure = useDisclosureWithParams();

  const onSubmit = useCallback((values) => {
    console.log("updated", values);
    alert("updated");
    updateIdentity(identity?.id, values);
    editModelDisclosure.onClose();
  }, []);

  return (
    <SectionCard>
      <VStack spacing={1} align="stretch">
        <HStack px={8} py={4} align="center">
          <Text flex={1} minW={0} w="100%" fontSize="2xl">
            {wordExtractor(page?.content?.wordings, "experience_header_label")}
          </Text>
          {!editModelDisclosure.isOpen ? (
            <Button
              onClick={editModelDisclosure.onOpen}
              variant="link"
              leftIcon={<RiEdit2Line />}
            >
              {wordExtractor(page?.content?.wordings, "section_edit_label")}
            </Button>
          ) : (
            <Button
              onClick={handleSubmit(onSubmit)}
              variant="link"
              leftIcon={<RiEdit2Line />}
              type="submit"
            >
              {wordExtractor(page?.content?.wordings, "save_button_label")}
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
            identity={identity}
            editable={editable}
            editModelDisclosure={editModelDisclosure}
          />
          <EmploymentSubSection
            form={form}
            page={page}
            enums={enums}
            identity={identity}
            editable={editable}
            editModelDisclosure={editModelDisclosure}
          />
        </Stack>
      </VStack>
    </SectionCard>
  );
};

export default ExperienceSection;
