import mongoose, { Document, Model, Schema } from "mongoose";
import modelConstants from "../constants/model.constant";

export type KnowledgeBaseStatus = "processing" | "ready" | "failed";
export type KnowledgeBaseSourceType = "pdf" | "url" | "text" | "faq";

export interface KnowledgeBaseInterface extends Document {
  organisationId: mongoose.Types.ObjectId;
  name: string;
  sourceType: KnowledgeBaseSourceType;
  sourceUrl: string;
  status: KnowledgeBaseStatus;
  chunkCount: number;
  content: string;
  vectorNamespace: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const knowledgeBaseSchema = new Schema<KnowledgeBaseInterface>(
  {
    organisationId: {
      type: Schema.Types.ObjectId,
      ref: modelConstants.organization,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    sourceType: {
      type: String,
      enum: ["pdf", "url", "text", "faq"],
      default: "url",
    },
    sourceUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["processing", "ready", "failed"],
      default: "processing",
    },
    chunkCount: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
      default: "",
    },
    vectorNamespace: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const KnowledgeBaseModel: Model<KnowledgeBaseInterface> = mongoose.model(
  modelConstants.knowledgeBase,
  knowledgeBaseSchema,
);

export default KnowledgeBaseModel;
