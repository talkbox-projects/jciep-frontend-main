import {
  Avatar,
  Box,
  Button,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useAppContext } from "../../../../store/AppStore";
import { getConfiguration } from "../../../../utils/configuration/getConfiguration";
import { getPage } from "../../../../utils/page/getPage";
import withPageCMS from "../../../../utils/page/withPageCMS";
import wordExtractor from "../../../../utils/wordExtractor";
import Container from "../../../../components/Container";
import { AiOutlineEdit } from "react-icons/ai";

const PAGE_KEY = "identity_id_profile";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      wordings: await getConfiguration({
        key: "wordings",
        lang: context.locale,
      }),
      header: await getConfiguration({ key: "header", lang: context.locale }),
      footer: await getConfiguration({ key: "footer", lang: context.locale }),
      setting: await getConfiguration({ key: "setting", lang: context.locale }),
      navigation: await getConfiguration({
        key: "navigation",
        lang: context.locale,
      }),
      lang: context.locale,
    },
  };
};

const sectionBorderStyles = {
  borderRadius: 8,
  borderColor: "gray.300",
  borderWidth: 2,
};

const PublicProfileSection = ({ value: identity, onChange, page }) => {
  const { register, control, handleSubmit } = useForm({
    defaultValues: identity,
    onSuccess: (value) => {
      console.log(value);
      onChange(value);
    },
  });

  const onSubmit = useCallback(() => {
    try {
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <VStack
      as="form"
      align="stretch"
      onSubmit={handleSubmit(onSubmit)}
      {...sectionBorderStyles}
    >
      <VStack align="stretch" spacing={0} position="relative">
        <Image
          w="100%"
          src={page?.content?.headerSection?.bannerPlaceholder}
        ></Image>
        <Avatar
          size="xl"
          position="absolute"
          left={8}
          bottom={0}
          borderWidth={2}
          borderColor="white"
        ></Avatar>
        <HStack py={2} px={4} justifyContent="flex-end">
          <Button size="lg" leftIcon={<AiOutlineEdit />} variant="link">
            {wordExtractor(page?.content?.wordings, "edit_my_profile_label")}
          </Button>
        </HStack>
      </VStack>
      <Text>{JSON.stringify(identity)}</Text>
    </VStack>
  );
};

const IdentityProfile = ({ page }) => {
  const { identity } = useAppContext();
  console.log(identity);

  const setIdentity = useCallback((identity) => {}, []);

  return (
    <Box pt={64} pb={36}>
      <Container>
        <HStack>
          <VStack align="stretch" flex={1} minW={0} w="100%">
            <PublicProfileSection
              value={identity}
              onChange={setIdentity}
              page={page}
            />
            <Box boxShadow="lg"></Box>
          </VStack>
          <VStack align="stretch" w="33%">
            <Box boxShadow="lg"></Box>
            <Box boxShadow="lg"></Box>
          </VStack>
        </HStack>
      </Container>
    </Box>
  );
};

export default withPageCMS(IdentityProfile, {
  key: PAGE_KEY,
  fields: [
    {
      label: "首區段 Header Section",
      name: "headerSection",
      component: "group",
      fields: [
        {
          label: "預設 Banner Banner Placeholder",
          name: "bannerPlaceholder",
          component: "image",
          uploadDir: () => "/user/profile/head-section",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
      ],
    },
  ],
});
