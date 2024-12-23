import React, { useRef, useState } from "react";
// import DividerSimple from "../../../components/DividerSimple";
import { useRouter } from "next/router";
import { getConfiguration } from "../../../utils/configuration/getConfiguration";
import { getPage } from "../../../utils/page/getPage";
import withPageCMS from "../../../utils/page/withPageCMS";
import programmeFieldsForCMS from "../../../utils/tina/programmeFieldsForCMS";
import {
	Box,
	Text,
	Image,
	Icon,
	Tooltip,
	Divider,
	Button,
	Wrap,
} from "@chakra-ui/react";
import { SimpleGrid, GridItem } from "@chakra-ui/layout";
import { VStack, HStack, Stack } from "@chakra-ui/layout";
import MultiTextRenderer from "../../../components/MultiTextRenderer";
import {
	AiOutlineInfoCircle,
	// AiOutlineMinus,
	// AiOutlinePlus,
} from "react-icons/ai";
import Container from "../../../components/Container";
import ApostropheHeadline from "../../../components/ApostropheHeadline";
import HighlightHeadline from "../../../components/HighlightHeadline";
// import DividerA from "../../../components/DividerA";
import Slider from "react-slick";
import { SRLWrapper, useLightbox } from "simple-react-lightbox";
import { useCMS } from "tinacms";
import wordExtractor from "../../../utils/wordExtractor";
import getSharedServerSideProps from "../../../utils/server/getSharedServerSideProps";
import { NextSeo } from "next-seo";
const PAGE_KEY = "programme";

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

const Partner = ({ page }) => {
	const router = useRouter();
	const { openLightbox } = useLightbox();
	const slug = router.query.slug;
	const partner = (page?.content?.partnerSection?.partners ?? [])?.find(
		(x) => x.slug === slug
	);

	const sliderRef = useRef(null);
	const settings = {
		ref: (c) => (sliderRef.current = c),
		autoplay: false,
		dots: false,
		speed: 500,
		slidesToShow: 1,
		beforeChange: (oldIndex, newIndex) => setSliderIndex(newIndex),
	};

	const [sliderIndex, setSliderIndex] = useState(0);

	const seo = (
		<NextSeo
			title={`${page?.content?.seo?.title ?? "賽馬會共融．知行計劃"} | ${
				partner?.projectName
			}`}
			description={page?.content?.seo?.description}
		/>
	);

	const contactInfo = (data) => {
		const emailRegExp = /^\S+@\S+\.\S+$/;
		const urlRegExp =
			/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

		const phoneRegExp = /^\+?[1-9][0-9]{7,14}$/;
		const _phone = data?.replace(" ", "");

		if (emailRegExp.test(data)) {
			return (
				<a
					href={`mailto:${data}`}
					style={{ textDecoration: "underline", color: "blue" }}
				>
					{data}
				</a>
			);
		}

		if (urlRegExp.test(data)) {
			return (
				<a
					href={data}
					target="_blank"
					rel="noreferrer"
					style={{ textDecoration: "underline", color: "blue" }}
				>
					{data}
				</a>
			);
		}

		if (data && phoneRegExp.test(_phone)) {
			return (
				<a
					href={`tel:${_phone}`}
					style={{ textDecoration: "underline", color: "blue" }}
				>
					{_phone}
				</a>
			);
		}

		return data;
	};

	return (
		<VStack overflowY="visible" w="100%" spacing={0} align="stretch">
			{seo}
			{/* First Section */}
			<Box
				pos="relative"
				w="100%"
				h="30vw"
				minH={["40vh", "60vh"]}
				position="relative"
				overflow="hidden"
			>
				<SRLWrapper
					elements={(partner?.sliderImage ?? []).map(({ image }) => ({
						src: image,
					}))}
				/>
				<Slider {...settings} style={{ textAlign: "center" }}>
					{(partner?.sliderImage ?? []).map(
						({ image, imageUrl, isIcon }, index) => {
							return (
								<Image
									alt=""
									key={index}
									src={image}
									maxW={isIcon ? ["300px", "500px"] : "unset"}
									minH={isIcon ? "unset" : ["40vh", "60vh"]}
									mt={isIcon ? ["7rem", "10rem", "14rem"] : "unset"}
									objectFit={isIcon ? "contain" : "cover"}
									objectPosition="center center"
									onClick={() => (imageUrl ? window?.open(imageUrl) : null)}
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
						<Box pb={[10, 16]}>
							<VStack mx={8} align="start" spacing={0}>
								<Box>
									<Text
										fontWeight={900}
										bgColor="#F6D644"
										fontSize={["24px", "56px"]}
									>
										{partner?.pageTitle}
									</Text>
								</Box>
								<Box pt={4}>
									<Button
										borderRadius="full"
										bg="black"
										color="white"
										_hover={{ bg: "#333333" }}
										_active={{ bg: "#666666" }}
										onClick={() => openLightbox(sliderIndex)}
									>
										{wordExtractor(
											page?.content?.wordings,
											"banner_showImages"
										)}
									</Button>
								</Box>
							</VStack>
						</Box>
					</Container>
					{/* <DividerSimple /> */}
				</VStack>
			</Box>

			{/* <Box bgColor="#fafafa" w="100%">
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

			{/* Plan Section */}
			<Box
				bgImage={`url(${page?.content?.partnerSection?.planSection?.image})`}
				backgroundSize="contain"
				backgroundRepeat="no-repeat"
				position="relative"
				bgColor="#fafafa"
				backgroundPosition="left bottom"
				width="100%"
			>
				<Container
					// zIndex={200}
					position="relative"
					pt={24}
					// pb={[16, 16, 16, 24]}
				>
					<VStack spacing={8}>
						<HighlightHeadline bgColor={"#F6D644"}>
							{partner?.projectName}
						</HighlightHeadline>
						<Text fontWeight={900} fontSize={["24px", "40px"]}>
							{page?.content?.partnerSection?.planSection?.title}
						</Text>
						<SimpleGrid
							px={[1, 8, 4, 4]}
							py={[4, 16]}
							justifyContent="center"
							columns={[1]}
							spacing={8}
						>
							{(partner?.projectObjective ?? []).map(({ content }, index) => {
								return (
									<GridItem key={index}>
										<Stack
											w="100%"
											spacing={[8, 8, 4]}
											direction={["column", "column", "row"]}
											alignItems="center"
											textAlign={["center", "left", "left"]}
										>
											<Image
												alt=""
												w={[12, 8, 8, 8]}
												src={
													page?.content?.partnerSection?.planSection
														?.objectiveIcon
												}
											/>
											<Text
												lineHeight={1.5}
												w="100%"
												minW={0}
												flex={1}
												fontWeight="bold"
												fontSize="xl"
											>
												{content}
											</Text>
										</Stack>
									</GridItem>
								);
							})}
						</SimpleGrid>
					</VStack>
				</Container>
				{/* <DividerA
					primaryColor="#f6d644"
					secondaryColor="#fff"
					nextColor="#00BFBA"
				/> */}
				<Image
					alt=""
					position="absolute"
					bottom={0}
					src={page?.content?.partnerSection?.planSection?.bgImageBottom}
					width="100%"
					fit="contain"
				/>
			</Box>

			{/* Service Targets */}
			<Box bg="#fafafa">
				<Container>
					<VStack py={20}>
						<Box pb={12}>
							<HighlightHeadline bgColor={"#F6D644"}>
								{page?.content?.partnerSection?.serviceTarget?.title}
							</HighlightHeadline>
						</Box>
						<Wrap justify="center" spacing={12}>
							{(partner?.serviceTargets ?? []).map(
								({ label, description, image }, index) => {
									return (
										<VStack key={index} maxW={["35%", "35%", "35%", "20%"]}>
											<Image
												alt={label}
												minW={["100px", "200px"]}
												src={image}
											/>
											<Text
												textAlign="center"
												w={["100%", "100%", "150px"]}
												fontSize={["xl", "2xl"]}
												fontWeight="semibold"
											>
												{label}
												{description && (
													<Tooltip hasArrow label={description}>
														<Text d="inline">
															<Icon as={AiOutlineInfoCircle}></Icon>
														</Text>
													</Tooltip>
												)}
											</Text>
										</VStack>
									);
								}
							)}
						</Wrap>
					</VStack>
				</Container>
			</Box>

			{/* Services Highlights*/}
			<Box
				position="relative"
				bg={"#009b90"}
				// bg={page?.content?.partnerSection?.serviceSection?.bgColor}
			>
				<Container
					zIndex={10}
					position="relative"
					pt={24}
					pb={[64, 64, 64, 24]}
				>
					<VStack>
						{partner?.serviceHighlights &&
							Object.keys(partner.serviceHighlights).map((key) => {
								return (
									<>
										<Box mb={12}>
											<ApostropheHeadline color="#FFFFFF">
												{partner?.serviceHighlights[key].audience}
											</ApostropheHeadline>
										</Box>
										<Box maxW={[640, 640, 640, 640, 768]} w="100%">
											{(partner?.serviceHighlights[key]?.sections ?? []).map(
												({ title, content }, index) => {
													return (
														<Stack
															borderRadius={16}
															key={index}
															bg="white"
															mb="2"
														>
															<>
																<Box
																	w="100%"
																	textAlign="center"
																	fontWeight="bold"
																	fontSize="md"
																>
																	<HStack w="100%" py={2} px="5">
																		<Text
																			flex={1}
																			minW={0}
																			w="100%"
																			textAlign="center"
																			fontSize="xl"
																		>
																			{title}
																		</Text>
																	</HStack>
																</Box>
																<Divider m="auto" w="95%" color="#eee" />
																<Box fontSize="lg" py={4} px={8}>
																	<MultiTextRenderer data={content} />
																</Box>
															</>
														</Stack>
													);
												}
											)}
										</Box>
									</>
								);
							})}
					</VStack>
				</Container>
				<Image
					alt=""
					d={["none", "none", "none", "block"]}
					position="absolute"
					bottom={"30px"}
					w={"308px"}
					left={"10%"}
					src={page?.content?.partnerSection?.serviceSection?.bgImageLeft}
					zIndex="3"
				/>
				<Image
					alt=""
					position="absolute"
					bottom={["5%", "5%", "10%"]}
					right={"5%"}
					w={"200px"}
					src={page?.content?.partnerSection?.serviceSection?.bgImageRight}
					zIndex="1"
				/>
				{/* <Box pos="relative" zIndex={2}>
					<DividerA
						primaryColor="rgb(246,214,68)"
						secondaryColor="rgb(254,181,52)"
						nextColor="rgb(250,250,250)"
					/>
				</Box> */}
			</Box>

			<Box bg="#fafafa" pt="20">
				<Container maxW={1200} mb={8}>
					<SimpleGrid
						columns={[1, 1, 2, 2]}
						spacing={8}
						dir={["column", "column", "row", "row"]}
						bg="white"
						p={8}
						w="100%"
						align="top"
					>
						{/* <VStack as={GridItem} align="start">
							<Image
								alt={partner?.contact?.label}
								w="310px"
								src={partner?.contact?.logo}
							/>
							<Text>{partner?.contact?.label}</Text>
						</VStack> */}
						<VStack as={GridItem} align="stretch">
							{(partner?.contact?.fields ?? []).map(
								({ id, label, data }, index) => {
									return (
										index % 2 === 0 && (
											<HStack align="start" w="100%" key={id}>
												<Text
													w={24}
													lineHeight={1.5}
													fontWeight="bold"
													color="#666666"
												>
													{label}
												</Text>
												<Text
													flex={1}
													minW={0}
													lineHeight={1.5}
													w={"100%"}
													color="#666666"
												>
													{contactInfo(data)}
												</Text>
											</HStack>
										)
									);
								}
							)}
						</VStack>
						<VStack as={GridItem} align="stretch">
							{(partner?.contact?.fields ?? []).map(
								({ id, label, data }, index) => {
									return (
										index % 2 !== 0 && (
											<HStack align="start" w="100%" key={id}>
												<Text
													w={24}
													lineHeight={1.5}
													fontWeight="bold"
													color="#666666"
												>
													{label}
												</Text>
												<Text
													flex={1}
													minW={0}
													lineHeight={1.5}
													w={"100%"}
													color="#666666"
												>
													{contactInfo(data)}
												</Text>
											</HStack>
										)
									);
								}
							)}
						</VStack>
					</SimpleGrid>
				</Container>
			</Box>
		</VStack>
	);
};

export default withPageCMS(Partner, {
	key: PAGE_KEY,
	fields: programmeFieldsForCMS,
});
