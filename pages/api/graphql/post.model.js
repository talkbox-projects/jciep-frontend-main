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
    type: Date,
    index: true,
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
  featureDisplay: {
    type: Boolean,
  },
  content: {
    type: Schema.Types.Mixed,
  },
  viewCount: {
    type: Schema.Types.Number,
    index: true,
  },
});

export default models["post"] ?? model("post", postSchema);
