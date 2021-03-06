import { Button, Box, Image, Heading, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

// export const getStaticProps = async (context) => {
//   return {
//     props: {
//       page: await getPage({ key: PAGE_KEY, lang: context.locale }) ?? {},
//       wordings: await getConfiguration({
//         key: "wordings",
//         lang: context.locale,
//       }),
//       header: await getConfiguration({ key: "header", lang: context.locale }),
//       footer: await getConfiguration({ key: "footer", lang: context.locale }),
//       navigation: await getConfiguration({
//         key: "navigation",
//         lang: context.locale,
//       }),
//     },
//   };
// };

const Custom404 = () => {
  return (
    <VStack py={80} backgroundColor="#fafafa">
      <Box justifyContent="center" width="100%">
        <Box
          maxWidth={470}
          width="100%"
          textAlign="center"
          margin="auto"
          padding="0 25px"
        >
          <Heading as="span" textAlign="center">
            404 錯誤
          </Heading>

          <Image
            alt="404"
            height="150px"
            width="150px"
            marginTop="50px !important"
            margin="auto"
            src="./images/404.png"
          />

          <Text marginTop="60px">找不到你想查找的網頁. 很抱歉！</Text>

          <Box width="100%" textAlign="center" marginBottom="120px">
            <Link href="/">
              <Button
                color="#1E1E1E"
                boxSizing="border-box"
                height="46px"
                border="2px solid #C6C6C6"
                marginTop="30px !important"
                borderRadius="50px"
                bgColor="primary.400"
              >
                返回主頁
              </Button>
            </Link>
          </Box>


        </Box>
      </Box>
    </VStack>
  );
};

export default Custom404;
