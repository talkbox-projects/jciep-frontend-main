import { Box } from "@chakra-ui/layout";
import { Button, Icon } from "@chakra-ui/react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

const ButtonGroup = ({ next, previous, goToSlide, ...rest }) => {
  const {
    carouselState: { currentSlide, slidesToShow },
  } = rest;
  return (
    <Box pos="absolute" w="100%" display="flex">
      <Button
        pos="relative"
        disabled={currentSlide === 0}
        onClick={() => previous()}
        w="56px"
        h="56px"
        borderRadius="50%"
        display="flex"
        justifyContent="center"
        p="0"
        alignItems="center"
        pl="7px"
        pt="4px"
        marginLeft="calc(4% - 1px)"
        zIndex={1000}
        bg="#fff"
        boxShadow="12px 12px 24px 0 rgba(30,30,30,0.1)"
      >
        <Icon w="28px" h="24.5px">
          <FaArrowLeft />
        </Icon>
      </Button>
      <Button
        pos="relative"
        disabled={currentSlide >= slidesToShow}
        onClick={() => next()}
        w="56px"
        h="56px"
        borderRadius="50%"
        display="flex"
        justifyContent="center"
        p="0"
        alignItems="center"
        pl="7px"
        pt="4px"
        marginRight="calc(4% - 1px)"
        zIndex={1000}
        bg="#fff"
        boxShadow="12px 12px 24px 0 rgba(30,30,30,0.1)"
      >
        <Icon w="28px" h="24.5px">
          <FaArrowRight />
        </Icon>
      </Button>
    </Box>
  );
};

export default ButtonGroup;
