import { model, models, Schema } from "mongoose";

const pageSchema = Schema({
  key: {
    type: String,
  },
  lang: {
    type: String,
    default: "zh",
  },
  content: {
    type: Schema.Types.Mixed,
  },
});

export default models["page"] ?? model("page", pageSchema);
