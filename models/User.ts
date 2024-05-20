// userModel.ts

import mongoose, { Document, Schema } from "mongoose";

export interface UserDocument extends Document {
  email: string;
  name: string;
  image: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
});

const UserModel =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

export default UserModel;
