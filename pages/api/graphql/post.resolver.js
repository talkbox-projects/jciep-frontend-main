import mongoose from "mongoose";
import PostModel from "./post.model";

export default {
  Query: {
    PostSearch: async (_parent, { lang, status = [], limit, offset, category }) => {
      const posts = await PostModel.find({
        ...(lang && { lang }),
        ...(status?.length && { status: { $in: status } }),
        ...(category?.length && { category: { $in: category } }),
      })
        .sort({ publishDate: -1 })
        .skip(offset)
        .limit(limit)
        .exec();
      return posts;
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
    PostGetHotest: (_parent, { limit = 3 }) => {
      /**
       * get first {limit} posts with greatest view count
       */
    },
    PostGetRelated: (_parent, { id }) => {
      /**
       * get related posts of a post specified by id
       * logic to be confirmed
       */
    },
    PostGetLatest: (_parent, { page = 1, limit = 10 }) => {
      /**
       * get latest posts of a post specified by id
       * logic to be confirmed
       */
    },
  },
  Mutation: {
    PostUpdate: async (_parent, { input: { id, ..._post } }) => {
      const post = await PostModel.findByIdAndUpdate(id, _post, {
        new: true,
      }).exec();
      return post;
    },
    PostCreate: async (_parent, { input: _post }) => {
      if (!_post.slug) {
        throw new Error("Invalid Slug");
      }
      const existingPost = await PostModel.findOne({ slug: _post.slug });
      if (existingPost) {
        throw new Error("Slug is already in use");
      } else {
        const post = await PostModel.create(_post);
        return post;
      }
    },

    PostDelete: async (_parent, { input: { id } }) => {
      try {
        const post = await PostModel.findByIdAndDelete(id);
        return true;
      } catch (error) {
        return false;
      }
    },

    PostRead: async (_parent, { input: { id } }) => {
      const post = await PostModel.findByIdAndUpdate(id, {
        $inc: { viewCount: 1 },
      }).exec();
      return post;
    },
  },
};
