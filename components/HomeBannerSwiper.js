import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import {
	Heading,
	AspectRatio,
	Button,
	Flex,
	VStack,
	chakra,
	Text,
	Container,
	Box,
	Image,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import MultiTextRenderer from "../components/MultiTextRenderer";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const HomeBannerSwiper = (pageBannerGroup) => {
	const router = useRouter();
	const Video = chakra("video");

	console.log("pageBannerGroup", pageBannerGroup);
	return (
		<Box>
			<Swiper
				spaceBetween={50}
				slidesPerView={1}
				pagination={{ clickable: true, dynamicBullets: true }}
				onSlideChange={() => console.log("slide change")}
				onSwiper={(swiper) => console.log(swiper)}
				autoplay={{
					delay: 5000,
					disableOnInteraction: true,
				}}
				modules={[Pagination, Navigation]}
				className="homepageBannerSwiper"
			>
				{(pageBannerGroup?.pageBannerGroup ?? [])?.map((banner, index) => {
					return (
						<SwiperSlide key={index}>
							<AspectRatio h="100%" maxH={"600px"} zIndex="-1">
								{banner?.image ? (
									<Image src={banner?.image} h={"100%"} w={"100%"} />
								) : (
									<Video
										h="100%"
										src={"/banner_video.mp4"}
										autoPlay
										loop
										playsInline
										muted
									></Video>
								)}
							</AspectRatio>

							<VStack
								zIndex={10}
								align="stretch"
								position="absolute"
								bottom={0}
								w="100%"
								textAlign="center"
								backgroundImage="linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,.8))"
							>
								<Container>
									<VStack pb={16}>
										<Heading color="white" fontSize={["4xl", "4xl", "6xl"]}>
											<MultiTextRenderer data={banner?.title} />
										</Heading>
										<Text
											maxW={480}
											w="100%"
											whiteSpace="pre-wrap"
											color="white"
											fontSize="2xl"
											pt={[8, 8, 12, 12]}
										>
											{banner?.description}
										</Text>
										<Button
											borderRadius="full"
											color="white"
											bg="transparent"
											variant="outline"
											_hover={{
												bg: "rgba(255,255,255, 0.3)",
											}}
											onClick={() =>
												banner?.buttonHyperlink &&
												router.push(banner?.buttonHyperlink)
											}
										>
											{banner?.buttonText}
										</Button>
									</VStack>
								</Container>
							</VStack>
						</SwiperSlide>
					);
				})}
			</Swiper>
		</Box>
	);
};

export default HomeBannerSwiper;
