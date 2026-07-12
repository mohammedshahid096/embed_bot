import mongoose, { Model, Schema } from "mongoose";
import modelConstants from "../constants/model.constant";

export interface UserInterface {
  email: string;
  password: string;
  name: string;
  authProvider?: "local" | "google" | "github";
  providerId?: string;
  isEmailVerified?: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserInterface>(
  {
    name: String,
    email: { type: String, unique: true, required: true, index: true },
    password: { type: String, select: false },
    authProvider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
    providerId: String,
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true },
);

const UserModel: Model<UserInterface> = mongoose.model(
  modelConstants.user,
  userSchema,
);

export default UserModel;
