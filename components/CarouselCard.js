import React from "react";
import { useState } from "react";
import {
  Box,
  VStack,
  Divider,
  HStack,
  UnorderedList,
  ListItem,
} from "@chakra-ui/layout";
import { Text, Image, chakra, Link, Icon, Tooltip } from "@chakra-ui/react";
import { FaShareSquare } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { motion } from "framer-motion";
import wordExtractor from "../utils/wordExtractor";

const MotionBox = motion(Box);

const TextTool = ({
  text,
  link,
  url,
  description,
  pt,
  fontSize,
  hover,
  share,
  bold,
  small,
}) => {
  return (
    <Text pt={pt} color="#1E1E1E" whiteSpace="pre-line">
      {link && (
        <chakra.span
          _hover={hover ? { cursor: "pointer", decoration: "underline" } : ""}
          fontSize={fontSize}
          fontWeight={bold ? "bold" : "normal"}
        >
          <Link isExternal={true} href={url}>
            {" "}
            {text}
          </Link>
        </chakra.span>
      )}
      {!link && (
        <chakra.span
          _hover={hover ? { cursor: "pointer", decoration: "underline" } : ""}
          fontSize={fontSize}
          fontWeight={bold ? "bold" : "normal"}
        >
          {text}
        </chakra.span>
      )}
      {share && (
        <chakra.span pl="3px">
          <Icon w="15px" h="13px">
            <FaShareSquare />
          </Icon>
        </chakra.span>
      )}
      {description && description !== "" && (
        <chakra.span pl="6px">
          <Tooltip hasArrow label={description} bg="#1E1E1E" color="#FFFFFF">
            <Icon
              mt={small ? "5px" : "5px"}
              w={small ? "16px" : "24px"}
              h={small ? "16px" : "24px"}
            >
              <AiOutlineInfoCircle />
            </Icon>
          </Tooltip>
        </chakra.span>
      )}
    </Text>
  );
};

const Card = ({
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
  page,
}) => {
  const [show, setShow] = useState(false);
  return (
    <Box
      borderTop={`8px solid ${topColor ? topColor : "#4E7F8E"}`}
      boxShadow="12px 12px 24px 0px rgba(30,30,30,0.1)"
      borderRadius="10px"
      mb="8px"
      mr={["", "", "24px"]}
    >
      <Box minH="620px" borderRadius="10px" bg="#FFFFFF">
        <VStack borderRadius="10px" alignItems="start" px="16px" w="100%">
          <VStack w="100%" minH="620px" alignItems="start">
            <Text pt="40px" h="58px" color={topColor}>
              {wordExtractor(
                page?.content?.wordings,
                "resource_group_" + category
              )}
            </Text>
            <TextTool
              text={name?.text}
              link
              url={name?.link}
              fontSize={["20px", "20px", "24px", "24px"]}
              description={name?.description}
              pt="8px"
              hover
              bold
              share={true}
            />
            <Divider />
            <HStack spacing="5px">
              <Image
                w="24px"
                h="24px"
                src={
                  page?.content?.resourceSection?.resourceListIcons
                    ?.organization
                }
              />
              <TextTool
                share={true}
                text={organization?.text}
                description={organization?.description}
                fontSize="16px"
              />
            </HStack>
            <Divider />
            <HStack spacing="5px">
              <Image
                w="24px"
                h="24px"
                src={page?.content?.resourceSection?.resourceListIcons?.avatar}
              />

              <TextTool
                text={serviceTarget?.text}
                description={serviceTarget?.description}
                fontSize="16px"
              />
            </HStack>
            <Divider />
            <Box
              w="100%"
              // minH="281px"
            >
              <UnorderedList m={0} pt="8px">
                <HStack spacing="5px">
                  <Image
                    w="24px"
                    h="24px"
                    src={
                      page?.content?.resourceSection?.resourceListIcons?.tick
                    }
                  />
                  <TextTool
                    text={wordExtractor(
                      page?.content?.wordings,
                      "serviceHeading"
                    )}
                    fontSize="16px"
                  />
                </HStack>
                {(services ?? []).map(({ category, description }, index) => {
                  return (
                    <ListItem
                      display="flex"
                      _before={{
                        content: '"."',
                        color: "black",
                        pr: "6px",
                        fontWeight: "bold",
                        fontSize: "12px",
                      }}
                      key={index}
                      ml="40px"
                    >
                      <TextTool
                        text={wordExtractor(
                          page?.content?.wordings,
                          "category_" + category
                        )}
                        description={description}
                        fontSize="12px"
                        small
                      />
                    </ListItem>
                  );
                })}
              </UnorderedList>
              {internship?.value && (
                <HStack pt="8px" spacing="5px">
                  <Image
                    w="24px"
                    h="24px"
                    src={
                      page?.content?.resourceSection?.resourceListIcons?.tick
                    }
                  />

                  <TextTool
                    text={wordExtractor(page?.content?.wordings, "internship")}
                    description={internship?.description}
                    fontSize="16px"
                  />
                </HStack>
              )}
              {probationOrReferral?.value && (
                <HStack pt="8px" spacing="5px">
                  <Image
                    w="24px"
                    h="24px"
                    src={
                      page?.content?.resourceSection?.resourceListIcons?.tick
                    }
                  />

                  <TextTool
                    text={wordExtractor(page?.content?.wordings, "onProbation")}
                    description={probationOrReferral?.description}
                    fontSize="16px"
                  />
                </HStack>
              )}
              {subsidy?.length > 0 && (
                <UnorderedList pt="8px" m={0} listStyleType="none">
                  <HStack spacing="5px">
                    <Image
                      w="24px"
                      h="24px"
                      src={
                        page?.content?.resourceSection?.resourceListIcons?.tick
                      }
                    />

                    <TextTool
                      text={wordExtractor(
                        page?.content?.wordings,
                        "fundingHeading"
                      )}
                      fontSize="16px"
                    />
                  </HStack>
                  {(subsidy ?? []).map(({ target, description }, index) => {
                    return (
                      <ListItem
                        display="flex"
                        _before={{
                          content: '"."',
                          color: "black",
                          pr: "6px",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                        key={index}
                        ml="40px"
                      >
                        <TextTool
                          text={wordExtractor(
                            page?.content?.wordings,
                            "target_" + target
                          )}
                          description={description}
                          fontSize="12px"
                          small
                        />
                      </ListItem>
                    );
                  })}
                </UnorderedList>
              )}
            </Box>
            <MotionBox
              overflow="hidden"
              height={0}
              transition={{ duration: 0.5 }}
              alignItems="start"
              spacing={0}
              w="100%"
              {...(show && { animate: { height: "auto" } })}
            >
              <Divider />
              <HStack pt="8px" spacing="5px" align="start">
                <Image
                  w="24px"
                  h="20px"
                  src={
                    page?.content?.resourceSection?.resourceListIcons?.contact
                  }
                />
                <Text color="#1E1E1E" fontSize="16px">
                  {wordExtractor(page?.content?.wordings, "contactHeading")}
                </Text>
              </HStack>
              <Text
                pl="27px"
                whiteSpace="pre-line"
                color="#1E1E1E"
                fontSize="16px"
              >
                {contact?.text}
              </Text>
              <VStack pl="27px" alignItems="start">
                <Text color="#1E1E1E" fontSize="12px">
                  {contact?.description}
                </Text>
                <Text d="inline" pt="24px" color="#1E1E1E" fontSize="12px">
                  <chakra.a href={contact?.url} target="_blank">
                    {contact?.linkName}
                    <Icon pl={1} size="sm" as={FaShareSquare} />
                  </chakra.a>
                </Text>
              </VStack>
              <HStack pt="32px" spacing="5px">
                <Image
                  w="24px"
                  h="20px"
                  src={
                    page?.content?.resourceSection?.resourceListIcons?.remarks
                  }
                />

                <Text color="#1E1E1E" fontSize="16px">
                  {wordExtractor(page?.content?.wordings, "remarkHeading")}
                </Text>
              </HStack>

              <Text
                pl="27px"
                whiteSpace="pre-line"
                color="#1E1E1E"
                fontSize="12px"
              >
                {remark}
              </Text>
            </MotionBox>
            <Box pt="32px"></Box>
          </VStack>
        </VStack>
        <Box>
          <Divider />
          <Text
            pb="10px"
            cursor="pointer"
            onClick={() => setShow(!show)}
            textAlign="center"
            w="100%"
            mt="10px"
            fontSize="16px"
          >
            {show
              ? wordExtractor(page?.content?.wordings, "showLess")
              : wordExtractor(page?.content?.wordings, "showMore")}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Card;
