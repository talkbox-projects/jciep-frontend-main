import React from "react";
import { useAppContext } from "../store/AppStore";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  Center,
  Grid,
  GridItem,
  Text,
  Box,
  Stack,
} from "@chakra-ui/react";
import { useRouter } from 'next/router'

const UserGroupModal = () => {
  const { userGroupModalDisclosure } = useAppContext();
  const { params } = userGroupModalDisclosure;
  const router = useRouter()
  return (
    <>
      <Modal
        isOpen={userGroupModalDisclosure.isOpen}
        onClose={userGroupModalDisclosure.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton aria-label={router.locale === 'zh' ? "關閉" : "close"}/>
          <ModalBody py={6}>
            <Box>
              <Center>
                <Stack direction="column">
                  <Image
                    alt={params?.name}
                    w={100}
                    src={params?.icon}
                    mx={"auto"}
                    py={4}
                  />
                  <Box py={2} textAlign="center">
                    <Text fontWeight={700} fontSize={20}>
                      {params?.name}
                    </Text>
                  </Box>
                </Stack>
              </Center>
              <Grid
                templateRows="repeat(2, 1fr)"
                templateColumns="repeat(2, 1fr)"
                gap={2}
                py={4}
              >
                {params?.links?.map((d) => (
                  <GridItem key={d?.id} colSpan={router.locale === 'zh' ? 1 : 2}>
                    <Button
                      variant="outline"
                      whiteSpace="pre-line"
                      w={"100%"}
                      fontSize={16}
                      p={6}
                      borderRadius={"12px"}
                      borderWidth={"2px"}
                      fontWeight={500}
                      onClick={() =>  {
                        router.push(d?.link)
                        userGroupModalDisclosure.onClose()
                        }}
                    >
                    {d?.name}
                    </Button>
                  </GridItem>
                ))}
              </Grid>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserGroupModal;
