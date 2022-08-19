import { checkIfAdmin } from "../../../utils/auth";
import PageModel from "./page.model";

export default {
  Query: {
    PageAll: async () => {
      const page = await PageModel.find().exec();
      return page;
    },
    PageGet: async (_parent, { lang, key }) => {
      const page = await PageModel.findOne({ lang, key }).exec();
      return page;
    },
  },
  Mutation: {
    PageUpdate: async (_parent, { input: { id, key, lang, ..._page } }, context) => {


      if (!checkIfAdmin(context?.auth?.identity)) {
        throw new Error("Permission Denied!");
      }

      const page = await PageModel.findOneAndUpdate({ lang, key }, _page, {
        new: true,
        upsert: true,
      }).exec();
      return page;
    },
  },
};
