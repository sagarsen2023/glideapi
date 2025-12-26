import mongoose from "mongoose";
import { config } from ".";
import { errorLog, successLog } from "@/utils/logger";

export const connectToDb = async () => {
  const uri = config.mongoUri;
  console.log(uri);
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
