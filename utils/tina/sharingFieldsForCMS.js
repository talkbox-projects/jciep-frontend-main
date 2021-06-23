export default [
  {
    component: "text",
    label: "頁面標題 Page Title",
    name: "title",
  },
  {
    component: "text",
    label: "頁面標題 Latest Articles Heading",
    name: "latestPostHeading",
  },
  {
    component: "text",
    label: "頁面標題 Hottest Articles Heading",
    name: "hottestPostHeading",
  },
  {
    component: "color",
    label: "頁面標題 Banner Color",
    name: "bannerColor",
  },
  {
    label: "圖片 Image Border Featured",
    name: "bottomBorderFeatured",
    component: "image",
    uploadDir: () => "/sharing/images",
    parse: ({ previewSrc }) => previewSrc,
    previewSrc: (src) => src,
  },
  {
    component: "text",
    label: "置頂文章 Featured Post",
    description: "Enter the slug of the article (i.e. /sharing/{slug})",
    name: "featured",
  },
  {
    name: "latestSection",
    component: "group",
    description: "Show latest posts on the left",
    label: "最新文章區段 Latest Section",
    fields: [
      {
        component: "text",
        label: "標題 Section Title",
        name: "title",
      },
      {
        name: "numOfPostsPerPage",
        component: "number",
        label: "每頁文章數量",
      },
    ],
  },
  {
    name: "hotestSection",
    component: "group",
    label: "熱門文章區段 Hotest Section",
    fields: [
      {
        component: "text",
        label: "標題 Section Title",
        name: "title",
      },
      {
        name: "numOfPosts",
        component: "number",
        label: "文章數量",
      },
    ],
  },
  {
    name: "categorySection",
    component: "group",
    label: "文章分類區段 Category Section",
    fields: [
      {
        component: "text",
        label: "標題 Section Title",
        name: "title",
      },
    ],
  },
];
