import { S3Client } from "@aws-sdk/client-s3";
import { config } from ".";

const s3Config = new S3Client({
  region: "auto",
  endpoint: process.env.R2_URL!,
  credentials: {
    accessKeyId: config.r2.accessKeyId!,
    secretAccessKey: config.r2.secretAccessKey!,
  },
});

export default s3Config;
