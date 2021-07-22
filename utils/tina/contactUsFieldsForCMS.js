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
        uploadDir: () => "/contactUs",
        parse: ({ previewSrc }) => previewSrc,
        previewSrc: (src) => src,
      },
      {
        label: "左图 Image Left",
        name: "bgImageLeft",
        component: "image",
        uploadDir: () => "/contactUs",
        parse: ({ previewSrc }) => previewSrc,
        previewSrc: (src) => src,
      },
      {
        label: "右图 Image Right",
        name: "bgImageRight",
        component: "image",
        uploadDir: () => "/contactUs",
        parse: ({ previewSrc }) => previewSrc,
        previewSrc: (src) => src,
      },
    ],
  },
  {
    name: "contactSection",
    label: "聯絡 Section",
    component: "group",
    fields: [
      {
        name: "bgColor",
        label: "背景颜色 Background Color",
        component: "color",
      },
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
        name: "contactInfo",
        label: "聯絡資料 Contact Info",
        component: "group",
        fields: [
          {
            name: "bgColor",
            label: "背景颜色 Background Color",
            component: "color",
          },
          {
            name: "logo",
            label: "Logo",
            component: "image",
            uploadDir: () => "/contactUs",
            parse: ({ previewSrc }) => previewSrc,
            previewSrc: (src) => src,
          },
          {
            name: "title",
            label: "標題 Title",
            component: "text",
          },
          {
            name: "address",
            label: "地址 Address",
            component: "textarea",
          },
          {
            name: "email",
            label: "電郵 Email",
            component: "text",
          },
          {
            name: "phone",
            label: "電話 Phone",
            component: "text",
          },
          {
            name: "fax",
            label: "傳真 Fax",
            component: "text",
          },
          {
            name: "facebookPage",
            label: "Facebook Page",
            component: "text",
          },
        ],
      },
    ],
  },
];
