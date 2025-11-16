import { errorLog, successLog } from "@/utils/log";
import mongoose from "mongoose";
import { config } from ".";

export const connectToMongoDB = async () => {
  const uri = config.mongoUri;
  if (!uri) {
    errorLog("MONGODB_URI is not defined in environment variables");
    return;
  }
  try {
    const connection = await mongoose.connect(uri);
    if (connection.connection.readyState === 1) {
      successLog("Connected to MongoDB successfully");
    }
  } catch (error) {
    errorLog(`Error connecting to MongoDB: ${error}`);
  }
};
