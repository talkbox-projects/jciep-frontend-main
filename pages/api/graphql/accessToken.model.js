import { model, models, Schema } from "mongoose";
import { uuidv4 } from "../../../utils/general";

const accessTokenSchema = Schema({
    _id: String,
    userId: String,
    createdAt: {
        type: Date,
    }
});

export const AccessToken = models["AccessToken"] ?? model("AccessToken", accessTokenSchema);
