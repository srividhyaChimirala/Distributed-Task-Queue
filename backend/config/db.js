import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  console.log("MONGO_URI exists:", !!uri);

  if (!uri) {
    throw new Error("MONGO_URI not defined");
  }

  await mongoose.connect(uri);

  console.log("MongoDB connected");
};

export default connectDB;