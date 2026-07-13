import mongoose, { Document, Model, Schema } from "mongoose";
import modelConstants from "../constants/model.constant";
import { OrganizationInterface } from "./organisation.model";

export interface UserInterface extends Document {
  email: string;
  password: string;
  name: string;
  authProvider?: "local" | "google" | "github";
  providerId?: string;
  isEmailVerified?: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
  organisationId?: mongoose.Types.ObjectId | OrganizationInterface;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserInterface>(
  {
    name: { type: String, required: true },
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
    organisationId: {
      type: Schema.Types.ObjectId,
      ref: modelConstants.organization,
    },
  },
  { timestamps: true },
);

const UserModel: Model<UserInterface> = mongoose.model(
  modelConstants.user,
  userSchema,
);

export default UserModel;
