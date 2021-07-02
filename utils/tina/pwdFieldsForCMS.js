import metaTextTemplates from "./metaTextTemplates";

export default [
  {
    name: "banner",
    label: "頁面橫幅 Hero Banner",
    component: "group",
    fields: [
      {
        name: "bgColor",
        label: "背景颜色 Background Color",
        component: "color",
      },
      {
        label: "图像主 Image Main",
        name: "bgImageMain",
        component: "image",
        uploadDir: () => "/pwd",
        parse: ({ previewSrc }) => previewSrc,
        previewSrc: (src) => src,
      },
      {
        label: "左图 Image Left",
        name: "bgImageLeft",
        component: "image",
        uploadDir: () => "/pwd",
        parse: ({ previewSrc }) => previewSrc,
        previewSrc: (src) => src,
      },
      {
        label: "右图 Image Right",
        name: "bgImageRight",
        component: "image",
        uploadDir: () => "/pwd",
        parse: ({ previewSrc }) => previewSrc,
        previewSrc: (src) => src,
      },
      {
        label: "图片底部 Image Bottom",
        name: "bgImageBottom",
        component: "image",
        uploadDir: () => "/pwd",
        parse: ({ previewSrc }) => previewSrc,
        previewSrc: (src) => src,
      },
      {
        name: "reference",
        label: "來源 Reference",
        component: "text",
      },
      {
        name: "quote",
        label: "引句 Quote",
        component: "blocks",
        templates: metaTextTemplates,
      },
    ],
  },
  {
    name: "excerpt",
    label: "概要 Excerpt Section",
    component: "group",
    fields: [
      {
        name: "bgColor",
        label: "背景颜色 Background Color",
        component: "color",
      },
      {
        name: "tagline",
        label: "引題 Tagline",
        component: "text",
      },
      {
        name: "content",
        label: "內容 Content",
        component: "blocks",
        templates: metaTextTemplates,
      },
    ],
  },
  {
    name: "pwdList",
    label: "残疾人名单 PWD List",
    component: "group",
    fields: [
      {
        name: "bgStyle",
        label: "背景样式 Background style",
        component: "group",
        fields: [
          {
            name: "bgColor",
            label: "背景颜色 Background Color",
            component: "color",
          },
          {
            name: "bgGradient1",
            label: "背景渐变 1 Background Gradient 1",
            component: "image",
            uploadDir: () => "/pwd",
            parse: ({ previewSrc }) => previewSrc,
            previewSrc: (src) => src,
          },
          // {
          //   name: "bgGradient2",
          //   label: "背景渐变 2 Background Gradient 2",
          //   component: "image",
          //   uploadDir: () => "/pwd",
          //   parse: ({ previewSrc }) => previewSrc,
          //   previewSrc: (src) => src,
          // },
          // {
          //   name: "bottomBorder",
          //   label: "底部边框 Bottom Border",
          //   component: "image",
          //   uploadDir: () => "/pwd",
          //   parse: ({ previewSrc }) => previewSrc,
          //   previewSrc: (src) => src,
          // },
          {
            name: "bottomImage",
            label: "底部图像 Bottom Image",
            component: "image",
            uploadDir: () => "/pwd",
            parse: ({ previewSrc }) => previewSrc,
            previewSrc: (src) => src,
          },
        ],
      },
      {
        name: "title",
        label: "標題 Title",
        component: "text",
      },
      {
        name: "pwds",
        label: "多元人才 PWD Type Sections",
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
            name: "slug",
            label: "後綴路由 Slug for this partner",
            component: "text",
            description:
              "The pwd detail route would be /people-with-disabilities/{slug}",
          },
          {
            label: "圖示 Icon",
            name: "icon",
            component: "image",
            uploadDir: () => "/pwd",
            parse: ({ previewSrc }) => previewSrc,
            previewSrc: (src) => src,
          },
          {
            name: "name",
            label: "多元人才名稱 PWD Name",
            component: "text",
          },
          {
            name: "description",
            label: "多元人才描述 PWD Description",
            component: "blocks",
            templates: metaTextTemplates,
          },
          {
            name: "descriptionStyles",
            label: "多元人才描述 Description Section Styles",
            component: "group",
            fields: [
              {
                name: "bgColor",
                label: "背景颜色 Background Color",
                component: "color",
              },
              {
                name: "bgGradient",
                label: "背景渐变 Background Gradient",
                component: "image",
                uploadDir: () => "/pwd",
                parse: ({ previewSrc }) => previewSrc,
                previewSrc: (src) => src,
              },
            ],
          },

          {
            name: "qna",
            label: "问答列表 Q&A List",
            component: "group-list",
            itemProps: ({ id: key, question: label }) => ({
              key,
              label,
            }),
            defaultItem: () => ({
              id: Math.random().toString(36).substr(2, 9),
            }),
            fields: [
              {
                name: "accordionGroup",
                label: "Q&A Accordion Group",
                component: "group",
                fields: [
                  {
                    name: "title",
                    label: "Accordion Title",
                    component: "text",
                  },
                  {
                    name: "accordions",
                    label: "Accordions for Q&A",
                    component: "group-list",
                    itemProps: ({ id: key, question: label }) => ({
                      key,
                      label,
                    }),
                    defaultItem: () => ({
                      id: Math.random().toString(36).substr(2, 9),
                    }),
                    fields: [
                      {
                        name: "question",
                        label: "問題 Question",
                        component: "text",
                      },
                      {
                        name: "response",
                        label: "回應 Response",
                        component: "blocks",
                        templates: metaTextTemplates,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: "qnaStyles",
            label: "问答部分样式 Q&A Section Styles",
            component: "group",
            fields: [
              {
                name: "bgColor",
                label: "背景颜色 Background Color",
                component: "color",
              },
              {
                name: "imageTop",
                label: "图片顶部 Image Top",
                component: "image",
                uploadDir: () => "/pwd",
                parse: ({ previewSrc }) => previewSrc,
                previewSrc: (src) => src,
              },
              {
                name: "imageBottom",
                label: "图片底部 Image Bottom",
                component: "image",
                uploadDir: () => "/pwd",
                parse: ({ previewSrc }) => previewSrc,
                previewSrc: (src) => src,
              },
            ],
          },

          {
            name: "traitSection",
            label: "特質區段 Trait Section",
            component: "group",
            fields: [
              {
                name: "title",
                label: "標題 Title",
                component: "text",
              },
              {
                name: "description",
                label: "描述 description",
                component: "text",
              },
              {
                name: "traits",
                label: "特點 Traits",
                component: "group-list",
                itemProps: ({ id: key, text: label }) => ({
                  key,
                  label,
                }),
                defaultItem: () => ({
                  id: Math.random().toString(36).substr(2, 9),
                }),
                fields: [
                  {
                    name: "captionTop",
                    label: "顯示文字 Caption Top",
                    component: "text",
                  },
                  {
                    name: "text",
                    label: "顯示文字 Text",
                    component: "text",
                  },
                  {
                    name: "color",
                    label: "Color of Trait(Yellow/White)",
                    component: "color",
                  },
                ],
              },
              {
                name: "extraInfo",
                label: "額外資料 Extra Information",
                component: "group-list",
                itemProps: ({ id: key, text: label }) => ({
                  key,
                  label,
                }),
                defaultItem: () => ({
                  id: Math.random().toString(36).substr(2, 9),
                }),
                fields: [
                  {
                    name: "text",
                    label: "文字 Text",
                    component: "text",
                  },
                ],
              },
              {
                name: "imageTop",
                label: "Image Top",
                component: "image",
                uploadDir: () => "/pwd",
                parse: ({ previewSrc }) => previewSrc,
                previewSrc: (src) => src,
              },
              {
                name: "bgColor",
                label: "背景颜色 Background Color",
                component: "color",
              },
            ],
          },
          {
            name: "careerSection",
            label: "職業區段 Career Section",
            component: "group",
            fields: [
              {
                name: "title",
                label: "標題 Title",
                component: "text",
              },
              {
                name: "description",
                label: "描述 description",
                component: "text",
              },
              {
                name: "sections",
                label: "職業類型 Job Type Sections",
                component: "group-list",
                itemProps: ({ id: key, jobType: label }) => ({
                  key,
                  label,
                }),
                defaultItem: () => ({
                  id: Math.random().toString(36).substr(2, 9),
                }),
                fields: [
                  {
                    name: "jobType",
                    label: "職業類型 Job Type Name",
                    component: "text",
                  },
                  {
                    name: "items",
                    label: "項目 Item",
                    component: "group-list",
                    itemProps: ({ id: key, caption: label }) => ({
                      key,
                      label,
                    }),
                    defaultItem: () => ({
                      id: Math.random().toString(36).substr(2, 9),
                    }),
                    fields: [
                      // {
                      //   label: "圖片 Image",
                      //   name: "image",
                      //   component: "image",
                      //   uploadDir: () => "/pwd",
                      //   parse: ({ previewSrc }) => previewSrc,
                      //   previewSrc: (src) => src,
                      // },
                      {
                        name: "caption",
                        label: "描述 Caption",
                        description: "max. 2 lines",
                        component: "text",
                      },
                    ],
                  },
                ],
              },
              {
                name: "extraInfo",
                label: "額外資料 Extra Information",
                component: "group-list",
                itemProps: ({ id: key, text: label }) => ({
                  key,
                  label,
                }),
                defaultItem: () => ({
                  id: Math.random().toString(36).substr(2, 9),
                }),
                fields: [
                  {
                    name: "text",
                    label: "文字 Text",
                    component: "text",
                  },
                ],
              },
              {
                name: "bgColor",
                label: "背景颜色 Background Color",
                component: "color",
              },
              {
                name: "personLeft",
                label: "Person Left Image",
                component: "image",
                uploadDir: () => "/pwd",
                parse: ({ previewSrc }) => previewSrc,
                previewSrc: (src) => src,
              },
              {
                name: "personRight",
                label: "Person Right Image",
                component: "image",
                uploadDir: () => "/pwd",
                parse: ({ previewSrc }) => previewSrc,
                previewSrc: (src) => src,
              },
            ],
          },
          {
            name: "videoSection",
            label: "影片區段 VideoSection",
            component: "group",
            fields: [
              {
                name: "title",
                label: "標題 Title",
                component: "text",
              },
              {
                name: "description",
                label: "描述 description",
                component: "text",
              },
              {
                name: "videos",
                label: "影片 Videos",
                component: "group-list",
                fields: [
                  {
                    name: "url",
                    label: "YouTube Link",
                    component: "text",
                  },
                ],
              },
              {
                name: "bgColor",
                label: "背景颜色 Background Color",
                component: "color",
              },
              {
                name: "leftImage",
                label: "Left Image",
                component: "image",
                uploadDir: () => "/pwd",
                parse: ({ previewSrc }) => previewSrc,
                previewSrc: (src) => src,
              },
              {
                name: "rightImage",
                label: "Right Image",
                component: "image",
                uploadDir: () => "/pwd",
                parse: ({ previewSrc }) => previewSrc,
                previewSrc: (src) => src,
              },
            ],
          },
          {
            name: "referenceSection",
            label: "相關資料 Reference Section",
            component: "group",
            fields: [
              {
                name: "category",
                label: "資料分類 Reference Category",
                component: "group-list",
                itemProps: ({ id: key, title: label }) => ({
                  key,
                  label,
                }),
                defaultItem: () => ({
                  id: Math.random().toString(36).substr(2, 9),
                }),
                fields: [
                  {
                    name: "title",
                    label: "標題 Title",
                    component: "text",
                  },
                  {
                    name: "links",
                    label: "鏈結 Links",
                    component: "group-list",
                    itemProps: ({ id: key, label }) => ({
                      key,
                      label,
                    }),
                    defaultItem: () => ({
                      id: Math.random().toString(36).substr(2, 9),
                    }),
                    fields: [
                      {
                        name: "url",
                        label: "URL",
                        component: "text",
                      },
                      {
                        name: "label",
                        label: "標籤 Label",
                        component: "text",
                      },
                    ],
                  },
                ],
              },
              {
                name: "categoryIcon",
                label: "Category Icon on Top",
                component: "image",
                uploadDir: () => "/pwd",
                parse: ({ previewSrc }) => previewSrc,
                previewSrc: (src) => src,
              },
              {
                name: "gradient",
                label: "Background Gradient",
                component: "image",
                uploadDir: () => "/pwd",
                parse: ({ previewSrc }) => previewSrc,
                previewSrc: (src) => src,
              },
            ],
          },
          {
            name: "othersSection",
            label: "其他科 Others Section",
            component: "group",
            fields: [
              {
                name: "title",
                label: "標題 Title",
                component: "text",
              },
              {
                name: "bottomImage",
                label: "Botttom Image",
                component: "image",
                uploadDir: () => "/pwd",
                parse: ({ previewSrc }) => previewSrc,
                previewSrc: (src) => src,
              },
            ],
          },
        ],
      },
    ],
  },
];
