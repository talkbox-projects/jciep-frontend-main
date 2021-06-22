const wordListFieldsForCMS = ({ name = "wordings" }) => ({
  name,
  component: "group-list",
  label: "字串 Static Wordings",
  description: "Store all the static wordings for this page",
  itemProps: ({ id: key, key: label }) => ({
    key,
    label,
  }),
  defaultItem: () => ({
    id: Math.random().toString(36).substr(2, 9),
  }),
  fields: [
    {
      name: "key",
      label: "辨別碼 Key",
      component: "text",
    },
    {
      name: "value",
      label: "字串 Value",
      component: "text",
    },
  ],
});
export default wordListFieldsForCMS;
