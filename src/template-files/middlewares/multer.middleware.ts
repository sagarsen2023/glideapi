import multer from "multer";
import { Express } from "express";
import { AuramRequest } from "@/types/common/auram-request.type";

export interface MulterRequest extends AuramRequest {
  file?: Express.Multer.File;
}

const fileFilter = (req: MulterRequest, file: Express.Multer.File, cb: any) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPEG, PNG, and JPG images are allowed"), false);
  }

  return cb(null, true);
};

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB
  },
});

export default upload;
