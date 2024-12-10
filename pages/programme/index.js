import React, { useEffect, useRef } from "react";
import { Box, VStack, GridItem, SimpleGrid } from "@chakra-ui/layout";
import withPageCMS from "../../utils/page/withPageCMS";
import { getPage } from "../../utils/page/getPage";
import {
	HStack,
	chakra,
	Heading,
	Text,
	Image,
	Icon,
	Accordion,
	AccordionItem,
	AccordionPanel,
	AccordionButton,
	Wrap,
	Link,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
} from "@chakra-ui/react";
import Container from "../../components/Container";
import programmeFieldsForCMS from "../../utils/tina/programmeFieldsForCMS";
import NextLink from "next/link";
import MultiTextRenderer from "./../../components/MultiTextRenderer";
import { AiOutlineMinus } from "react-icons/ai";
import { BsPlus } from "react-icons/bs";
import { FaShareSquare } from "react-icons/fa";

import DividerA from "../../components/DividerA";
import DividerTriple from "../../components/DividerTriple";
import HighlightHeadline from "../../components/HighlightHeadline";
import Slider from "react-slick";
import Anchor from "../../components/Anchor";
import getSharedServerSideProps from "../../utils/server/getSharedServerSideProps";
import { useRouter } from "next/router";
import { ChevronLeftIcon } from "@chakra-ui/icons";

const PAGE_KEY = "programme";

const Iframe = chakra("iframe");

export const getServerSideProps = async (context) => {
	const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

	return {
		props: {
			page,
			isLangAvailable: context.locale === page.lang,
			isShowLangSwitcher: true,
			...(await getSharedServerSideProps(context))?.props,
		},
	};
};

const Programme = ({ page }) => {
	const sliderRef = useRef(null);
	const router = useRouter();
	const settings = {
		ref: (c) => (sliderRef.current = c),
		autoplay: true,
		dots: false,
		speed: 500,
		slidesToShow: 1,
	};

	useEffect(() => {
		const hash = window.location.hash.replace("#", "");
		if (hash) {
			setTimeout(() => {
				document.querySelector(`[data-tag='${hash}']`).scrollIntoView({
					block: "start",
					behavior: "smooth",
				});
			}, 300);
		}
	}, [router]);

	console.log({ page });

	return (
		<VStack
			mt={["64px", 0]}
			overflowY="visible"
			w="100%"
			spacing={0}
			align="stretch"
		>
			{/* Banner Section */}
			<Anchor id="vision" />
			<Box
				w="100vw"
				position="relative"
				overflowY="visible"
				overflowX="hidden"
				zIndex="-1"
			>
				<Slider {...settings}>
					{(page?.content?.heroBannerSection?.sliderImage ?? []).map(
						({ image }, index) => {
							return (
								<Image
									alt=""
									minH={[300]}
									key={index}
									src={image}
									objectFit={{ base: "cover", md: "contain" }}
									mt={{ base: "40px", md: "90px" }}
									objectPosition="center center"
								/>
							);
						}
					)}
				</Slider>
				<VStack
					align="stretch"
					position="absolute"
					bottom={0}
					textAlign="center"
					w="100%"
				>
					<Container>
						<Box position="relative" zIndex={2} pb={16}>
							<VStack mx={8} align="start" spacing={0}>
								{page?.content?.heroBannerSection["title 標題"] && (
									<Text
										p={1}
										w="max"
										maxW="80%"
										fontWeight="semibold"
										fontSize={["24px", "24px", "36px", "56px"]}
										bg={page?.content?.heroBannerSection?.titleBgColor}
										color="black"
										display="inline"
									>
										{page?.content?.heroBannerSection["title 標題"]}
									</Text>
								)}
							</VStack>
						</Box>
					</Container>
					{/* <Box pos="absolute" bottom="-1px" w="100%">
						<DividerTriple
							primaryColor="#00BFBA"
							secondaryColor="white"
							nextColor="#F6D644"
						/>
					</Box> */}
				</VStack>
			</Box>

			{/* <Box bg={page?.content?.visionSection?.bgColor} w="100%">
        <Container>
          <Flex w="100%" justify="flex-end">
            {router.locale === "zh" ? (
              <Button
                value={"en"}
                onClick={(e) => {
                  if (cms.enabled) {
                    window.location.href = `/${e.target.value}${router.asPath}`;
                  } else {
                    router.push(router.pathname, router.pathname, {
                      locale: e.target.value,
                    });
                  }
                }}
                variant="link"
                color="black"
              >
                Display english version
              </Button>
            ) : (
              <Button
                value={"zh"}
                onClick={(e) => {
                  if (cms.enabled) {
                    window.location.href = `/${e.target.value}${router.asPath}`;
                  } else {
                    router.push(router.pathname, router.pathname, {
                      locale: e.target.value,
                    });
                  }
                }}
                variant="link"
                color="black"
              >
                顯示為中文
              </Button>
            )}
          </Flex>
        </Container>
      </Box> */}
			{/* Vision Section */}
			<Box
				// bg={page?.content?.visionSection?.bgColor}
				bg="#fff"
				w="100%"
			>
				<Container py={24}>
					{/* <VStack align="center" w="100%">
						<Text
							fontSize={["3xl", "3xl", "4xl", "4xl"]}
							textAlign="center"
							fontWeight="bold"
							backgroundImage="linear-gradient(#fff, #fff)"
							backgroundRepeat="no-repeat"
							backgroundPosition="0 0.7em"
						>
							{page?.content?.visionSection?.title}
						</Text>
						<Box fontSize={["lg", "xl", "xl"]} textAlign="center">
							<MultiTextRenderer data={page?.content?.visionSection?.detail} />
						</Box>
						{(page?.content?.visionSection?.sections ?? []).map(
							({ title, description, id }) => {
								return (
									<VStack pt={16} key={id}>
										<Box position="relative" mx={["47px", "47px", "0px"]}>
											<Heading
												fontWeight="bold"
												fontSize="2xl"
												textAlign="center"
											>
												{title}
											</Heading>
											<Box
												width="6.15px"
												height="27.69px"
												borderRadius="5px"
												pos="absolute"
												right={["-6", "-6", "-12"]}
												bottom="-3"
												background="#fff"
												transform="rotate(30deg)"
											/>
											<Box
												width="6.15px"
												height="27.69px"
												borderRadius="5px"
												pos="absolute"
												left={["-6", "-6", "-12"]}
												bottom="-3"
												background="#fff"
												transform="rotate(-30deg)"
											/>
										</Box>
										<Box pt={8} px="16px">
											<MultiTextRenderer
												fontSize={["lg", "xl", "xl"]}
												data={description}
												textAlign="center"
												text
											/>
										</Box>
									</VStack>
								);
							}
						)}

						{page?.content?.visionSection?.videoLink && (
							<Iframe
								p={2}
								pt={16}
								w="100%"
								h={["320px", "320px", "480px", "720px"]}
								src={page?.content?.visionSection?.videoLink}
								title="PWD Video"
								frameBorder="0"
								allow="accelerometer; autoPlay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							/>
						)}
					</VStack> */}

					<Tabs defaultIndex={1}>
						<TabList border={0} as={HStack} spacing={8}>
							{(page?.content?.visionSection?.stageTab ?? []).map(
								({ id, tabLabel }) => (
									<Tab
										fontSize={["3xl", "4xl", "5xl"]}
										fontWeight="bold"
										px={0}
										_selected={{
											color: "black",
											borderBottomColor: "#FD5F53",
										}}
										borderBottomWidth={3}
										key={id}
									>
										<ChevronLeftIcon /> {tabLabel}
									</Tab>
								)
							)}
						</TabList>
						<TabPanels>
							{(page?.content?.visionSection?.stageTab ?? [])?.map(
								(stage, index) => {
									return (
										<TabPanel tabIndex={null} px={0} key={index} py={12}>
											<VStack align="center" w="100%">
												<Text
													fontSize={["3xl", "3xl", "4xl", "4xl"]}
													textAlign="center"
													fontWeight="bold"
													backgroundImage="linear-gradient(#fff, #fff)"
													backgroundRepeat="no-repeat"
													backgroundPosition="0 0.7em"
												>
													{stage.title}
												</Text>
												{/* <Box fontSize={["lg", "xl", "xl"]} textAlign="center">
												<MultiTextRenderer data={stage?.detail} />
											</Box> */}
												{(stage?.sections ?? []).map(
													({ title, description, id }) => {
														return (
															<VStack pt={16} key={id}>
																<Box
																	position="relative"
																	mx={["47px", "47px", "0px"]}
																>
																	<Heading
																		fontWeight="bold"
																		fontSize="2xl"
																		textAlign="center"
																	>
																		{title}
																	</Heading>
																	<Box
																		width="6.15px"
																		height="27.69px"
																		borderRadius="5px"
																		pos="absolute"
																		right={["-6", "-6", "-12"]}
																		bottom="-3"
																		background="#fff"
																		transform="rotate(30deg)"
																	/>
																	<Box
																		width="6.15px"
																		height="27.69px"
																		borderRadius="5px"
																		pos="absolute"
																		left={["-6", "-6", "-12"]}
																		bottom="-3"
																		background="#fff"
																		transform="rotate(-30deg)"
																	/>
																</Box>
																<Box pt={8} px="16px">
																	<MultiTextRenderer
																		fontSize={["lg", "xl", "xl"]}
																		data={description}
																		textAlign="center"
																		text
																	/>
																</Box>
															</VStack>
														);
													}
												)}
												{stage?.videoLink && (
													<Iframe
														p={2}
														pt={16}
														w="100%"
														h={["320px", "320px", "480px", "720px"]}
														src={stage?.videoLink}
														title="PWD Video"
														frameBorder="0"
														allow="accelerometer; autoPlay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
														allowFullScreen
													/>
												)}
											</VStack>
										</TabPanel>
									);
								}
							)}
						</TabPanels>
					</Tabs>
				</Container>
			</Box>

			{/* Partner Section */}
			<Anchor id="partner" />
			<Box bg="#009b90">
				<Box
					// backgroundImage={`url(${page?.content?.partnerSection?.bgImageMain})`}
					background={"#009b90"}
					backgroundSize={["300%", "contain"]}
					backgroundRepeat="no-repeat"
					w="100%"
					position="relative"
				>
					<Container>
						<VStack
							spacing={[4, 2]}
							pt={["36px", "36px", "53px"]}
							textAlign="center"
						>
							<Box>
								<HighlightHeadline>
									{page?.content?.partnerSection?.title}
								</HighlightHeadline>
							</Box>

							<Text zIndex="2">
								{page?.content?.partnerSection?.description}
							</Text>
						</VStack>
						<Wrap
							mt={8}
							spacing={[6, 12]}
							px={[8, 12]}
							justify="center"
							align="center"
						>
							{(page?.content?.partnerSection?.partners ?? []).map(
								({ id, agencyName, projectName, contact, slug }, i) => (
									<NextLink
										key={i}
										passHref
										href={`/programme/partner/${slug}`}
									>
										<Link d="block" w={["100%", "100%", "40%", "25%"]}>
											<VStack
												w="100%"
												position="relative"
												transition="all 0.2s"
												borderWidth={[0, 0, 0, 2]}
												borderColor="#C6C6C6"
												boxShadow={["lg", "lg", "lg", "none"]}
												bg={["white", "white", "white", "#FAFAFA"]}
												_hover={{
													borderColor: "transparent",
													boxShadow: "lg",
													bg: "white",
													opacity: 1,
												}}
												cursor="pointer"
												borderRadius={16}
												key={id}
												py={5}
												px={5}
												h={["250px", "320px"]}
												textAlign="left"
												align="left"
												zIndex="10"
											>
												<Text fontWeight="bold" fontSize="2xl">
													{agencyName}
												</Text>
												<Text fontSize="lg">{projectName}</Text>
												<Box flex={1} minH="max-content" h="100%" />
												{/* <Image
													alt={agencyName}
													w={["75%"]}
													src={contact?.watermark}
													position="absolute"
													bottom={0}
													right={0}
												></Image> */}
											</VStack>
										</Link>
									</NextLink>
								)
							)}
						</Wrap>
					</Container>

					<Image
						alt=""
						pos="absolute"
						zIndex="1"
						src={page?.content?.partnerSection?.bgImageLeft}
						top={["100px", "100px", "72px"]}
						left={["2%", "5%", "10%"]}
						h={["100px", "150px", "220px"]}
						w={["100px", "150px", "220px"]}
					/>
					<Box
						pt={["20%", "20%", "0"]}
						pos="relative"
						pb={["124px", "124px", "380px"]}
					>
						<Image
							alt=""
							pos="absolute"
							right={["50px", "50px", "105px"]}
							bottom={["15%"]}
							h={["175px", "175px", "279px"]}
							width={["129px", "129px", "205px"]}
							src={page?.content?.partnerSection?.bgImageRight}
							zIndex="1"
						/>
						{/* <Box position="absolute" bottom="0" w="100%">
							<DividerA
								primaryColor="#F6D644"
								secondaryColor="#00BFBA"
								nextColor="white"
							/>
						</Box> */}
					</Box>
				</Box>
			</Box>
			{/* Reference Section */}
			<Anchor id="reference" top="-100px" />
			<Box
				bg={page?.content?.referenceSection?.bgStyle?.bgColor}
				w="100%"
				pt="36px"
				overflow="hidden"
				position="relative"
				mt="0"
			>
				<VStack>
					<Box px="16px">
						<HighlightHeadline>
							{page?.content?.referenceSection?.title}
						</HighlightHeadline>
					</Box>
				</VStack>
				<Container zIndex={2} position="relative">
					<SimpleGrid
						columns={[1, 1, 2, 2]}
						gap="36px"
						mt={["36px", "56px"]}
						justifyContent="center"
					>
						{(page?.content?.referenceSection?.references ?? []).map(
							({ categoryName, icon, items }, i) => {
								return (
									<GridItem key={i}>
										<VStack
											w="100%"
											spacing={0}
											align="stretch"
											alignItems={["center", "center", "start", "start"]}
										>
											<Image
												alt={categoryName}
												w={["80px", "120px", "110px", "100px"]}
												src={icon}
											/>
											<Heading
												pt={4}
												as="span"
												fontSize={["20px", "24px", ""]}
												fontWeight="normal"
											>
												{categoryName}
											</Heading>
											<Accordion
												allowToggle
												w="100%"
												pt={8}
												as={VStack}
												align="stretch"
											>
												{(items ?? []).map(
													({ id, title, description, links }) => {
														return (
															<AccordionItem key={id} border={0} bg="gray.50">
																{({ isExpanded }) => (
																	<>
																		<AccordionButton>
																			<HStack w="100%">
																				<Text
																					flex={1}
																					minW={0}
																					w="100%"
																					lineHeight={2}
																					fontWeight="bold"
																					textAlign="left"
																				>
																					{title}
																				</Text>
																				<Icon
																					as={
																						isExpanded ? AiOutlineMinus : BsPlus
																					}
																					fontSize="2xl"
																				/>
																			</HStack>
																		</AccordionButton>
																		<AccordionPanel px={4} color="gray.200">
																			<MultiTextRenderer data={description} />
																			<VStack spacing={1} mt={8} align="start">
																				{(links ?? []).map(
																					({ id, label, url }) => {
																						return (
																							<Link
																								isExternal
																								key={id}
																								href={url}
																								fontWeight="bold"
																								color="#007878"
																							>
																								<Text>
																									<chakra.span display="inline-block">
																										{" "}
																										{label}{" "}
																									</chakra.span>
																									<chakra.span
																										display="inline-block"
																										ml={3}
																									>
																										<FaShareSquare />
																									</chakra.span>
																								</Text>
																								{/* <Image
                                                  display="inline-flex"
                                                  src={
                                                    page?.content?.icon
                                                      ?.extrenalLinkIcon
                                                  }
                                                  marginLeft="10px"
                                                  height="25px"
                                                ></Image> */}
																							</Link>
																						);
																					}
																				)}
																			</VStack>
																		</AccordionPanel>
																	</>
																)}
															</AccordionItem>
														);
													}
												)}
											</Accordion>
										</VStack>{" "}
									</GridItem>
								);
							}
						)}
					</SimpleGrid>
				</Container>
				<Image
					alt=""
					pos="absolute"
					src={page?.content?.referenceSection?.bgStyle?.bgGradient1}
					bottom={0}
					right={0}
					zIndex="0"
				/>
				<Box pos="relative" pb={["124px", "124px", "380px"]}>
					<Image
						alt=""
						pos="absolute"
						right={["22px", "35px", "81px"]}
						bottom="0"
						width={["90%", "52%"]}
						src={page?.content?.referenceSection?.bgStyle?.bottomImage}
						zIndex="1"
					/>
					<Box position="absolute" bottom="0" w="100%">
						<DividerTriple
							primaryColor="#00BFBA"
							secondaryColor="#F6D644"
							nextColor="white"
						/>
					</Box>
				</Box>
			</Box>
		</VStack>
	);
};

export default withPageCMS(Programme, {
	key: PAGE_KEY,
	fields: programmeFieldsForCMS,
});
