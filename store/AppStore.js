import { useDisclosure } from "@chakra-ui/react";
import constate from "constate";

const [AppProvider, useAppContext] = constate(() => {
  const loginModalDisclosure = useDisclosure();

  return {
    loginModalDisclosure,
  };
});

export { AppProvider, useAppContext };
