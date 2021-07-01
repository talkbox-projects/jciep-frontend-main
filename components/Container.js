import { Box } from "@chakra-ui/layout";

const Container = ({ children, ...props }) => {
  return (
    <Box
      px={(0.5, 0.5, 1, 2)}
      maxWidth={[576, 640, 768, 1024, 1024]}
      w="100%"
      mx="auto"
      {...props}
    >
      {children}
    </Box>
  );
};

export default Container;
