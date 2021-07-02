import { Box } from "@chakra-ui/layout";
import { chakra, styled } from "@chakra-ui/react";

const Container = ({ children, ...props }) => {
  return (
    <Box px={(0.5, 0.5, 1, 2)} maxWidth={1200} w="100%" mx="auto" {...props}>
      {children}
    </Box>
  );
};

export default Container;
