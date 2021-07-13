import PageModel from "./page.model";

export default {
  Query: {
    PageGet: async (_parent, { lang, key }) => {
      const page = await PageModel.findOne({ lang, key }).exec();
      return page;
    },
  },
  Mutation: {
    PageUpdate: async (_parent, { input: { id, key, lang, ..._page } }) => {
      const page = await PageModel.findOneAndUpdate({ lang, key }, _page, {
        new: true,
        upsert: true,
      }).exec();
      return page;
    },
  },
};
