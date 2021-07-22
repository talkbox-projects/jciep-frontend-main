import metaTextTemplates from "./metaTextTemplates";

export default [
  {
    name: "heroBannerSection",
    label: "頁面橫幅區塊 Hero Banner Setion",
    component: "group",
    fields: [
      // {
      //   label: "Hero Image 圖片",
      //   name: "image",
      //   component: "image",
      //   uploadDir: () => "/programme",
      //   parse: ({ previewSrc }) => previewSrc,
      //   previewSrc: (src) => src,
      // },
      {
        label: "Slider Image 圖片",
        name: "sliderImage",
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
            label: "Image 圖片",
            name: "image",
            component: "image",
            uploadDir: () => "/programme",
            parse: ({ previewSrc }) => previewSrc,
            previewSrc: (src) => src,
          },
        ],
      },
      {
        name: "title 標題",
        label: "Title",
        component: "text",
      },
    ],
  },
  {
    name: "visionSection",
    label: "願景區塊 Vision Section",
    component: "group",
    fields: [
      {
        name: "title",
        label: "標題 Title",
        component: "text",
      },
      {
        name: "detail",
        label: "描述 Description",
        component: "blocks",
        templates: metaTextTemplates,
      },
      {
        name: "sections",
        label: "內容 Sections",
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
            name: "description",
            label: "描述 Description",
            component: "blocks",
            templates: metaTextTemplates,
          },
        ],
      },
      {
        name: "videoLink",
        label: "Video Link",
        component: "text",
      },
    ],
  },
  {
    name: "partnerSection",
    label: "合作伙伴區塊 Partner Section",
    component: "group",
    fields: [
      {
        name: "title",
        label: "標題 Title",
        component: "text",
      },
      {
        name: "description",
        label: "描述 Description",
        component: "textarea",
      },
      {
        label: "图像主 Image Main",
        name: "bgImageMain",
        component: "image",
        uploadDir: () => "/programme",
        parse: ({ previewSrc }) => previewSrc,
        previewSrc: (src) => src,
      },
      {
        label: "左图 Image Left",
        name: "bgImageLeft",
        component: "image",
        uploadDir: () => "/programme",
        parse: ({ previewSrc }) => previewSrc,
        previewSrc: (src) => src,
      },
      {
        label: "右图 Image Right",
        name: "bgImageRight",
        component: "image",
        uploadDir: () => "/programme",
        parse: ({ previewSrc }) => previewSrc,
        previewSrc: (src) => src,
      },
      {
        name: "planSection",
        label: "計晝目標 Plan Section",
        component: "group",
        fields: [
          {
            name: "title",
            label: "Title 標題",
            component: "text",
          },
        ],
      },
      {
        name: "serviceTarget",
        label: "服務對象 Service Target Section",
        component: "group",
        fields: [
          {
            name: "title",
            label: "Title 標題",
            component: "text",
          },
        ],
      },
      {
        name: "serviceSection",
        label: "合作伙伴圖片區塊 Service Section",
        component: "group",
        fields: [
          {
            label: "左图 Image Left",
            name: "bgImageLeft",
            component: "image",
            uploadDir: () => "/programme",
            parse: ({ previewSrc }) => previewSrc,
            previewSrc: (src) => src,
          },
          {
            label: "右图 Image Right",
            name: "bgImageRight",
            component: "image",
            uploadDir: () => "/programme",
            parse: ({ previewSrc }) => previewSrc,
            previewSrc: (src) => src,
          },
        ],
      },
      {
        name: "partners",
        label: "合作伙伴 Partners",
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
              "The partner detail route would be /programme/partner/{slug}",
          },
          // {
          //   label: "Hero Image 圖片",
          //   name: "image",
          //   component: "image",
          //   uploadDir: () => "/programme",
          //   parse: ({ previewSrc }) => previewSrc,
          //   previewSrc: (src) => src,
          // },

          {
            label: "Slider Image 圖片",
            name: "sliderImage",
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
                label: "Image 圖片",
                name: "image",
                component: "image",
                uploadDir: () => "/programme",
                parse: ({ previewSrc }) => previewSrc,
                previewSrc: (src) => src,
              },
            ],
          },

          {
            name: "agencyName",
            label: "機構名稱 Agency Name",
            component: "text",
          },
          {
            name: "projectName",
            label: "計劃名稱 Project Name",
            component: "text",
          },
          {
            name: "projectObjective",
            label: "計劃目標 Project Objective ",
            component: "group-list",
            itemProps: ({ id: key, content: label }) => ({
              key,
              label,
            }),
            defaultItem: () => ({
              id: Math.random().toString(36).substr(2, 9),
            }),
            fields: [
              {
                name: "content",
                label: "內容 Content",
                component: "text",
              },
            ],
          },
          {
            name: "serviceHighlights",
            label: "重點活動/服務 Service Highlights",
            component: "group-list",
            itemProps: ({ id: key, audience: label }) => ({
              key,
              label,
            }),
            defaultItem: () => ({
              id: Math.random().toString(36).substr(2, 9),
            }),
            fields: [
              {
                name: "audience",
                label: "目標群眾 Audience",
                component: "text",
              },
              {
                name: "sections",
                label: "區段 Sections",
                component: "group-list",
                fields: [
                  {
                    name: "title",
                    label: "標題 Title",
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
            ],
          },
          {
            name: "serviceTargets",
            label: "服務對象 Service Targets",
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
                name: "label",
                label: "標籤 Label",
                component: "text",
              },
              {
                name: "description",
                label: "補充資料 Tooltip Text",
                component: "text",
              },
              {
                label: "圖示 Icon",
                name: "image",
                component: "image",
                uploadDir: () => "/programme",
                parse: ({ previewSrc }) => previewSrc,
                previewSrc: (src) => src,
              },
            ],
          },
          {
            name: "contact",
            label: "聯絡 Contacts",
            component: "group",
            fields: [
              {
                label: "圖標 Logo",
                name: "logo",
                component: "image",
                uploadDir: () => "/programme",
                parse: ({ previewSrc }) => previewSrc,
                previewSrc: (src) => src,
              },
              {
                label: "水印 Watermark",
                name: "watermark",
                component: "image",
                uploadDir: () => "/programme",
                parse: ({ previewSrc }) => previewSrc,
                previewSrc: (src) => src,
              },

              {
                name: "fields",
                label: "欄位 Fields",
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
                    name: "label",
                    label: "標籤 Label",
                    component: "text",
                  },
                  {
                    name: "data",
                    label: "內容 data",
                    component: "text",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  {
    name: "referenceSection",
    label: "資源區塊 Reference Section",
    component: "group",
    fields: [
      {
        name: "title",
        label: "標題 Title",
        component: "text",
      },
      {
        name: "bgStyle",
        label: "背景样式 Background style",
        component: "group",
        fields: [
          {
            name: "bgGradient1",
            label: "背景渐变 1 Background Gradient 1",
            component: "image",
            uploadDir: () => "/programme",
            parse: ({ previewSrc }) => previewSrc,
            previewSrc: (src) => src,
          },
        ],
      },
      {
        name: "references",
        label: "資源 References",
        component: "group-list",
        itemProps: ({ id: key, categoryName: label }) => ({
          key,
          label,
        }),
        defaultItem: () => ({
          id: Math.random().toString(36).substr(2, 9),
        }),
        fields: [
          {
            name: "categoryName",
            label: "分類名稱 Category Name",
            component: "text",
          },
          {
            label: "category Icon 圖示",
            name: "icon",
            component: "image",
            uploadDir: () => "/programme",
            parse: ({ previewSrc }) => previewSrc,
            previewSrc: (src) => src,
          },
          {
            name: "items",
            label: "資源項目 Reference Items",
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
                name: "description",
                label: "描述 Description",
                component: "blocks",
                templates: metaTextTemplates,
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
        ],
      },
    ],
  },
];
