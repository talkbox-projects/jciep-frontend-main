import { Box, chakra } from "@chakra-ui/react";
const BorderedTitle = ({ title, color, width, mobileWidth, right }) => {
  return (
    <Box textAlign="center" pos="relative" fontSize={["22", "30", "36"]} w={["80%", "80%", "100%"]} mx={["20", "30"]}>
      <chakra.span pos="relative">
        <chakra.span
          background={color}
          width={width}
          pos="absolute"
          height={["0%", "67%"]}
          bottom="-2"
          right="-1"
          zIndex="1"
        />
        <chakra.span fontWeight="semibold" zIndex="2" pos="relative">
          {title}
        </chakra.span>
      </chakra.span>
      {/* Mobile view highlight spans*/}
      <chakra.span
        background={color}
        width={mobileWidth}
        pos="absolute"
        height={["50%", "0%"]}
        top="5"
        right={right}
        zIndex="1"
      />
    </Box>
  );
};
export default BorderedTitle;
