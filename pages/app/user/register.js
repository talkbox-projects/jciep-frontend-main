import {
  Box,
  Button,
  Text,
  VStack,
  FormControl,
  Input,
  SimpleGrid,
  GridItem,
  Checkbox,
  FormHelperText,
  FormLabel,
  Link,
} from "@chakra-ui/react";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import ReactSelect from "react-select";
import { getPage } from "../../../utils/page/getPage";
import withPageCMS from "../../../utils/page/withPageCMS";
import { useRouter } from "next/router";
import { useAppContext } from "../../../store/AppStore";
import { gql } from "graphql-request";
import { getGraphQLClient } from "../../../utils/apollo";
import HighlightHeadline from "../../../components/HighlightHeadline";
import getSharedServerSideProps from "../../../utils/server/getSharedServerSideProps";
import wordExtractor from "../../../utils/wordExtractor";

const PAGE_KEY = "app_user_register";

export const getServerSideProps = async (context) => {
  const page = (await getPage({ key: PAGE_KEY, lang: context.locale })) ?? {};

  return {
    props: {
      page,
      isLangAvailable: context.locale === page.lang,
      ...(await getSharedServerSideProps(context))?.props,
      lang: context.locale,
    },
  };
};

const AppUserRegister = ({ page }) => {
  return (
    <VStack py={36}>
      <Box fontSize={["2xl", "2xl", "4xl", "4xl"]}>
        <HighlightHeadline>歡迎註冊</HighlightHeadline>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
      </Box>
    </VStack>
  );
};

export default withPageCMS(AppUserRegister, {
  key: PAGE_KEY,
  fields: [
    {
      name: "step",
      label: "標題 step",
      component: "group",
      fields: [
        {
          name: "title",
          label: "主標題 Title",
          component: "text",
        },
        {
          name: "subTitle",
          label: "副標題 Sub title",
          component: "text",
        },
      ],
    },
    {
      name: "heading",
      label: "標題 Heading",
      component: "group",
      fields: [
        {
          name: "description",
          label: "描述 Description",
          component: "text",
        },
      ],
    },
    {
      name: "form",
      label: "形式 Form",
      component: "group",
      fields: [
        {
          name: "chineseName",
          label: "中文名 Chinese Name Label",
          component: "text",
        },
        {
          name: "englishName",
          label: "英文名 English Name Label",
          component: "text",
        },
        {
          name: "dob",
          label: "出生日期 Date of Birth ",
          component: "text",
        },
        {
          name: "gender",
          label: "性別 Gender Label",
          component: "group",
          fields: [
            {
              name: "label",
              label: "標籤 Label",
              component: "text",
            },
            {
              name: "options",
              label: "區段  Options",
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
                  name: "label",
                  label: "標籤 Label",
                  component: "text",
                },
                {
                  name: "value",
                  label: "價值 Value",
                  component: "text",
                },
              ],
            },
          ],
        },
        // {
        //   name: "age",
        //   label: "年齡 Age",
        //   component: "group",
        //   fields: [
        //     {
        //       name: "label",
        //       label: "標籤 Label",
        //       component: "text",
        //     },
        //     {
        //       name: "options",
        //       label: "區段  Options",
        //       component: "group-list",
        //       itemProps: ({ id: key, caption: label }) => ({
        //         key,
        //         label,
        //       }),
        //       defaultItem: () => ({
        //         id: Math.random().toString(36).substr(2, 9),
        //       }),
        //       fields: [
        //         {
        //           name: "label",
        //           label: "標籤 Label",
        //           component: "text",
        //         },
        //         {
        //           name: "value",
        //           label: "價值 Value",
        //           component: "text",
        //         },
        //       ],
        //     },
        //   ],
        // },
        {
          name: "residentRestrict",
          label: "居住區 Resident District ",
          component: "group",
          fields: [
            {
              name: "label",
              label: "標籤 Label",
              component: "text",
            },
            {
              name: "options",
              label: "區段  Options",
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
                  name: "label",
                  label: "標籤 Label",
                  component: "text",
                },
                {
                  name: "value",
                  label: "價值 Value",
                  component: "text",
                },
              ],
            },
          ],
        },
        {
          name: "industry",
          label: "行業/工作 Industry/Job ",
          component: "group",
          fields: [
            {
              name: "label",
              label: "標籤 Label",
              component: "text",
            },
            {
              name: "options",
              label: "區段  Options",
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
                  name: "label",
                  label: "標籤 Label",
                  component: "text",
                },
                {
                  name: "value",
                  label: "價值 Value",
                  component: "text",
                },
              ],
            },
          ],
        },
        {
          name: "terms",
          label: "條款和條件 T&C Label",
          component: "group",
          fields: [
            {
              name: "text",
              label: "文本 text",
              component: "text",
            },
            {
              name: "link",
              label: "關聯 Link",
              component: "text",
            },
            {
              name: "url",
              label: "關聯 Url",
              component: "text",
              placeholder: "https://",
            },
          ],
        },
        {
          name: "continue",
          label: "繼續標籤 Continue Label",
          component: "text",
        },
      ],
    },
  ],
});
