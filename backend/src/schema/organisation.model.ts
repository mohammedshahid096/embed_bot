import mongoose, { Model, Schema } from "mongoose";
import modelConstants from "../constants/model.constant";

export interface OrganizationInterface {
  email?: string;
  website: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<OrganizationInterface>(
  {
    name: { type: String, required: true },
    website: { type: String, required: true },
    email: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const OrganizationModel: Model<OrganizationInterface> = mongoose.model(
  modelConstants.organization,
  organizationSchema,
);

export default OrganizationModel;
