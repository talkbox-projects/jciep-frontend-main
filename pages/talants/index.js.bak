import { getConfiguration } from "../../utils/configuration/getConfiguration";
import { getPage } from "../../utils/page/getPage";
import withPageCMS from "../../utils/page/withPageCMS";
import { useRouter } from "next/router";
import {
  Divider,
  HStack,
  Image,
  VStack,
  SimpleGrid,
  GridItem,
  Tag,
  Box,
  Text,
  Wrap,
  Link,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import DividerSimple from "../../components/DividerSimple";
const PAGE_KEY = "jobOpportunities";
import wordExtractor from "../../utils/wordExtractor";
import Container from "../../components/Container";
import moment from "moment";

export const getServerSideProps = async (context) => {
  return {
    props: {
      page: (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {},
      wordings: await getConfiguration({
        key: "wordings",
        lang: context.locale,
      }),
      header: await getConfiguration({ key: "header", lang: context.locale }),
      footer: await getConfiguration({ key: "footer", lang: context.locale }),
      navigation: await getConfiguration({
        key: "navigation",
        lang: context.locale,
      }),
    },
  };
};
const JobOpportunities = ({ page }) => {
  return (
    <VStack py={96} spacing={0} align="stretch" w="100%">
      <Box>Working On</Box>
    </VStack>
  );
};

export default JobOpportunities;
