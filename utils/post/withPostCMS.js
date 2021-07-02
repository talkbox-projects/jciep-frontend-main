import { useForm, usePlugin } from "@tinacms/react-core";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../apollo";
import { useRouter } from "next/router";
import { useEffect } from "react";
import moment from "moment";

const withPostCMS =
  (Component, { propName = "post" } = {}) =>
  (props) => {
    const router = useRouter();
    const _post = props?.[propName];

    const categories = props?.setting?.value?.categories ?? [];
    const [post, form] = useForm(
      {
        key: router.query.idOrSlug,
        initialValues: _post,
        fields: [
          {
            name: "slug",
            label: "後綴路由 Slug",
            component: "text",
            description: "This post route would be /sharing/{slug}",
          },
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
            name: "status",
            component: "select",
            label: "狀態",
            options: [
              { value: "published", label: "己發佈 Published" },
              { value: "draft", label: "草稿 Draft" },
              { value: "removed", label: "己刪除 Removed" },
            ],
            defaultValue: "draft",
          },
          {
            name: "category",
            label: "分類 Category",
            component: "select",
            defaultValue: "",
            options: [
              { value: "notSpecified", label: "無 N/A" },
              ...categories.map(({ key, label }) => ({
                value: key,
                label: label,
              })),
            ],
          },
          {
            name: "title",
            label: "標題 Title",
            component: "text",
          },
          {
            name: "excerpt",
            label: "概述 Excerpt",
            component: "textarea",
          },
          {
            label: "圖片 Cover Image",
            name: "coverImage",
            component: "image",
            uploadDir: () => "/sharing/images",
            parse: ({ previewSrc }) => previewSrc,
            previewSrc: (src) => src,
          },
          {
            name: "content.blocks",
            component: "blocks",
            description: "Content of blocks",
            label: "文章內容",
            templates: {
              "content-block": {
                label: "文字內容 Text Content",
                key: "content-block",
                defaultItem: {
                  content: "",
                },
                fields: [
                  { name: "content", label: "Content", component: "html" },
                ],
              },
              "image-block": {
                label: "圖片 Image",
                key: "content-block",
                defaultItem: {
                  content: "",
                },
                fields: [
                  {
                    label: "圖片 Image",
                    name: "image",
                    component: "image",
                    uploadDir: () => "/sharing/images",
                    parse: ({ previewSrc }) => previewSrc,
                    previewSrc: (src) => src,
                  },
                  { name: "caption", label: "描述 Caption", component: "text" },
                ],
              },

              "video-block": {
                label: "影片 Video",
                key: "video-block",
                defaultItem: {
                  content: "",
                },
                fields: [
                  {
                    label: "影片 Video Link",
                    name: "link",
                    placeholder: "",
                    description: "Youtube embedded link",
                    component: "text",
                  },
                  { name: "caption", label: "描述 Caption", component: "text" },
                ],
              },
            },
          },
          {
            name: "featureDisplay",
            component: "toggle",
            label: "顯示於首頁",
          },
          {
            name: "content.feature",
            component: "group",
            description: "Group",
            label: "首頁顯示 Show in Home",
            fields: [
              {
                name: "image",
                label: "首頁圖片  Image",
                component: "image",
                uploadDir: () => "/sharing/images",
                parse: ({ previewSrc }) => previewSrc,
                previewSrc: (src) => src,
              },
              {
                name: "persona",
                label: "人物/機構 Person/Organization",
                component: "text",
              },
            ],
          },
          {
            name: "tags",
            label: "標籤 Tags",
            component: "list",
            field: {
              component: "text",
            },
          },
          {
            name: "references",
            label: "參考資料 References",
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
                name: "label",
                component: "text",
                label: "標籤 Label",
              },
              {
                name: "url",
                component: "text",
                label: "網址 URL",
              },
            ],
          },
        ],
        onSubmit: async (values) => {
          const mutation = gql`
            mutation PostUpdate($input: PostUpdateInput) {
              PostUpdate(input: $input) {
                id
                slug
                lang
                title
                excerpt
                publishDate
                status
                tags
                references {
                  label
                  url
                }
                category
                featureDisplay
                content
              }
            }
          `;
          values.publishDate = values.publishDate
            ? moment(values.publishDate).toDate()
            : moment().toDate();
          const variables = {
            input: {
              id: _post?.id,
              ...values,
              references: (values?.references ?? []).map(
                ({ id, ...reference }) => reference
              ),
            },
          };
          await getGraphQLClient().request(mutation, variables);
        },
      },
      {
        values: _post,
      }
    );

    usePlugin(form);

    return (
      <Component
        {...{
          ...props,
          [propName]: post,
        }}
      />
    );
  };
export default withPostCMS;
