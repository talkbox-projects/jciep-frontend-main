export default [
    {
      component: "text",
      label: "頁面標題 Page Title",
      name: "title",
    },
    {
      component: "text",
      label: "置頂文章 Featured Post",
      description: "Enter the id of the project (i.e. /sharing/ideabank/{id})",
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
      name: "categorySection",
      component: "group",
      description: "Show categories on the right",
      label: "構思分類 Category Section",
      fields: [
        {
          component: "text",
          label: "標題 Section Title",
          name: "title",
        },
      ],
    },
    {
      name: "postSection",
      component: "group",
      description: "Background Setting For Post Screen",
      label: "最新文章區段 Post Section",
      fields: [
        {
          label: "图片底部 Image Bottom",
          name: "bgImageBottom",
          component: "image",
          uploadDir: () => "/sharing",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          label: "Double Quote Image",
          name: "doubleQuoteImage",
          component: "image",
          uploadDir: () => "/sharing",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          name: "bgColor",
          label: "背景颜色 Background Color",
          component: "color",
        },
        {
          label: "Post Detail Bottom",
          name: "postBottom",
          component: "image",
          uploadDir: () => "/sharing",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          label: "Second Post Bottom",
          name: "secondPostBottom",
          component: "image",
          uploadDir: () => "/sharing",
          parse: ({ previewSrc }) => previewSrc,
          previewSrc: (src) => src,
        },
        {
          name: "secondBgColor",
          label: "背景颜色 Background Color",
          component: "color",
        },
        {
          name: "socialIcons",
          label: "Social Icons",
          component: "group-list",
          itemProps: ({ id: key, name: label }) => ({
            key,
            label,
          }),
          defaultItem: () => ({
            id: Math.random().toString(36).substr(2, 9),
          }),
          fields: [
            {
              name: "url",
              label: "Url",
              component: "text",
            },
            {
              label: "Icon",
              name: "image",
              component: "image",
              uploadDir: () => "/sharing",
              parse: ({ previewSrc }) => previewSrc,
              previewSrc: (src) => src,
            },
          ],
        },
      ],
    },
  ];
  