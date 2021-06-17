import { HStack } from "@chakra-ui/layout";
import withScreenCMS from "../utils/hoc/withScreenCMS";

const Footer = () => {
  return <HStack></HStack>;
};

export default withScreenCMS(Footer, {
  key: "footer",
  label: "首尾 Header",
  fields: [
    {
      name: "title",
      label: "title",
      component: "text",
    },
  ],
});
