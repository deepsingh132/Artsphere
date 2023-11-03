import mongoose from "mongoose";

export const connectMongoDB = async () => {
  const uri = process.env.MONGODB_URI as string;
  if (!uri) {
    return console.error("MongoDB URI not found!");
  }
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error: ", error.message);
  }
};