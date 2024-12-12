export default [
	{
		component: "text",
		label: "頁面標題 Page Title",
		name: "pageTitle",
	},
	{
		name: "headerGroup",
		label: "標題區塊 Header Group",
		component: "group",
		fields: [
			{
				name: "excerpt",
				label: "頁面概述 Excerpt",
				component: "textarea",
			},
			{
				name: "headerButtonLabel",
				label: "按鈕標題 Button Label",
				component: "text",
			},
			{
				name: "headerButtonLink",
				label: "按鈕連結 Button Link",
				component: "text",
			},
		],
	},
	{
		name: "content.blocks",
		component: "blocks",
		description: "Content of blocks",
		label: "文章內容",
		templates: {
			"heading-block": {
				label: "標題內容 Heading Content",
				key: "heading-block",
				defaultItem: {
					content: "",
				},
				fields: [
					{
						name: "content",
						label: "標題 Content",
						component: "text",
						defaultValue: "",
					},
					{
						name: "headingColor",
						label: "標題顏色",
						component: "color",
					},
				],
			},
			"content-block": {
				label: "文字內容 Text Content",
				key: "content-block",
				defaultItem: {
					content: "",
				},
				fields: [{ name: "content", label: "Content", component: "html" }],
			},
			"image-block": {
				label: "圖片 Image",
				key: "content-block",
				defaultItem: {
					content: "",
				},
				fields: [
					{
						label: "圖片 Image",
						name: "image",
						component: "image",
						uploadDir: () => "/recognition/images",
						parse: ({ previewSrc }) => previewSrc,
						previewSrc: (src) => src,
					},
					{ name: "caption", label: "描述 Caption", component: "text" },
				],
			},

			"video-block": {
				label: "影片 Video",
				key: "video-block",
				defaultItem: {
					content: "",
				},
				fields: [
					{
						label: "影片 Video Link",
						name: "link",
						placeholder: "",
						description: "Youtube embedded link",
						component: "text",
					},
					{ name: "caption", label: "描述 Caption", component: "text" },
				],
			},
		},
	},
];
