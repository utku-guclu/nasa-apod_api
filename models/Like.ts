// likeModel.ts

import mongoose, { Document, Schema } from "mongoose";

export interface LikeDocument extends Document {
  userId: string;
  imageId: Schema.Types.ObjectId;
}

const LikeSchema: Schema = new Schema({
  userId: { type: String, required: true },
  imageId: { type: Schema.Types.ObjectId, ref: "Image", required: true },
});

const LikeModel =
  mongoose.models.Like || mongoose.model<LikeDocument>("Like", LikeSchema);

export default LikeModel;
