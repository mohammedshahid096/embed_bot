import mongoose, { Document, Model, Schema } from "mongoose";
import modelConstants from "../constants/model.constant";

export interface ApiKeyInterface extends Document {
  organisationId: mongoose.Types.ObjectId;
  gemini?: {
    encryptedKey: string;
    keyLastFour: string;
  };
  openrouter?: {
    encryptedKey: string;
    keyLastFour: string;
  };
  openai?: {
    encryptedKey: string;
    keyLastFour: string;
  };
  anthropic?: {
    encryptedKey: string;
    keyLastFour: string;
  };
  groq?: {
    encryptedKey: string;
    keyLastFour: string;
  };
  isActive: boolean;
  addedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const apiKeySchema = new Schema<ApiKeyInterface>(
  {
    organisationId: {
      type: Schema.Types.ObjectId,
      ref: modelConstants.organization,
      required: true,
    },
    gemini: {
      encryptedKey: { type: String },
      keyLastFour: { type: String },
    },

    openrouter: {
      encryptedKey: { type: String },
      keyLastFour: { type: String },
    },

    openai: {
      encryptedKey: { type: String },
      keyLastFour: { type: String },
    },

    anthropic: {
      encryptedKey: { type: String },
      keyLastFour: { type: String },
    },

    groq: {
      encryptedKey: { type: String },
      keyLastFour: { type: String },
    },

    isActive: { type: Boolean, default: true },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: modelConstants.user,
      required: true,
    },
  },
  { timestamps: true },
);

const ApiKeyModel: Model<ApiKeyInterface> = mongoose.model(
  modelConstants.apiKey,
  apiKeySchema,
);

export default ApiKeyModel;
