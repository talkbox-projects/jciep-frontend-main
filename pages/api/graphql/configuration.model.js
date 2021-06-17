import { model, models, Schema } from "mongoose";

const configurationSchema = Schema({
  key: {
    type: String,
    index: true,
  },
  lang: {
    type: String,
    index: true,
  },
  value: {
    type: Schema.Types.Mixed,
  },
});

export default models["configuration"] ??
  model("configuration", configurationSchema);
