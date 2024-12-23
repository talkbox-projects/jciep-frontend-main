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
import {
  Button,
  Text,
  Image,
  chakra,
  Link,
  Icon,
  IconButton,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
} from "@chakra-ui/react";
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
  className = "",
  minHeight = "auto",
  small,
  ariaLabel,
  isActive,
}) => {
  const tooltipDisclosure = useDisclosure();
  const [isLabelOpen, setIsLabelOpen] = useState(false);

  return (
    <Text
      pt={pt}
      className={className}
      color="#1E1E1E"
      whiteSpace="pre-line"
      minHeight={minHeight}
    >
      {link && (
        <chakra.span
          _hover={hover ? { cursor: "pointer", decoration: "underline" } : ""}
          fontSize={fontSize}
          fontWeight={bold ? "bold" : "normal"}
        >
          <Link
            {...(!isActive && { tabIndex: -1 })}
            isExternal={true}
            href={url}
          >
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
          <Icon w="24px" h="24px">
            <FaShareSquare />
          </Icon>
        </chakra.span>
      )}
      {description && description !== "" && (
        <chakra.span pl="6px">
          <Popover trigger="hover">
            <PopoverTrigger>
              <IconButton
                aria-label={ariaLabel}
                icon={<AiOutlineInfoCircle />}
                variant="link"
                size={2}
                onClick={() => setIsLabelOpen(true)}
                {...(!isActive && { tabIndex: -1 })}
              ></IconButton>
            </PopoverTrigger>
            <PopoverContent fontSize="sm" bg="black" color="white">
              <PopoverArrow bg="black" />
              <PopoverBody>{description}</PopoverBody>
            </PopoverContent>
          </Popover>
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
  isActive,
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
      <Box minH="705px" borderRadius="10px" bg="#FFFFFF">
        <VStack borderRadius="10px" alignItems="start" px="16px" w="100%">
          <VStack w="100%" minH="710px" alignItems="start">
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
              className="carousel-card-header"
              bold
              share={true}
              isActive={isActive}
            />
            <Divider />
            <HStack spacing="5px">
              <Image
                alt=""
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
                link={organization?.link}
                url={organization?.link}
                fontSize="16px"
                isActive={isActive}
              />
            </HStack>
            <Divider />
            <HStack spacing="5px">
              <Image
                alt=""
                w="24px"
                h="24px"
                src={page?.content?.resourceSection?.resourceListIcons?.avatar}
              />

              <TextTool
                text={serviceTarget?.text}
                description={serviceTarget?.description}
                fontSize="16px"
                ariaLabel={"殘疾人士定義提示"}
                isActive={isActive}
              />
            </HStack>
            <Divider />
            <Box w="100%">
              <UnorderedList m={0} pt="8px">
                <HStack spacing="5px">
                  <Image
                    alt=""
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
                    isActive={isActive}
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
                        isActive={isActive}
                      />
                    </ListItem>
                  );
                })}
              </UnorderedList>
              {internship?.value && (
                <HStack pt="8px" spacing="5px">
                  <Image
                    alt=""
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
                    isActive={isActive}
                  />
                </HStack>
              )}
              {probationOrReferral?.value && (
                <HStack pt="8px" spacing="5px">
                  <Image
                    alt=""
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
                    isActive={isActive}
                  />
                </HStack>
              )}
              {subsidy?.length > 0 && (
                <UnorderedList pt="8px" m={0} listStyleType="none">
                  <HStack spacing="5px">
                    <Image
                      alt=""
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
                      isActive={isActive}
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
                          ariaLabel={
                            target === "employer"
                              ? "僱主津貼提示"
                              : target === "trainee"
                              ? "僱員/實習生/訓練生津貼提示"
                              : ""
                          }
                          isActive={isActive}
                        />
                      </ListItem>
                    );
                  })}
                </UnorderedList>
              )}
            </Box>
            {show && (
              <MotionBox
                overflow="hidden"
                height={0}
                transition={{ duration: 0.5 }}
                alignItems="start"
                spacing={0}
                w="100%"
                {...(show ? { animate: { height: "auto" } } : { d: "none" })}
              >
                <Divider />
                <HStack pt="8px" spacing="5px" align="start">
                  <Image
                    alt=""
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
                    <chakra.a href={contact?.link} target="_blank">
                      {contact?.linkName}
                      <Icon pl={1} size="sm" as={FaShareSquare} />
                    </chakra.a>
                  </Text>
                </VStack>
                <HStack pt="32px" spacing="5px">
                  <Image
                    alt=""
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
            )}
            <Box pt="32px"></Box>
          </VStack>
        </VStack>
        <Box>
          <Divider />
          <Button
            color="black"
            variant="link"
            pb="10px"
            cursor="pointer"
            onClick={() => setShow(!show)}
            textAlign="center"
            w="100%"
            mt="10px"
            fontSize="16px"
            {...(!isActive && { tabIndex: -1 })}
          >
            {show
              ? wordExtractor(page?.content?.wordings, "showLess")
              : wordExtractor(page?.content?.wordings, "showMore")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Card;
