import { model, models, Schema } from "mongoose";
import { uuidv4 } from "../../../utils/general";

const accessTokenSchema = Schema({
    _id: String,
    userId: Schema.Types.ObjectId,
    createdAt: {
        type: Date,
    }
});

export const AccessToken = models["AccessToken"] ?? model("AccessToken", accessTokenSchema);
