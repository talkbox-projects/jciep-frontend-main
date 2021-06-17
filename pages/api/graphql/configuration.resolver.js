import ConfigurationModel from "./configuration.model";

export default {
  Query: {
    ConfigurationGet: async (_parent, { key, lang }) => {
      return ConfigurationModel.findOne({ key, lang }).exec();
    },
  },
  Mutation: {
    ConfigurationUpdate: async (_parent, { input: { key, lang, value } }) => {
      return await ConfigurationModel.findOneAndUpdate(
        { key, lang },
        { value },
        {
          new: true,
          upsert: true,
        }
      ).exec();
    },
  },
};
