import React from "react";
import { Box, useBreakpointValue } from "@chakra-ui/react";

const HoverCard = ({
  children,
  mobileProps,
  desktopProps,
  isMobileBreakPointValue = [true, true, false, false],
}) => {
  const isMobile = useBreakpointValue(isMobileBreakPointValue);

  return isMobile ? (
    <>{children({ isMobile })}</>
  ) : (
    // <Box
    //   w="100%"
    //   h="fit-content"
    //   bottom="0px"
    //   left="0px"
    //   position="fixed"
    //   borderTopRadius="lg"
    //   boxShadow="0px 5px 15px gray"
    //   bg="white"
    //   zIndex={10}
    //   {...mobileProps}
    // >
    //   {children({ isMobile })}
    // </Box>
    <Box
      w="fit-content"
      h="fit-content"
      position="sticky"
      top="0"
      left="0"
      // top="20px"
      // right="20px"
      // ml={12}
      // bg="white"
      // borderRadius="lg"
      // boxShadow="xl"
      {...desktopProps}
    >
      {children({ isMobile })}
    </Box>
  );
};

export default HoverCard;
