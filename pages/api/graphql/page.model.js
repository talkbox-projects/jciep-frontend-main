import { model, models, Schema } from "mongoose";

const pageSchema = Schema({
  key: {
    type: String,
  },
  lang: {
    type: String,
    default: "en",
  },
  content: {
    type: Schema.Types.Mixed,
  },
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
});

export default models["page"] ?? model("page", pageSchema);
