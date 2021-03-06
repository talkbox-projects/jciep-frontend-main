import mongoose from "mongoose";
import { checkIfAdmin } from "../../../utils/auth";
import PostModel from "./post.model";

export default {
  Query: {
    PostSearch: async (
      _parent,
      { lang, limit, page, category, featureDisplay },
      context
    ) => {
      let status = ["published"];
      // if (!checkIfAdmin(context?.auth?.identity)) {
      //   status = ["published", "draft"];
      // } else {
      //   status = ["removed", "published"];
      // }

      const articlesData = await PostModel.aggregate([
        {
          $match: {
            ...(featureDisplay && { featureDisplay }),
            ...(lang && { lang }),
            ...{ status: { $in: status } },
            ...(category?.length && { category: { $in: [category] } }),
          },
        },
        {
          $sort: {
            publishDate: -1,
            _id: 1,
          },
        },
        {
          $facet: {
            totalRecords: [
              {
                $count: "total",
              },
            ],
            data: [
              {
                $skip: page > 0 ? (page - 1) * limit : 0,
              },
              {
                $limit: limit,
              },
            ],
          },
        },
      ]).exec();
      const articles = articlesData[0].data.map((post) => {
        post.id = post._id;
        return post;
      });
      const data = {
        data: articles,
        totalRecords: articlesData[0]?.totalRecords[0]?.total,
      };
      return data;
    },
    PostGet: async (_parent, { lang, idOrSlug }) => {
      const isObjectId = mongoose.isValidObjectId(idOrSlug);
      if (isObjectId) {
        const post = await PostModel.findById(idOrSlug);
        return post;
      } else {
        const post = await PostModel.findOne({
          lang,
          slug: idOrSlug,
        });
        return post;
      }
    },
    PostGetHotest: async (_parent, { limit = 3 }) => {
      const articles = await PostModel.find({
        status: "published",
      })
        .sort({ viewCount: -1, _id: 1 })
        .limit(limit)
        .exec();

      return articles;
    },
    PostGetRelated: async (_parent, { category, limit, id }) => {
      const posts = await PostModel.find({
        ...(category?.length && { category: { $in: category } }),
        _id: { $ne: new mongoose.Types.ObjectId(id) },
      })
        .sort({ publishDate: -1, _id: 1 })
        .limit(limit)
        .exec();
      return posts;
    },
  },
  Mutation: {
    PostUpdate: async (_parent, { input: { id, ..._post } }, context) => {
      if (!checkIfAdmin(context?.auth?.identity)) {
        throw new Error("Permission Denied!");
      }

      const post = await PostModel.findByIdAndUpdate(id, _post, {
        new: true,
      }).exec();
      return post;
    },
    PostCreate: async (_parent, { input: _post }, context) => {
      if (!checkIfAdmin(context?.auth?.identity)) {
        throw new Error("Permission Denied!");
      }

      if (!_post.slug) {
        throw new Error("Invalid Slug");
      }
      const existingPost = await PostModel.findOne({ slug: _post.slug });
      if (existingPost) {
        throw new Error("Slug is already in use");
      } else {
        const post = await PostModel.create({ status: "draft", ..._post });
        return post;
      }
    },

    PostDelete: async (_parent, { id }, context) => {
      if (!checkIfAdmin(context?.auth?.identity)) {
        throw new Error("Permission Denied!");
      }

      try {
        await PostModel.findByIdAndDelete(id);
        return true;
      } catch (error) {
        return false;
      }
    },

    PostRead: async (_parent, { id }) => {
      await PostModel.findByIdAndUpdate(id, {
        $inc: { viewCount: 1 },
      }).exec();
      return true;
    },
  },
};
