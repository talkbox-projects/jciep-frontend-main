import mongoose from "mongoose";
import PostModel from "./post.model";

export default {
  Query: {
    PostSearch: async (_parent, { lang, status = [], limit, offset }) => {
      const posts = await PostModel.find({
        ...(lang && { lang }),
        ...(status?.length && { status: { $in: status } }),
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
        const post = await PostModel.findById(idOrSlug).exec();
        return post;
      } else {
        const post = await PostModel.findOne({
          lang,
          slug: idOrSlug,
        }).exec();
        return post;
      }
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
      const post = await PostModel.create(_post);
      return post;
    },
  },
};
