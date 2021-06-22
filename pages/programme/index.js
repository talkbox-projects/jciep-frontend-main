import { Box, VStack, Grid, GridItem, SimpleGrid } from "@chakra-ui/layout";
import withPageCMS from "../../utils/page/withPageCMS";
import { getPage } from "../../utils/page/getPage";
import { NextSeo } from "next-seo";
import { chakra, Heading, Text, Image } from "@chakra-ui/react";
import Container from "../../components/Container";
import { getConfiguration } from "../../utils/configuration/getConfiguration";
import metaTextTemplates from "../../utils/tina/metaTextTemplates";
import programmeFieldsForCMS from "../../utils/tina/programmeFieldsForCMS";
import AccordianContainer from "../../components/AccordianContainer";
import NextLink from "next/link";

const PAGE_KEY = "programme";

export const getServerSideProps = async (context) => {
  return {
    props: {
      page: await getPage({ key: PAGE_KEY, lang: context.locale }),
      header: await getConfiguration({ key: "header", lang: context.locale }),
      footer: await getConfiguration({ key: "footer", lang: context.locale }),
      navigation: await getConfiguration({
        key: "navigation",
        lang: context.locale,
      }),
    },
  };
};

const Programme = ({ page }) => {
  return (
    <VStack w="100%" spacing={0} align="stretch">
      {page?.content?.seo?.title && (
        <NextSeo
          title={page?.content?.seo?.title}
          description={page?.content?.seo?.description}
        ></NextSeo>
      )}

      {/* Banner Section */}
      <Box
        h="calc(50vw - 40px)"
        minH="70vh"
        w="100%"
        position="relative"
        overflowY="visible"
        backgroundImage={`url(${page?.content?.heroBannerSection?.image})`}
        backgroundSize="cover"
        backgroundPosition="center center"
        display="flex"
        flexDirection="column"
        alignItems="center"
        zIndex="-1"
      >
        <Box position="absolute" left={["6%", "12", "18%"]} bottom={["40%"]}>
          <Text
            w="225px"
            fontWeight="semibold"
            fontSize={["36px", "56px"]}
            bg={page?.content?.heroBannerSection?.titleBgColor}
            color="black"
          >
            {page?.content?.heroBannerSection["title 標題"]}
          </Text>
        </Box>
        <Image
          position="absolute"
          bottom="-1px"
          src={page?.content?.heroBannerSection?.bgImageBottom}
          width="100%"
          fit="contain"
        />
      </Box>

      {/* Vision Section */}
      <Box bg={page?.content?.visionSection?.bgColor}>
        <Container>
          <VStack align="center" py={16}>
            <Box
              textAlign="center"
              pos="relative"
              fontSize={["24", "30", "36"]}
              w={["80%", "80%", "100%"]}
              mx={["20", "30"]}
            >
              <chakra.span pos="relative">
                <chakra.span
                  background="#FFFFFF"
                  width={["0%", "106%"]}
                  pos="absolute"
                  height={["0%", "67%"]}
                  bottom="-2"
                  right="-1"
                  zIndex="1"
                />
                <chakra.span fontWeight="semibold" zIndex="2" pos="relative">
                  {page?.content?.visionSection?.title}
                </chakra.span>
              </chakra.span>
              {/* Mobile view highlight spans*/}
              <chakra.span
                background="#FFFFFF"
                width="106%"
                pos="absolute"
                height={["30%", "0%"]}
                top="4"
                right="-1"
                zIndex="1"
              />
              <chakra.span
                background="#FFFFFF"
                width="60%"
                pos="absolute"
                height={["30%", "0%"]}
                bottom="-1"
                right="60"
                zIndex="1"
              />
            </Box>
            <Text textAlign="center" pt={8} fontSize={["lg", "xl", "xl"]}>
              {page?.content?.visionSection?.description}
            </Text>

            {(page?.content?.visionSection?.sections ?? []).map(({ title, description, id }, index) => {
              return (
                <VStack pt={16} key={id}>
                  <Box w="200px" position="relative" mb="34px" mx={["47px", "47px", "48px"]}>
                    <Text pt={8} textAlign="center" fontWeight="normal" fontSize={["lg", "1xl", "2xl"]}>
                      {title}
                    </Text>
                    <Box
                      width="6.15px"
                      height="27.69px"
                      borderRadius="5px"
                      pos="absolute"
                      right={["-6", "-6", "-12"]}
                      bottom="-3"
                      background="#FFFFFF"
                      transform="rotate(30deg)"
                    />
                    <Box
                      width="6.15px"
                      height="27.69px"
                      borderRadius="5px"
                      pos="absolute"
                      left={["-6", "-6", "-12"]}
                      bottom="-3"
                      background="#FFFFFF"
                      transform="rotate(-30deg)"
                    />
                  </Box>

                  <Text textAlign="center" pt={8}>
                    {description}
                  </Text>
                </VStack>
              );
            })}
          </VStack>
        </Container>
      </Box>

      {/* Partner Section */}
      <Box
        backgroundImage={`url(${page?.content?.partnerSection?.bgImageMain})`}
        backgroundSize="cover"
        backgroundPosition="center"
        w="100%"
        overflow="hidden"
        position="relative"
        mt="0"
      >
        <Container>
          <VStack pt={["36px", "36px", "53px"]} textAlign="center">
            <Box
              textAlign="center"
              pos="relative"
              fontSize={["24", "30", "36"]}
              w={["80%", "80%", "100%"]}
              mx={["20", "30"]}
            >
              <chakra.span pos="relative">
                <chakra.span
                  background="#F6D644"
                  width={["0%", "106%"]}
                  pos="absolute"
                  height={["0%", "67%"]}
                  bottom="-2"
                  right="-1"
                  zIndex="1"
                />
                <chakra.span fontWeight="semibold" zIndex="2" pos="relative">
                  {page?.content?.partnerSection?.title}
                </chakra.span>
              </chakra.span>
              {/* Mobile view highlight spans*/}
              <chakra.span
                background="#F6D644"
                width="106%"
                pos="absolute"
                height={["30%", "0%"]}
                top="4"
                right="-1"
                zIndex="1"
              />
              <chakra.span
                background="#F6D644"
                width="60%"
                pos="absolute"
                height={["30%", "0%"]}
                bottom="-1"
                right="70"
                zIndex="1"
              />
            </Box>
            <Text>{page?.content?.partnerSection?.description}</Text>
          </VStack>
          <SimpleGrid
            justifyContent="center"
            alignItems="center"
            alignContent="center"
            columns={[1, 1, 2, 3]}
            mt={8}
            spacing={24}
          >
            {(page?.content?.partnerSection?.partners ?? []).map(({ id, agencyName, projectName, contact, slug }) => (
              <NextLink href={`/programme/partner/${slug}`}>
                <VStack>
                  <GridItem
                    as={VStack}
                    borderWidth={1}
                    w={["80%", "100%"]}
                    _hover={{
                      boxShadow: "lg",
                      bg: "white",
                      opacity: 1,
                    }}
                    cursor="pointer"
                    borderRadius={16}
                    key={id}
                    py={5}
                    px={5}
                    h="320px"
                    textAlign="left"
                    align="left"
                    zIndex="1000"
                  >
                    <Text fontSize="xl">{agencyName}</Text>
                    <Text fontSize="lg">{projectName}</Text>
                    <Box flex={1} minH="max-content" h="100%" />
                    <Image w={["75%"]} src={contact?.logo}></Image>
                  </GridItem>
                </VStack>
              </NextLink>
            ))}
          </SimpleGrid>
        </Container>

        <Image
          pos="absolute"
          zIndex="1"
          src={page?.content?.partnerSection?.bgImageLeft}
          top={["72px", "50px", "72px"]}
          left={["5%", "10%"]}
          h={["100px", "150px", "220px"]}
          w={["100px", "150px", "220px"]}
        />
        <Box pos="relative" pb={["124px", "124px", "380px"]}>
          <Image
            pos="absolute"
            right={["50px", "50px", "105px"]}
            bottom={["15%"]}
            h={["175px", "175px", "279px"]}
            width={["129px", "129px", "205px"]}
            src={page?.content?.partnerSection?.bgImageRight}
            zIndex="1"
          />
          <Image
            pos="absolute"
            right="0px"
            bottom="0"
            width="100%"
            objectFit="contain"
            src={page?.content?.partnerSection?.bgImageBottom}
            zIndex="0"
          />
        </Box>
      </Box>

      {/* Reference Section */}
      <Box
        bg={page?.content?.referenceSection?.bgStyle?.bgColor}
        w="100%"
        pt="36px"
        overflow="hidden"
        position="relative"
        mt="0"
      >
        <Box
          textAlign="center"
          pos="relative"
          fontSize={["24", "30", "36"]}
          w={["80%", "80%", "100%"]}
          mx={["20", "30"]}
        >
          <chakra.span pos="relative">
            <chakra.span
              background={page?.content?.referenceSection?.titleBgColor}
              width={["0%", "106%"]}
              pos="absolute"
              height={["0%", "67%"]}
              bottom="-2"
              right="-1"
              zIndex="1"
            />
            <chakra.span fontWeight="semibold" zIndex="2" pos="relative">
              {page?.content?.referenceSection?.title}
            </chakra.span>
          </chakra.span>
          {/* Mobile view highlight spans*/}
          <chakra.span
            background={page?.content?.referenceSection?.titleBgColor}
            width="106%"
            pos="absolute"
            height={["30%", "0%"]}
            top="4"
            right="-1"
            zIndex="1"
          />
          <chakra.span
            background={page?.content?.referenceSection?.titleBgColor}
            width="60%"
            pos="absolute"
            height={["30%", "0%"]}
            bottom="-1"
            right="70"
            zIndex="1"
          />
        </Box>
        <Box px={["8", "12", "24", "48"]}>
          <SimpleGrid columns={[1, 1, 2, 2]} gap="36px" mt={["36px", "56px"]} justifyContent="center">
            {(page?.content?.referenceSection?.references ?? []).map(({ categoryName, icon, items }, index) => {
              return (
                <GridItem>
                  {" "}
                  <AccordianContainer key={index} title={categoryName} image={icon} accordians={items} />
                </GridItem>
              );
            })}
          </SimpleGrid>
        </Box>
        <Image pos="absolute" src={page?.content?.referenceSection?.bgStyle?.bgGradient1} bottom={0} right={0} />
        <Box pos="relative" pb={["124px", "124px", "380px"]}>
          <Image
            pos="absolute"
            right={["22px", "35px", "81px"]}
            bottom="-10px"
            h="100%"
            width={["66%", "54%", "52%"]}
            src={page?.content?.referenceSection?.bgStyle?.bottomImage}
            zIndex="1"
          />
          <Image
            pos="absolute"
            right="0px"
            bottom="0"
            width="100%"
            objectFit="contain"
            src={page?.content?.referenceSection?.bgStyle?.bottomBorder}
            zIndex="0"
          />
        </Box>
      </Box>
    </VStack>
  );
};

export default withPageCMS(Programme, {
  key: PAGE_KEY,
  fields: programmeFieldsForCMS,
});
