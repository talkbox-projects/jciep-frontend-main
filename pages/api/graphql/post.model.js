import { model, models, Schema } from "mongoose";

const postSchema = Schema({
  lang: {
    type: String,
    default: "zh",
  },
  title: {
    type: String,
  },
  publishDate: {
    type: String,
  },
  slug: {
    type: String,
  },
  excerpt: {
    type: String,
  },
  coverImage: {
    type: String,
  },
  category: {
    type: String,
  },
  status: {
    type: String,
  },
  tags: {
    type: [String],
  },
  references: [
    {
      label: String,
      url: String,
    },
  ],
  content: {
    type: Schema.Types.Mixed,
  },
});

export default models["post"] ?? model("post", postSchema);
