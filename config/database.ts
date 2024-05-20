import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return true;
  }

  try {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI!);
    console.log("MONGO CONNECTED!");
    return true;
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
