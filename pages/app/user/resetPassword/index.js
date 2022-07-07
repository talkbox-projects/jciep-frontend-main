import { useAppContext } from "../../../../store/AppStore";
import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  Text,
  VStack,
  Button,
  Box,
  Flex,
} from "@chakra-ui/react";
import { useGetWording } from "../../../../utils/wordings/useWording";
import EmailResetFlow from "./email";
import PhoneResetFlow from "./phone";

const RenderResetFlow = ({ method }) => {
  switch (method) {
    case "email":
      return <EmailResetFlow />;

    case "phone":
      return <PhoneResetFlow />;

    default:
      return <></>;
  }
};

const ResetPasswordSelector = ({ setResetMethod }) => {
  const getWording = useGetWording();
  return (
    <Box py={{ base: 24 }}>
      <Box mb={{ base: 4 }}>
        <Text
          fontSize="24px"
          letterSpacing="1.5px"
          fontWeight={600}
          px={"15px"}
        >
          {getWording("resentPassword.reset_password_selector_title")}
        </Text>
        <Text color="#757575" w="100%" fontSize="sm" px={"15px"}>
          {getWording("resentPassword.reset_password_selector_description")}
        </Text>
      </Box>
      <Box width="100%" background="#FFF">
        <VStack spacing={8}>
          <Box px={"15px"} width="100%">
            <FormControl>
              <FormLabel m={0} p={0}>
                {getWording("resentPassword.reset_password_selector_label")}
              </FormLabel>

              <Flex gap={2} py={4}>
                <Button
                  flex={1}
                  backgroundColor={"transparent"}
                  border={`2px solid #999999`}
                  height="38px"
                  onClick={() => setResetMethod("email")}
                >
                  {getWording("resentPassword.email_method_label")}
                </Button>
                <Button
                  flex={1}
                  backgroundColor={"transparent"}
                  border={`2px solid #999999`}
                  height="38px"
                  onClick={() => setResetMethod("phone")}
                >
                  {getWording("resentPassword.mobile_method_label")}
                </Button>
              </Flex>
            </FormControl>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

const ResetPasswordPage = () => {
  const [resetMethod, setResetMethod] = useState("");
  return (
    <Box>
      {resetMethod === "" && (<ResetPasswordSelector
        resetMethod={resetMethod}
        setResetMethod={setResetMethod}
      />)}
      <RenderResetFlow method={resetMethod} />
    </Box>
  );
};

export default ResetPasswordPage;
