import { Accordion, AccordionItem, AccordionButton, Box, Text, Link, AccordionPanel } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { VStack } from "@chakra-ui/layout";
import MultiTextRenderer from "./MultiTextRenderer";
const Accordian = ({ title, description, link, bgColor, multi, fontSize, boldTitle, textAlign }) => {
  return (
    <Accordion zIndex="10000" pt="10px" allowToggle allowMultiple border="transparent" w="100%">
      <AccordionItem _hover={{ borderRadius: "10px", bg: bgColor }} borderRadius="10px" bg={bgColor}>
        {({ isExpanded }) => (
          <>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Text fontWeight={boldTitle ?? "bold"} textAlign={textAlign}>
                    {title}
                  </Text>
                </Box>
                {isExpanded ? <MinusIcon fontSize="12px" /> : <AddIcon fontSize="12px" />}
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Box>
                {multi ? (
                  <MultiTextRenderer data={description} fontSize={fontSize} bgColor={bgColor} textAlign="center" />
                ) : (
                  <Text>{description}</Text>
                )}

                <VStack pt="10" alignItems="start" justifyContent="left">
                  {(link ?? []).map((data, index) => {
                    return (
                      <Link cursor="pointer" display="block" color="#007878" href={data.url} key={index}>
                        {data.label}
                      </Link>
                    );
                  })}{" "}
                </VStack>
              </Box>
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
};

export default Accordian;
