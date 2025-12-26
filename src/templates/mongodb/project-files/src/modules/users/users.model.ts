import { Schema, model, models, type Document, type Model } from "mongoose";

export interface UserType extends Document {
  fullName: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<UserType>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Users: Model<UserType> =
  models.Users || model<UserType>("Users", UserSchema);
