import { Text, Box, VStack } from "@chakra-ui/react";
import moment from "moment";
import IdentityProfileStore from "../../../store/IdentityProfileStore";
import Dot from "./Dot";

const ActvitySubSectionViewer = () => {
  const { identity } = IdentityProfileStore.useContext();

  return (
    <VStack spacing={4} width={["100%", "50%"]} align="stretch">
      <VStack pl={2} spacing={0} align="stretch">
        {(identity?.activity ?? []).map(
          ({ startDatetime, name, description }, index) => {
            const borderColor = "#eee";
            return (
              <Box
                pl={2}
                key={index}
                borderLeftColor={borderColor}
                borderLeftWidth={2}
                position="relative"
              >
                <Dot
                  position="absolute"
                  top={"-5px"}
                  left={"-5px"}
                  h={"8px"}
                  w={"8px"}
                  bgColor={borderColor}
                />
                <VStack
                  pl={2}
                  mt={-3}
                  mb={8}
                  spacing={0.5}
                  fontSize={["lg", "sm"]}
                  spacing={0}
                  align="start"
                >
                  <Text color="#aaa">
                    {moment(startDatetime).format("DD/MM/YYYY")}
                  </Text>
                  <Text fontSize={"md"} fontFamily="SFNSDisplay" pt={2}>{name}</Text>
                  <Text fontSize={"md"}  whiteSpace="pre-line" fontFamily="SFNSDisplay">
                    {description}
                  </Text>
                </VStack>
              </Box>
            );
          }
        )}
      </VStack>
    </VStack>
  );
};

export default ActvitySubSectionViewer;
