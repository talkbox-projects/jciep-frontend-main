export default {
  textBlock: {
    label: "文字 Text",
    key: "text-block",
    itemProps: ({ id: key, content: label }) => ({
      key,
      label: `${label}(文字 Text)`,
    }),
    defaultItem: {
      content: "",
      textcolor: "#1E1E1E",
      bold: false,
    },
    fields: [
      {
        name: "content",
        label: "內容 Content",
        component: "text",
      },
      {
        name: "textcolor",
        label: "文字顏色 Text color",
        component: "color",
      },
      {
        name: "bold",
        label: "粗體 Bold",
        component: "toggle",
      },
    ],
  },
  lineBreakBlock: {
    label: "換行 Line Break",
    key: "line-break-block",
    defaultItem: {
      content: "",
      textcolor: "#1E1E1E",
      bold: false,
    },
    fields: [],
  },
};
