import mongoose, { Document, Model, Schema } from "mongoose";
import modelConstants from "../constants/model.constant";

type CrawlStatusCodes = "pending" | "processing" | "completed" | "failed";

export interface CrawlJobInterface extends Document {
  organisationId: mongoose.Types.ObjectId;
  selectedUrls: string[];
  status: CrawlStatusCodes;
  progress: {
    total: number;
    completed: number;
    failed: number;
  };
  results: {
    url: string;
    status: CrawlStatusCodes;
    knowledgeBaseId: mongoose.Types.ObjectId;
    error: string;
  }[];
  createdAt: Date;
  completedAt: Date;
}

const crawlJobSchema = new Schema<CrawlJobInterface>(
  {
    organisationId: {
      type: Schema.Types.ObjectId,
      ref: modelConstants.organization,
      required: true,
    },
    selectedUrls: [String],
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    progress: {
      total: Number,
      completed: Number,
      failed: Number,
    },
    results: [
      {
        url: String,
        status: { type: String, enum: ["pending", "success", "failed"] },
        knowledgeBaseId: { type: Schema.Types.ObjectId, ref: "KnowledgeBase" },
        error: String,
      },
    ],
    completedAt: Date,
  },
  { timestamps: true },
);

const CrawlJobModel: Model<CrawlJobInterface> = mongoose.model(
  modelConstants.crawlJob,
  crawlJobSchema,
);

export default CrawlJobModel;
