import metaTextTemplates from "./metaTextTemplates";

export default [
  {
    name: "banner",
    label: "頁面橫幅 Hero Banner",
    component: "group",
    fields: [
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
    name: "pwds",
    label: "多元人才 PWD Type Section",
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
        name: "qna",
        label: "問與答 Q&A Section",
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

      {
        name: "traitSection",
        label: "特質區段 Trait Section",
        component: "group",
        fields: [
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
                name: "text",
                label: "顯示文字 Text",
                component: "text",
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
        ],
      },
      {
        name: "careerSection",
        label: "職業區段 Career Section",
        component: "group",
        fields: [
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
                  {
                    label: "圖片 Image",
                    name: "image",
                    component: "image",
                    uploadDir: () => "/pwd",
                    parse: ({ previewSrc }) => previewSrc,
                    previewSrc: (src) => src,
                  },
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
        ],
      },
      {
        name: "videoSection",
        label: "影片區段 VideoSection",
        component: "group",
        fields: [
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
        ],
      },
      {
        name: "reference Section",
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
        ],
      },
    ],
  },
];
