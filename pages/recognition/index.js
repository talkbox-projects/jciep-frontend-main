import React, { useCallback, useEffect, useRef } from "react";
import {
	Link,
	Heading,
	HStack,
	Text,
	Image,
	Icon,
	Tag,
	AspectRatio,
	Divider,
	Button,
	chakra,
	Box,
	Container,
	VStack,
	Wrap,
	Flex,
} from "@chakra-ui/react";
import { getYoutubeLink } from "../../utils/general";
import withPageCMS from "../../utils/page/withPageCMS";
import { useRouter } from "next/router";
import { getPage } from "../../utils/page/getPage";
import ApostropheHeadline from "../../components/ApostropheHeadline";

import NextLink from "next/link";
import { NextSeo } from "next-seo";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";
import recognitionFieldsForCMS from "../../utils/tina/recognitionFieldsForCMS";

const PAGE_KEY = "recognition";

export const getServerSideProps = async (context) => {
	const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};
	console.log(page);
	return {
		props: {
			page,
			isLangAvailable: context.locale === page.lang,
			isShowLangSwitcher: true,
			...(await getSharedServerSideProps(context))?.props,
		},
	};
};

const PageHeader = ({ page }) => {
	return (
		<Box w="100%" position="relative" bgColor="#f1ca7b" minH="520px">
			<Flex
				flexDir={"column"}
				display={"flex"}
				pt={["10rem", "10rem", "12rem", "15rem"]}
				w="full"
				maxW="1008px"
				margin="auto"
				px="1rem"
				gap="1rem"
				pb="2rem"
			>
				<Heading fontSize="5xl" fontWeight="bold">
					{page?.content?.pageTitle}
				</Heading>
				<Text fontSize="xl">{page?.content?.headerGroup?.excerpt}</Text>
				{page?.content?.headerGroup?.headerButtonLabel && (
					<Button
						mt={3}
						as={Link}
						borderRadius="full"
						color="#000"
						bg="transparent"
						variant="outline"
						_hover={{
							bg: "rgba(255,255,255, 0.3)",
						}}
						borderColor="#000"
						maxW="242px"
						href={page?.content?.headerGroup?.headerButtonLink}
					>
						{page?.content?.headerGroup?.headerButtonLabel}
					</Button>
				)}
			</Flex>
		</Box>
	);
};

const Recognition = ({ page }) => {
	const router = useRouter();

	console.log({ page });

	return (
		<VStack w="100%" spacing={0} align="center" pb={16} bgColor="#fafafa">
			<PageHeader page={page} />
			<Container pt={16} pb={32} maxW="1008px" position="relative">
				{/* <Flex flexDir={"column"} gap="1rem">
					{page?.content?.content?.blocks?.map((ct, index) => {
						if (ct?._template === "heading-block") {
							return (
								<Heading w="full" textAlign="center">
									{ct?.content}
								</Heading>
							);
						}
						return (
							<Box
								key={index}
								dangerouslySetInnerHTML={{ __html: ct?.content }}
							></Box>
						);
					})}
				</Flex> */}
				<VStack align="stretch" spacing={6} w="100%">
					{(page?.content?.content?.blocks ?? []).map(
						({ _template, content, caption, image, link, video }, index) => {
							const imageName = image?.substring(
								image.lastIndexOf("images/") + 7
							);
							switch (_template) {
								case "heading-block":
									return (
										<Heading key={index} w="full" textAlign="center">
											{content}
										</Heading>
									);
								case "content-block":
									return (
										<Box className="content-block-wrap" key={index}>
											<Box
												sx={{
													a: {
														color: "green.700",
														textDecor: "underline",
													},
													table: {
														w: "100%",
														th: {
															borderWidth: "1px",
															borderColor: "gray.500",
															bg: "gray.100",
															padding: "6px",
														},
														td: {
															borderWidth: "1px",
															borderColor: "gray.500",
															padding: "6px",
														},
													},
													p: {
														py: "5px",
													},
												}}
												w="100%"
												// pt="20px"
												dangerouslySetInnerHTML={{
													__html: content.html ?? content,
												}}
												fontSize={"lg"}
											/>
										</Box>
									);
								case "image-block":
									return (
										<VStack align="stretch" key={index}>
											<Image
												alt={caption ?? imageName}
												w="100%"
												src={image}
												allowFullScreen
											/>
											<Text color="gray.800" fontSize={"lg"}>
												{caption}
											</Text>
										</VStack>
									);
								case "video-block": {
									const youtubeLink = getYoutubeLink(video ?? link);
									return (
										<VStack align="stretch" key={index}>
											<AspectRatio w="100%" ratio={16 / 9}>
												<iframe
													title="post"
													src={youtubeLink}
													allowFullScreen
												/>
											</AspectRatio>
											<Text color="gray.800" fontSize={"lg"}>
												{caption}
											</Text>
										</VStack>
									);
								}
								default:
							}
						}
					)}
				</VStack>
			</Container>
		</VStack>
	);
};

export default withPageCMS(Recognition, {
	key: PAGE_KEY,
	fields: recognitionFieldsForCMS,
});
