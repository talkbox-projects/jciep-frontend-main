import { Heading, Box, Image } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/layout";
import Accordian from "./Acordian";
const AccordianContainer = ({ image, title, accordians }) => {
  return (
    <Box>
      <VStack w="100%" spacing={0} align="stretch" alignItems={["center", "center", "start", "start"]}>
        <Image w={["130px", "120px", "110px", "100px"]} src={image} />
        <Heading as="h4" fontWeight="normal">
          {title}
        </Heading>
        {(accordians ?? []).map((d, i) => {
          return <Accordian bgColor="#FAFAFA" key={i} title={d.title} description={d.description} link={d.links} />;
        })}
      </VStack>
    </Box>
  );
};

export default AccordianContainer;
