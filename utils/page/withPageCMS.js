import { useForm, usePlugin } from "@tinacms/react-core";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";
import { useRouter } from "next/router";
import { useEffect } from "react";
import wordListFieldsForCMS from "../tina/wordListFieldsForCMS";
const withPageCMS =
  (Component, { key, fields = [], propName = "page" }) =>
  (props) => {
    const router = useRouter();
    const _page = props?.[propName] ?? {};
    const [page, form] = useForm(
      {
        key,
        initialValues: _page,
        fields: [
          {
            name: "content.seo",
            component: "group",
            label: "SEO設定 SEO Config",
            fields: [
              {
                name: "title",
                label: "標題 Title",
                component: "text",
              },
              {
                name: "description",
                label: "描述 Description",
                component: "text",
              },
              {
                name: "thumbnail",
                label: "圖標 Thumbnail",
                component: "text",
              },
            ],
          },
          {
            name: "content",
            label: "頁面內容 Page Content",
            component: "group",
            fields: [...fields, wordListFieldsForCMS({ name: "wordings" })],
          },
        ],
        onSubmit: async (values) => {
          const mutation = gql`
            mutation PageUpdate($input: PageUpdateInput) {
              PageUpdate(input: $input) {
                key
                lang
                content
              }
            }
          `;
          const variables = {
            input: {
              key,
              lang: router.locale,
              ...values,
            },
          };
          await getGraphQLClient().request(mutation, variables);
        },
      },
      {
        values: _page,
      }
    );

    usePlugin(form);

    return (
      <Component
        {...{
          ...props,
          [propName]: page,
        }}
      />
    );
  };
export default withPageCMS;
