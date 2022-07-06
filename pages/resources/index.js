import React, { useEffect, useMemo, useRef, useState } from "react";
import withPageCMS from "../../utils/page/withPageCMS";
import { getPage } from "../../utils/page/getPage";
import resourceFieldsForCMS from "../../utils/tina/resourceFieldsForCMS";
import Slider from "react-slick";
import CategoryTag from "../../components/CategoryTag";
import NextLink from "next/link";
import {
  Divider,
  Heading,
  Text,
  Image,
  Box,
  Button,
  Grid,
  GridItem,
  Portal,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Link,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Center,
  Input,
} from "@chakra-ui/react";
import { VStack, HStack, Flex, Stack } from "@chakra-ui/layout";
import "react-multi-carousel/lib/styles.css";
import MultiTextRenderer from "../../components/MultiTextRenderer";
import wordExtractor from "../../utils/wordExtractor";
import Card from "../../components/CarouselCard";
import ModalCard from "../../components/ModalCard";
import Container from "../../components/Container";
import DividerSimple from "../../components/DividerSimple";
import DividerA from "../../components/DividerA";

import HighlightHeadline from "../../components/HighlightHeadline";
import ApostropheHeadline from "../../components/ApostropheHeadline";
import { AiOutlineArrowRight } from "react-icons/ai";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";
import Anchor from "../../components/Anchor";
import { useRouter } from "next/router";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { NextArrow, PrevArrow } from "../../components/SliderArrow";
import { CloseIcon } from "@chakra-ui/icons";

import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { TiThList } from "react-icons/ti";
import { FaColumns } from "react-icons/fa";

const PAGE_KEY = "resources";

const serviceOrgList = [
  { value: "gov", label: "政府主導的計劃" },
  { value: "non-gov", label: "非政府組織提供的服務" },
];

const serviceDetailList = [
  {
    value: "assessment",
    label: "為殘疾人士提供的就業支援服務 (工作/就業評估)",
  },
  {
    value: "counseling",
    label: "為殘疾人士提供的就業支援服務 (工作/就業輔導)",
  },
  { value: "matching", label: "為殘疾人士提供的就業支援服務 (工作配對)" },
  { value: "followUp", label: "為殘疾人士提供的就業支援服務 (就業後跟進)" },
  {
    value: "training",
    label: "為殘疾人士提供的就業支援服務 (職業訓練/就業培訓)",
  },
  {
    value: "instruction",
    label: "為殘疾人士提供的就業支援服務 (職場督導/指導)",
  },
  {
    value: "guidance",
    label: "為殘疾人士提供的就業支援服務 (為僱主和職員提供培訓/指導)",
  },
  { value: "internship", label: "實習機會" },
  { value: "probationOrReferral", label: "在職試用和/或工作轉介" },
  { value: "employer", label: "為僱主提供的津貼" },
  { value: "trainee", label: "為僱員/實習生/訓練生提供的津貼" },
];

const ServiceFilter = ({
  label,
  value = [],
  onChange = () => undefined,
  list = [],
}) => (
  <Menu>
    <MenuButton
      minW={["120px", "120px", "180px", "220px"]}
      as={Button}
      variant="outline"
      rightIcon={<ChevronDownIcon />}
      borderBottomWidth="2px"
      size="lg"
      textAlign="left"
    >
      <Text w="100%">
        {value.length > 0 ? `已篩選 ${value.length} 個` : ""}
        {label}
      </Text>
    </MenuButton>
    <Portal>
      <MenuList maxW="100vw" minWidth="240px">
        <MenuOptionGroup value={value} onChange={onChange} type="checkbox">
          {list?.map((target, i) => (
            <MenuItemOption key={i} value={target.value}>
              {target.label}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Portal>
  </Menu>
);

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};
  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
    },
  };
};

const Resources = ({ page, enums, setting }) => {
  const disableClick = {
    pointerEvents: "none",
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [modalData, setModalData] = useState([]);
  const [showItems, setShowItems] = useState(3);
  const [listStyle, setListStyle] = useState("table");
  const [activeSldie, setActiveSldie] = useState(0);
  const sliderRef = useRef(null);
  const settings = {
    ref: (c) => (sliderRef.current = c),
    dots: false,
    speed: 500,
    slidesToScroll: 1,
    variableWidth: true,
    infinite: false,
    beforeChange: (current, next) => setActiveSldie(next),
  };

  const [serviceOrgFilter, setServiceOrgFilter] = useState([]);
  const [serviceTargetFilter, setServiceTargetFilter] = useState([]);
  const [serviceDetailFilter, setServiceDetailFilter] = useState([]);
  const [serviceTextFilter, setServiceTextFilter] = useState("");

  const handleRowOnClick = (data) => {
    onOpen();
    setModalData(data);
  };

  const reset = () => {
    setServiceOrgFilter([]);
    setServiceTargetFilter([]);
    setServiceDetailFilter([]);
    setServiceTextFilter("")
  };

  const serviceTargetList = useMemo(
    () =>
      enums?.EnumServiceTargetList?.map((target) => ({
        value: target.key,
        label: target.value[router.locale],
      })),
    [enums?.EnumServiceTargetList, router.locale]
  );

  const filteredResourceList = useMemo(() => {
    if (
      serviceOrgFilter.length === 0 &&
      serviceTargetFilter.length === 0 &&
      serviceDetailFilter.length === 0
    )
      return page?.content?.resourceSection?.resources.filter(d=>d?.name?.text.search(new RegExp(serviceTextFilter.replace(/\s+/, '|'))) != -1);

    const filtered = page?.content?.resourceSection?.resources.filter((resource) => {
      const isServiceOrgMatched =
        serviceOrgFilter.length === 0 ||
        serviceOrgFilter?.includes(resource?.category);

      const isServiceTarget =
        serviceTargetFilter.length === 0 ||
        !!resource?.serviceTarget?.tags?.find(({ value }) =>
          serviceTargetFilter?.includes(value)
        );

      const isServiceDetail = (() => {
        if (serviceDetailFilter.length === 0) return true;
        const isSupport = !!resource?.services?.find(({ category }) =>
          serviceDetailFilter?.includes(category)
        );
        const isInternship =
          serviceDetailFilter?.includes("internship") &&
          resource?.internship?.value === true;
        const isProbationOrReferral =
          serviceDetailFilter?.includes("probationOrReferral") &&
          resource?.probationOrReferral?.value === true;
        const isSubsidy = !!resource?.subsidy?.find(({ target }) =>
          serviceDetailFilter?.includes(target)
        );

        return isSupport || isInternship || isProbationOrReferral || isSubsidy;
      })();      

      return isServiceOrgMatched && isServiceTarget && isServiceDetail;
    })

    return filtered.filter(d=>d?.name?.text.search(new RegExp(serviceTextFilter.replace(/\s+/, '|'))) != -1);


  }, [
    page?.content?.resourceSection?.resources,
    serviceDetailFilter,
    serviceOrgFilter,
    serviceTargetFilter,
    serviceTextFilter
  ]);

  const categories = setting?.value?.categories;
  const getCategoryData = (key) => {
    return (categories ?? []).find((c) => c.key === key);
  };

  const handleTextFilter = (e) => {
    e.preventDefault();
    const {value} = e.target;
    setServiceTextFilter(value)
  }

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setTimeout(() => {
        document.querySelector(`[data-tag='${hash}']`).scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
      }, 300);
    }
  }, [router]);

  return (
    <VStack w="100%" spacing={0} align="stretch">
      {/* Banner Section */}
      <Box
        bgImg={`url(${page?.content?.heroBannerSection?.image})`}
        bgSize="cover"
        bgPos="center center"
      >
        <Container>
          <Text
            d="inline-block"
            mt={96}
            px={2}
            mb={18}
            fontWeight="bold"
            fontSize={["3xl", "4xl", "5xl"]}
            bg="#F6D644"
          >
            {page?.content?.heroBannerSection["title 標題"]}
          </Text>
        </Container>
        <Box>
          <DividerSimple nextColor="#F6D644" />
        </Box>
      </Box>
      {/* Dialogue Section */}
      <Box bg="#F6D644">
        <Container pos="relative">
          <VStack align="stretch" spacing={0} pt={16}>
            <Box alignSelf="center" fontSize={["2xl", "4xl"]}>
              <HighlightHeadline bgColor="#fff">
                {page?.content?.dialogue?.tagline}
              </HighlightHeadline>
            </Box>

            <VStack pt={16} align="start" position="relative" spacing={4}>
              {(page?.content?.dialogue?.left?.dialogue ?? []).map(
                ({ message }, index) => {
                  if (index == 0) {
                    return (
                      <HStack key={index} position="relative">
                        <Box
                          ml={[0, 0, 0, 16]}
                          py={1}
                          px={2}
                          w={["75%", "75%", "65%", "max"]}
                          borderRadius={["10px", "10px", "10px", "20px"]}
                          bg="white"
                          pos="relative"
                        >
                          <MultiTextRenderer
                            key={index}
                            parentStyles={{
                              padding: "5px",
                              paddingLeft: "10px",
                            }}
                            data={message}
                            fontSize={["lg", "xl", "2xl"]}
                            marginBottom="20px"
                          />
                          <Box
                            w="0px"
                            height="0px"
                            borderRight="5px solid transparent"
                            borderLeft="5px solid transparent"
                            borderTop="12px solid #FFFFFF"
                            transform="scaleY(-1) rotate(150deg)"
                            pos="absolute"
                            left="0"
                            bottom="-6px"
                          ></Box>
                        </Box>
                        <Image
                          alt=""
                          h="120%"
                          src={page?.content?.dialogue?.leftQuoteImage}
                        />
                      </HStack>
                    );
                  } else {
                    return (
                      <Box
                        key={index}
                        py={1}
                        px={2}
                        w={["75%", "75%", "65%", "max"]}
                        borderRadius={["10px", "10px", "10px", "20px"]}
                        bg="white"
                        pos="relative"
                      >
                        <MultiTextRenderer
                          key={index}
                          data={message}
                          parentStyles={{
                            padding: "5px",
                            paddingLeft: "10px",
                          }}
                          fontSize={["lg", "xl", "2xl"]}
                          marginBottom="20px"
                        />
                        <Box
                          w="0px"
                          height="0px"
                          borderRight="5px solid transparent"
                          borderLeft="5px solid transparent"
                          borderTop="12px solid #FFFFFF"
                          transform="scaleY(-1) rotate(150deg)"
                          pos="absolute"
                          left="0"
                          bottom="-6px"
                        ></Box>
                      </Box>
                    );
                  }
                }
              )}
              <Text mt={3} fontSize="lg" ml={-6}>
                {page?.content?.dialogue?.left?.role}
              </Text>
              <Box mr={["", "", "", "", "-275px !important"]}>
                <Image
                  alt=""
                  h={["127px", "127px", "194px", "194px"]}
                  src={page?.content?.dialogue?.left?.left}
                  zIndex="0"
                />
              </Box>
            </VStack>
          </VStack>
        </Container>
      </Box>
      <Box border="0px" backgroundColor="#F6D644">
        <DividerA
          primaryColor="#F6D644"
          secondaryColor="F6D644"
          nextColor="#FEB534"
        ></DividerA>
      </Box>
      <Box bg="#FEB534" pb={48}>
        <Container mt={["-150px", "-150px", "-260px"]} pos="relative">
          <VStack
            alignItems="flex-end"
            position="relative"
            spacing={4}
            height={["320px", "auto"]}
          >
            {(page?.content?.dialogue?.right?.dialogue ?? []).map(
              ({ message }, index) => {
                if (index == 0) {
                  return (
                    <HStack
                      key={index}
                      justifyContent="flex-end"
                      position={["absolute", "relative"]}
                      bottom="10%"
                    >
                      <Image
                        alt=""
                        h="120%"
                        src={page?.content?.dialogue?.rightQuoteImage}
                      />
                      <Box
                        ml={[0, 0, 0, 16]}
                        py={1}
                        px={2}
                        w={["75%", "75%", "65%", "max"]}
                        borderRadius={["10px", "10px", "10px", "20px"]}
                        bg="white"
                        pos="relative"
                      >
                        <MultiTextRenderer
                          key={index}
                          parentStyles={{
                            padding: "5px",
                            paddingLeft: "10px",
                          }}
                          data={message}
                          fontSize={["lg", "xl", "2xl"]}
                          marginBottom="20px"
                        />
                        <Box
                          w="0px"
                          height="0px"
                          borderRight="5px solid transparent"
                          borderLeft="5px solid transparent"
                          borderTop="12px solid #FFFFFF"
                          transform="scaleY(-1) rotate(-150deg)"
                          pos="absolute"
                          right={0}
                          bottom="-6px"
                        ></Box>
                      </Box>
                    </HStack>
                  );
                }
              }
            )}
            <Text
              mt={3}
              fontSize="lg"
              mr={-6}
              position={["absolute", "relative"]}
              bottom="0px"
            >
              {page?.content?.dialogue?.right?.role}
            </Text>
            <Box mr={["", "", "", "", "-125px !important"]}>
              <Image
                alt=""
                w={["152px", "152px", "152px", "255px", "255px"]}
                src={page?.content?.dialogue?.right?.rightImage}
              />
            </Box>
          </VStack>
        </Container>
        <Container mt={["", "", "", "", "-200px"]}>
          <VStack>
            <Box fontSize="2xl" marginBottom="20px">
              <ApostropheHeadline color="#FFF" mb={3}>
                {page?.content?.howSection["title 標題"]}
              </ApostropheHeadline>
            </Box>
            <Box
              maxW={["80%", "80%", "80%", 700]}
              w="100%"
              pb={8}
              borderRadius={16}
              py={4}
              px={6}
              bg="white"
            >
              <MultiTextRenderer
                textAlign="center"
                fontSize={["lg", "lg", "xl", "2xl"]}
                data={page?.content?.howSection?.content}
              />
            </Box>
          </VStack>
        </Container>
      </Box>
      <Box bg="#FEB534">
        <DividerSimple nextColor="#F3F3F3" />
      </Box>
      {/* resource Section */}

      <Box bg="#F3F3F3">
        <Anchor id="list" />
        <Container>
          <Text my={16} fontSize={"6xl"} fontWeight="bold">
            {page?.content?.resourceSection["title 標題"]}
          </Text>
          <Stack direction={["column", "row"]} spacing={8} pb={4}>
            <Input
              h={"44px"}
              onChange={handleTextFilter}
              placeholder={wordExtractor(
                page?.content?.wordings,
                "search_placeholder"
              )}
            />

            <ServiceFilter
              label="服務提供機構"
              value={serviceOrgFilter}
              onChange={setServiceOrgFilter}
              list={serviceOrgList}
            />
            <ServiceFilter
              label="服務對象"
              value={serviceTargetFilter}
              onChange={setServiceTargetFilter}
              list={serviceTargetList}
            />
            <ServiceFilter
              label="服務內容"
              value={serviceDetailFilter}
              onChange={setServiceDetailFilter}
              list={serviceDetailList}
            />
            <Button
              colorScheme="black"
              type="reset"
              onClick={reset}
              size="sm"
              variant="link"
            >
              {wordExtractor(page?.content?.wordings, "reset_label")}
            </Button>
          </Stack>
          <Flex flexDirection="row" justifyContent="space-between">
            <Text>{`共${filteredResourceList?.length}項搜尋結果`}</Text>
            <Box>
              <Flex flexDirection="row" align="center" gap={2}>
                <Box>檢視方式:</Box>
                <FaColumns
                  size={20}
                  style={{
                    cursor: "pointer",
                    opacity: listStyle === "card" ? 1 : 0.5,
                  }}
                  onClick={() => setListStyle("card")}
                />
                <TiThList
                  size={20}
                  style={{
                    cursor: "pointer",
                    opacity: listStyle === "table" ? 1 : 0.5,
                  }}
                  onClick={() => setListStyle("table")}
                />
              </Flex>
            </Box>
          </Flex>
        </Container>

        {listStyle === "table" && (
          <>
            <Container>
              <Box d={["none", "none", "block"]} pos="relative" minH="600px">
                <Box pos="relative" minH="600px">
                  <Table
                    style={{
                      borderTopLeftRadius: "15px",
                      borderTopRightRadius: "15px",
                      overflow: "hidden",
                      margin: "15px 0",
                    }}
                  >
                    <Thead
                      style={{ backgroundColor: "#FEB534", height: "70px" }}
                    >
                      <Tr
                        style={{
                          textAlign: "left",
                          padding: "0 10px",
                          fontSize: "14px",
                        }}
                      >
                        <Th style={{ padding: "0 15px" }}>
                          {wordExtractor(page?.content?.wordings, "table_th_1")}
                        </Th>
                        <Th style={{ padding: "0 15px" }}>
                          {wordExtractor(page?.content?.wordings, "table_th_2")}
                        </Th>
                        <Th style={{ padding: "0 15px" }}>
                          {wordExtractor(page?.content?.wordings, "table_th_3")}
                        </Th>
                        <Th style={{ padding: "0 15px", textAlign: "center" }}>
                          {wordExtractor(page?.content?.wordings, "table_th_4")}
                        </Th>
                        <Th style={{ padding: "0 15px", textAlign: "center" }}>
                          {wordExtractor(page?.content?.wordings, "table_th_5")}
                        </Th>
                        <Th style={{ padding: "0 15px", textAlign: "center" }}>
                          {wordExtractor(page?.content?.wordings, "table_th_6")}
                        </Th>
                        <Th style={{ padding: "0 15px", textAlign: "center" }}>
                          {wordExtractor(page?.content?.wordings, "table_th_7")}
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody
                      style={{ backgroundColor: "#FFF", fontSize: "14px" }}
                    >
                      {(filteredResourceList ?? []).map((resource, index) => {
                        return (
                          <TableRow
                            key={resource?.id}
                            resource={resource}
                            {...resource}
                            handleRowOnClick={handleRowOnClick}
                          />
                        );
                      })}
                    </Tbody>
                  </Table>
                </Box>
              </Box>
            </Container>

            <Container>
              <Box d={["block", "block", "none"]} pos="relative" minH="600px">
                <Table
                  style={{
                    borderTopLeftRadius: "15px",
                    borderTopRightRadius: "15px",
                    overflow: "hidden",
                    margin: "15px 0",
                  }}
                >
                  <Thead style={{ backgroundColor: "#FEB534" }}>
                    <Tr
                      style={{
                        textAlign: "left",
                        padding: "0 10px",
                        fontSize: "14px",
                      }}
                    >
                      <Th style={{ padding: "0 15px" }}>
                        {wordExtractor(page?.content?.wordings, "table_th_1")}
                      </Th>
                      <Th style={{ padding: "0 15px" }}>
                        {wordExtractor(page?.content?.wordings, "table_th_2")}
                      </Th>
                      <Th style={{ padding: "0 15px" }}>
                        {wordExtractor(page?.content?.wordings, "table_th_3")}
                      </Th>
                      <Th style={{ padding: "0 15px", textAlign: "center" }}>
                        {wordExtractor(page?.content?.wordings, "table_th_4")}
                      </Th>
                      <Th style={{ padding: "0 15px", textAlign: "center" }}>
                        {wordExtractor(page?.content?.wordings, "table_th_5")}
                      </Th>
                      <Th style={{ padding: "0 15px", textAlign: "center" }}>
                        {wordExtractor(page?.content?.wordings, "table_th_6")}
                      </Th>
                      <Th style={{ padding: "0 15px", textAlign: "center" }}>
                        {wordExtractor(page?.content?.wordings, "table_th_7")}
                      </Th>

                      <Th
                        style={{ padding: "0 15px", textAlign: "center" }}
                      ></Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ backgroundColor: "#FFF", fontSize: "14px" }}>
                    {(filteredResourceList ?? []).map((resource, index) => {
                      const {
                        name,
                        category,
                        organization,
                        serviceTarget,
                        services,
                        internship,
                        probationOrReferral,
                        subsidy,
                        remark,
                        topColor,
                        contact,
                        reminder,
                      } = resource;

                      return (
                        <Tr
                          key={resource?.id}
                          style={{
                            border: "none",
                            borderBottom: "1px solid #EAEAEA",
                            padding: "20px 10px",
                          }}
                          onClick={() => handleRowOnClick(resource)}
                        >
                          <Td style={{ padding: "0 15px" }}>{name?.text}</Td>
                          <Td style={{ padding: "0 15px" }}>
                            {organization?.text}
                          </Td>
                          <Td style={{ padding: "0 15px" }}>
                            {serviceTarget?.text}
                          </Td>
                          <Td
                            style={{
                              textAlign: "center",
                              minHeight: "45px",
                              align: "center",
                            }}
                          >
                            <Checkbox
                              size="md"
                              colorScheme="green"
                              defaultChecked={services?.length > 0}
                              style={{ ...disableClick, paddingTop: "15px" }}
                            />
                          </Td>
                          <Td style={{ textAlign: "center" }}>
                            <Checkbox
                              size="md"
                              colorScheme="green"
                              defaultChecked={internship?.value}
                              style={disableClick}
                            />
                          </Td>
                          <Td style={{ textAlign: "center" }}>
                            <Checkbox
                              size="md"
                              colorScheme="green"
                              defaultChecked={probationOrReferral}
                              style={disableClick}
                            />
                          </Td>
                          <Td style={{ textAlign: "center" }}>
                            <Checkbox
                              size="md"
                              colorScheme="green"
                              defaultChecked={subsidy?.length > 0}
                              style={disableClick}
                            />
                          </Td>
                          <Td style={{ textAlign: "center" }}>
                            {wordExtractor(
                              page?.content?.wordings,
                              "click_for_detail"
                            )}
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </Box>
            </Container>
          </>
        )}

        {listStyle === "card" && (
          <Box className="cardDisplay">
            <Box
              d={["none", "none", "block"]}
              p={4}
              pos="relative"
              w="100vw"
              minH="600px"
            >
              <Slider
                {...settings}
                initialSlide={0}
                draggable={false}
                prevArrow={<PrevArrow />}
                nextArrow={<NextArrow />}
                accessibility={false}
              >
                {(filteredResourceList ?? []).map((resource, index) => {
                  const {
                    name,
                    category,
                    organization,
                    serviceTarget,
                    services,
                    internship,
                    probationOrReferral,
                    subsidy,
                    remark,
                    topColor,
                    contact,
                    reminder,
                  } = resource;
                  return (
                    <Box
                      {...(index === 0 && { ml: "150px" })}
                      key={resource?.id}
                      px={1}
                      h="100%"
                      maxW={"336px"}
                    >
                      <Card
                        name={name}
                        topColor={topColor}
                        organization={organization}
                        category={category}
                        serviceTarget={serviceTarget}
                        services={services}
                        internship={internship}
                        probationOrReferral={probationOrReferral}
                        subsidy={subsidy}
                        remark={remark}
                        contact={contact}
                        reminder={reminder}
                        page={page}
                        isActive={activeSldie === index}
                      />
                    </Box>
                  );
                })}
              </Slider>
            </Box>
            <VStack
              w="100%"
              p={[2, 4]}
              justifyContent="center"
              d={["block", "block", "none"]}
            >
              <Box>
                {(filteredResourceList?.slice(0, showItems) ?? []).map(
                  (resource, index) => {
                    const {
                      name,
                      category,
                      organization,
                      serviceTarget,
                      services,
                      internship,
                      probationOrReferral,
                      subsidy,
                      remark,
                      topColor,
                      contact,
                      reminder,
                    } = resource;
                    return (
                      <VStack key={index} px={2} alignItems="stretch">
                        <Card
                          name={name}
                          topColor={topColor}
                          organization={organization}
                          category={category}
                          serviceTarget={serviceTarget}
                          services={services}
                          internship={internship}
                          probationOrReferral={probationOrReferral}
                          subsidy={subsidy}
                          remark={remark}
                          contact={contact}
                          reminder={reminder}
                          page={page}
                        />
                      </VStack>
                    );
                  }
                )}
                {showItems < filteredResourceList?.length && (
                  <VStack mt={6} w="100%" align="center">
                    <Button
                      variant="outline"
                      borderColor="black"
                      borderWidth={2}
                      p={3}
                      size="xl"
                      borderRadius="2em"
                      onClick={() =>
                        setShowItems((i) =>
                          Math.min(i + 3, filteredResourceList?.length)
                        )
                      }
                    >
                      {wordExtractor(page?.content?.wordings, "showMore")}
                    </Button>
                  </VStack>
                )}
              </Box>
            </VStack>
          </Box>
        )}

        <Container>
          <Button
            mt={3}
            as={Link}
            target="_blank"
            href="https://drive.google.com/file/d/1DrkfJyOWI1CepayqrHfi3wBaCAQV7C5v/view"
            borderRadius="full"
            color="#000"
            bg="transparent"
            variant="outline"
            _hover={{
              bg: "rgba(255,255,255, 0.3)",
            }}
            borderColor="#000"
          >
            {wordExtractor(page?.content?.wordings, "resource_download_label")}
          </Button>
        </Container>
      </Box>
      {/* Equip Section */}
      <Box overflow="hidden" bg="red" pos="relative">
        <Anchor id="equip" top="0" />
        <Box
          pb={["46px", "46px", "72px"]}
          pt={["", "", "50px"]}
          background="#F3F3F3"
        >
          <Box
            display="flex"
            pos="relative"
            maxW={{ lg: "83%", md: "90%" }}
            px={{ base: "16px", md: "0" }}
            mx="auto"
          >
            <Box mt={["110px", "110px", "80px"]}>
              <Text fontSize={["24px", "24px", "54px"]} fontWeight="bold">
                {wordExtractor(page?.content?.wordings, "equip")}
              </Text>
            </Box>
          </Box>

          <Grid
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(6, 1fr)"
            gap="24px"
            justifyContent="center"
            mt="24px"
            position="relative"
            zIndex="1"
            maxW={{ lg: "83%", md: "90%" }}
            px={{ base: "16px", md: "0" }}
            mx="auto"
          >
            <GridItem rowSpan="2" colSpan={[6, 6, 3, 3]}>
              <VStack spacing={0} bg="#FFFFFF" borderRadius={8}>
                {page?.content?.equipSection?.left?.category && (
                  <HStack p={8} align="start" w="100%">
                    <CategoryTag
                      size="lg"
                      category={getCategoryData(
                        page?.content?.equipSection?.left?.category
                      )}
                    />
                  </HStack>
                )}
                <Box p={[4, 4, 8]}>
                  <MultiTextRenderer
                    fontSize={["xl", "2xl", "2xl", "3xl"]}
                    data={page?.content?.equipSection?.left?.content}
                  />
                </Box>
                <Divider />
                {page?.content?.equipSection?.left?.link && (
                  <HStack w="100%" p={4} justifyContent="flex-end">
                    <NextLink
                      passHref={true}
                      href={page?.content?.equipSection?.left?.link ?? ""}
                    >
                      <Button
                        variant="ghost"
                        rightIcon={<AiOutlineArrowRight />}
                      >
                        {wordExtractor(
                          page?.content?.wordings,
                          "understand_more_label"
                        )}
                      </Button>
                    </NextLink>
                  </HStack>
                )}
              </VStack>
            </GridItem>
            <GridItem colSpan={[6, 6, 3, 3]}>
              <VStack spacing={0} bg="#FFFFFF" borderRadius={8}>
                {page?.content?.equipSection?.topRight?.category && (
                  <HStack p={8} align="start" w="100%">
                    <CategoryTag
                      size="lg"
                      category={getCategoryData(
                        page?.content?.equipSection?.topRight?.category
                      )}
                    />
                  </HStack>
                )}
                <Box p={[4, 4, 8]}>
                  <MultiTextRenderer
                    fontSize={["xl", "2xl", "2xl", "3xl"]}
                    data={page?.content?.equipSection?.topRight?.content}
                  />
                </Box>
                <Divider />
                {page?.content?.equipSection?.topRight?.link && (
                  <HStack w="100%" p={4} justifyContent="flex-end">
                    <NextLink
                      passHref={true}
                      href={page?.content?.equipSection?.topRight?.link ?? ""}
                    >
                      <Button
                        variant="ghost"
                        rightIcon={<AiOutlineArrowRight />}
                      >
                        {wordExtractor(
                          page?.content?.wordings,
                          "understand_more_label"
                        )}
                      </Button>
                    </NextLink>
                  </HStack>
                )}
              </VStack>
            </GridItem>
            {/* temp hidden */}
            <GridItem colSpan={[6, 6, 3, 3]}>
              <Anchor id="tips" top="-140px" />
              <VStack spacing={0} bg="#FFFFFF" borderRadius={8}>
                {page?.content?.equipSection?.bottomRight?.category && (
                  <HStack p={8} align="start" w="100%">
                    <CategoryTag
                      size="lg"
                      category={getCategoryData(
                        page?.content?.equipSection?.bottomRight?.category
                      )}
                    />
                  </HStack>
                )}
                <Box p={[4, 4, 8]}>
                  <MultiTextRenderer
                    fontSize={["xl", "2xl", "2xl", "3xl"]}
                    data={page?.content?.equipSection?.bottomRight?.content}
                  />
                </Box>
                <Divider />
                {page?.content?.equipSection?.bottomRight?.link && (
                  <HStack w="100%" p={4} justifyContent="flex-end">
                    <NextLink
                      passHref={true}
                      href={
                        page?.content?.equipSection?.bottomRight?.link ?? ""
                      }
                    >
                      <Button
                        p={2}
                        variant="ghost"
                        rightIcon={<AiOutlineArrowRight />}
                      >
                        {wordExtractor(
                          page?.content?.wordings,
                          "understand_more_label"
                        )}
                      </Button>
                    </NextLink>
                  </HStack>
                )}
              </VStack>
            </GridItem>
          </Grid>
        </Box>
        <Image
          alt=""
          pos="absolute"
          right={["-5%", "-10%", "-35%"]}
          bottom="-30%"
          w="100%"
          src={page?.content?.equipSection?.image}
        />
      </Box>
      {/* jobOportunity Setting */}
      <Box
        pt={["90px", "90px", "45px"]}
        background="#F6D644"
        display="flex"
        flexDirection="column"
        alignItems="center"
        pos="relative"
        zIndex="0"
        overflow="hidden"
      >
        <Heading fontSize={["24px", "24px", "36px"]} zIndex={100}>
          {page?.content?.jobOpportunitySection?.title}
        </Heading>

        <Text
          textAlign="center"
          pt="24px"
          fontSize="16px"
          px={["16px", "16px", "0px"]}
          mx="auto"
          maxW={{ lg: "83%", md: "90%" }}
          zIndex={100}
        >
          {page?.content?.jobOpportunitySection?.description}
        </Text>
        <Flex
          pb={["90px", "90px", "53px"]}
          gridGap="24px"
          flexDirection={["column", "column", "row", "row"]}
          mt={["36px", "36px", "68px"]}
        >
          {(page?.content?.jobOpportunitySection?.buttons ?? []).map(
            ({ label, link }, index) => {
              return (
                <Link key={index} href={link}>
                  <Button
                    zIndex="100"
                    borderRadius="22px"
                    color="#1E1E1E"
                    bg="transparent"
                    key={index}
                    fontWeight={["normal", "semibold"]}
                    border="2px solid #1E1E1E"
                    _hover={{ bg: "#FFFFFF", borderColor: "#FFFFFF" }}
                    fontSize="23px"
                  >
                    {label}
                  </Button>
                </Link>
              );
            }
          )}
        </Flex>
        <Image
          alt=""
          top="0"
          src={page?.content?.jobOpportunitySection?.image}
          pos="absolute"
          bottom="0"
          zIndex="1"
        />
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <CloseIcon
              onClick={() => onClose()}
              position="absolute"
              top={"15px"}
              right={"15px"}
              cursor={"pointer"}
            />
            <VStack px={2} alignItems="stretch">
              <ModalCard
                name={modalData?.name}
                topColor={modalData?.topColor}
                organization={modalData?.organization}
                category={modalData?.category}
                serviceTarget={modalData?.serviceTarget}
                services={modalData?.services}
                internship={modalData?.internship}
                probationOrReferral={modalData?.probationOrReferral}
                subsidy={modalData?.subsidy}
                remark={modalData?.remark}
                contact={modalData?.contact}
                reminder={modalData?.reminder}
                page={page}
              />
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

const TableRow = ({
  name,
  organization,
  serviceTarget,
  services,
  internship,
  probationOrReferral,
  subsidy,
  resource,
  handleRowOnClick,
}) => {
  const disableClick = {
    pointerEvents: "none",
  };
  const rowStyle = {
    borderBottom: "1px solid #EAEAEA",
    cursor: "pointer",
    boxShadow: "0 0 15px 1px rgb(0 0 0 / 15%)",
  };

  const [active, setActive] = useState(false);

  return (
    <Tr
      key={resource?.id}
      style={{
        ...rowStyle,
        boxShadow: active ? "0 0 15px 1px rgb(0 0 0 / 15%)" : "",
      }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={() => handleRowOnClick(resource)}
    >
      <Td style={{ width: "200px", padding: "0 15px" }}>{name?.text}</Td>
      <Td style={{ width: "200px", padding: "0 15px" }}>
        {organization?.text}
      </Td>
      <Td style={{ width: "200px", padding: "0 15px" }}>
        {serviceTarget?.text}
      </Td>
      <Td style={{ textAlign: "center" }}>
        <Checkbox
          size="md"
          colorScheme="green"
          defaultChecked={services?.length > 0}
          style={disableClick}
        />
      </Td>
      <Td style={{ textAlign: "center" }}>
        <Checkbox
          size="md"
          colorScheme="green"
          defaultChecked={internship?.value}
          style={disableClick}
        />
      </Td>
      <Td style={{ textAlign: "center" }}>
        <Checkbox
          size="md"
          colorScheme="green"
          defaultChecked={probationOrReferral}
          style={disableClick}
        />
      </Td>
      <Td style={{ minWidth: "80px", textAlign: "center" }}>
        <div style={{ height: "100px", margin: "20px 0" }}>
          <Center h={"100%"}>
            <Checkbox
              size="md"
              colorScheme="green"
              defaultChecked={subsidy?.length > 0}
              style={disableClick}
            />
          </Center>
        </div>
      </Td>
    </Tr>
  );
};

export default withPageCMS(Resources, {
  key: PAGE_KEY,
  fields: (props) => resourceFieldsForCMS(props),
});
