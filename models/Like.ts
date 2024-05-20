// likeModel.ts

import mongoose, { Document, Schema } from "mongoose";
import { UserDocument } from "./User"; // Import UserDocument

export interface LikeDocument extends Document {
  userId: mongoose.Types.ObjectId | UserDocument; // Update userId type
  imageId: string;
}

const LikeSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference User schema
  imageId: { type: String, required: true },
});

const LikeModel =
  mongoose.models.Like || mongoose.model<LikeDocument>("Like", LikeSchema);

export default LikeModel;
