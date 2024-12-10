import React, { useCallback, useEffect, useRef } from "react";
import {
	VStack,
	Box,
	Heading,
	Text,
	Button,
	Container,
} from "@chakra-ui/react";
import withPageCMS from "../../utils/page/withPageCMS";
import { useRouter } from "next/router";

import NextLink from "next/link";
import { NextSeo } from "next-seo";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";

const PAGE_KEY = "newPage";

export const getServerSideProps = async (context) => {
	console.log("this is from server");
	return {
		props: {
			...(await getSharedServerSideProps(context))?.props,
		},
	};
};

const NewPage = () => {
	const router = useRouter();

	return (
		<VStack w="100%" align="stretch" spacing={0}>
			<Box pos="relative" pt="20rem">
				<Heading>This is new page</Heading>
			</Box>
		</VStack>
	);
};

export default withPageCMS(NewPage, {
	key: PAGE_KEY,
	fields: [],
});
