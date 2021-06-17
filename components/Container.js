import { Box } from "@chakra-ui/layout";
import { chakra } from "@chakra-ui/react";

const Container = ({ children }) => {
  return (
    <Box px={(0.5, 0.5, 1, 2)} maxWidth={1024} w="100%" mx="auto">
      {children}
    </Box>
  );
};

export default chakra(Container);
