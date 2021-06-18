import { usePlugin } from "@tinacms/react-core";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";

const PostCreatorPlugin = {
  __type: "content-creator",
  name: "新增分享",
  fields: [
    {
      name: "lang",
      component: "select",
      label: "語言",
      options: [
        { value: "en", label: "English" },
        { value: "zh", label: "繁體中文" },
      ],
      defaultValue: "zh",
    },
    {
      name: "publishDate",
      label: "發佈日期 Publish Date",
      component: "date",
      dateFormat: "MMMM DD YYYY",
      timeFormat: true,
    },
    {
      name: "title",
      label: "標題 Title",
      component: "text",
    },
  ],
  onSubmit: async (values) => {
    const mutation = gql`
      mutation PostCreate($input: PostCreateInput) {
        PostCreate(input: $input) {
          id
        }
      }
    `;
    const variables = {
      input: values,
    };
    await getGraphQLClient().request(mutation, variables);
  },
};

const withPostCreatorCMS = (Component) => (props) => {
  usePlugin(PostCreatorPlugin);
  return <Component {...props} />;
};
export default withPostCreatorCMS;
