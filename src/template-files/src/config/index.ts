import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: string | number;
  apiPrefix?: string;
  mongoUri?: string;
  jwtSecret?: string;
  saltRounds: number;
  environment: "staged" | "production" | "development";
  debugMode?: boolean;

  // Cloudflare R2 Configs
  r2?: {
    accountId?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    bucketName?: string;
    publicUrl?: string;
  };
}

export const config: Config = {
  port: process.env.PORT || 8081,
  apiPrefix: process.env.API_PREFIX || "/api/v1",
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  saltRounds: 10,
  environment: (process.env.NODE_ENV as Config["environment"]) || "development",
  debugMode: process.env.DEBUG_MODE === "true",

  r2: {
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESSKEY,
    secretAccessKey: process.env.R2_SECRET_ACCESSKEY,
    bucketName: process.env.R2_BUCKET_NAME,
    publicUrl: process.env.R2_PUBLIC_URL,
  },
};
