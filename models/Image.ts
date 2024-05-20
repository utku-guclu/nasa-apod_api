import mongoose, { Document, Schema } from "mongoose";

export interface ImageDocument extends Document {
  title: string;
  url: string;
  date: string;
  likes: number;
  liked: boolean;
}

const ImageSchema: Schema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  date: { type: String, required: true, unique: true },
  likes: { type: Number, default: 0 },
  liked: { type: Boolean, default: false },
});

const ImageModel =
  mongoose.models.Image || mongoose.model<ImageDocument>("Image", ImageSchema);

export default ImageModel;
