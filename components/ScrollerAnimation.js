import React from "react";
import { Box, Text, VStack } from "@chakra-ui/layout";
import {
  SimpleGrid,
  chakra,
  GridItem,
  Heading,
  Image,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
// import { Scroll } from  "framer";

const MotionBox = motion(Box);
const MotionImage = motion(Image);

const ScrollerAnimation = ({ headline, title, roles, partialLogo, logo, caption, endTitle }) => {
  let Scroll = () => <div></div>;
  let Frame = () => <div></div>;
  if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
    Scroll = require('framer').Scroll;
    Frame = require('framer').Frame;

  }

  const onScroll = (info) => {
    console.log(info.offset, info.velocity)
  }

  return (
    <Scroll width="100%" height="100vh" onScroll={onScroll} direction="vertical">
      {/* Second Section */}
      <MotionBox bg="#efefef">
        <MotionBox px={(0.5, 0.5, 1, 2)} maxWidth={1024} w="100%" mx="auto">
          <VStack align="center" py={16}>
            <Heading as="h4">
              {headline}
            </Heading>
            <Text
              pt={16}
              textAlign="center"
              fontSize={["xl", "3xl", "5xl", "5xl"]}
            >
              {(title ?? []).map(
                ({ _template, content, textcolor, bold }, index) => {
                  switch (_template) {
                    case "textBlock":
                      return (
                        <Text
                          d="inline"
                          key={index}
                          textColor={textcolor}
                          {...(bold && { fontWeight: "bold" })}
                        >
                          {content}
                        </Text>
                      );
                    case "lineBreakBlock":
                      return <br key={index} />;
                    default:
                  }
                }
              )}
            </Text>
            <SimpleGrid pt={16} columns={[2, 2, 2, 4]} spacing={8}>
              {(roles ?? []).map(
                ({ icon, name, caption }, index) => {
                  return (
                    <GridItem key={index}>
                      <VStack>
                        <MotionImage w={100} src={icon}></MotionImage>
                        <Text fontSize={["lg"]} fontWeight="bold">
                          {name}
                        </Text>
                        <Text textAlign="center">{caption}</Text>
                      </VStack>
                    </GridItem>
                  );
                }
              )}
            </SimpleGrid>
          </VStack>
        </MotionBox>
      </MotionBox>

      {/* Third Section */}
      <MotionBox bg="#fff">
        <MotionBox px={(0.5, 0.5, 1, 2)} maxWidth={1024} w="100%" mx="auto">
          <VStack align="center" py={32}>
            <MotionImage
              maxW="480"
              w="80%"
              src={partialLogo}
              display="none"
            />
            <MotionImage
              maxW="480"
              w="80%"
              src={logo}
            ></MotionImage>
            <Heading pt={8} as="h4" fontSize={["2xl", "3xl", "4xl"]}>
              {endTitle}
            </Heading>
            <Text
              w="80%"
              pt={8}
              textAlign="center"
              fontSize={["md", "lg", "2xl"]}
            >
              {(caption ?? []).map(
                ({ _template, content, textcolor, bold }, index) => {
                  switch (_template) {
                    case "textBlock":
                      return (
                        <Text
                          d="inline"
                          key={index}
                          textColor={textcolor}
                          {...(bold && { fontWeight: "bold" })}
                        >
                          {content}
                        </Text>
                      );
                    case "lineBreakBlock":
                      return <br key={index} />;
                    default:
                  }
                }
              )}
            </Text>
          </VStack>
        </MotionBox>
      </MotionBox>
    </Scroll>
  )
}

export default ScrollerAnimation;
