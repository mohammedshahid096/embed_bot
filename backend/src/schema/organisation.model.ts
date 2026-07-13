import mongoose, { Document, Model, Schema } from "mongoose";
import modelConstants from "../constants/model.constant";
import { UserInterface } from "./user.model";

export interface OrganizationInterface extends Document {
  name: string;
  email: string;
  website: string;
  isActive: boolean;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  contact: string;
  description: string;
  userId: mongoose.Types.ObjectId | UserInterface;
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<OrganizationInterface>(
  {
    name: { type: String, required: true },
    website: { type: String, required: true },
    email: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    contact: { type: String, required: true },
    description: {
      type: String,
      minLength: 50,
      maxLength: 500,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: modelConstants.user,
      required: true,
    },
  },
  { timestamps: true },
);

const OrganizationModel: Model<OrganizationInterface> = mongoose.model(
  modelConstants.organization,
  organizationSchema,
);

export default OrganizationModel;
