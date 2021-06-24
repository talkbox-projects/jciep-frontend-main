import { usePlugin, useCMS } from "@tinacms/react-core";
import { gql } from "graphql-request";
import { useRouter } from "next/router";
import moment from "moment";
import { getGraphQLClient } from "../apollo";

const withPostCreatorCMS = (Component) => (props) => {
  const router = useRouter();
  const cms = useCMS();

  const PostCreatorPlugin = {
    __type: "content-creator",
    name: "新增分享 Create New Post",
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
      {
        name: "slug",
        label: "後綴路由 Slug",
        component: "text",
        description: "This post route would be /sharing/{slug}",
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
      values.publishDate = values.publishDate? moment(values.publishDate).toDate() : moment().toDate();
      const variables = {
        input: values,
      };
      try {
        await getGraphQLClient().request(mutation, variables);
        router.push(`/sharing/${values.slug}`);
      } catch (err) {
        cms.alerts.error("Error creating Post: " + err)
        console.log("Error creating Post", err);
      }

    },
  };

  usePlugin(PostCreatorPlugin);
  return <Component {...props} />;
};
export default withPostCreatorCMS;
