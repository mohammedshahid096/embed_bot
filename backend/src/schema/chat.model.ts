import mongoose, { Document, Schema, Model } from "mongoose";
import modelConstants from "../constants/model.constant";

export interface IMessage {
  _id?: mongoose.Types.ObjectId;
  content?: string;
  role?: "human" | "ai";
  timestamp?: Date;
  metadata?: mongoose.Schema.Types.Mixed;
  tokenUsage?: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
  };
  status?: "processing" | "completed" | "failed";
  order?: number;
  error?: string;
}

export interface IChatMessage extends Document {
  date: Date;
  messages: IMessage[];
  chatBotId: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    content: { type: String },
    role: { type: String, enum: ["human", "ai"] },
    timestamp: { type: Date, default: Date.now },
    metadata: Schema.Types.Mixed,
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
    tokenUsage: {
      input_tokens: { type: Number, default: 0 },
      output_tokens: { type: Number, default: 0 },
      total_tokens: { type: Number, default: 0 },
    },
    order: { type: Number, required: true },
    error: { type: String },
  },
  { _id: true },
);

const messageSchema = new Schema<IChatMessage>(
  {
    date: { type: Date, required: true, default: Date.now },
    messages: [MessageSchema],
    chatBotId: {
      type: Schema.Types.ObjectId,
      ref: modelConstants.chatBot,
      required: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: modelConstants.organization,
      required: true,
    },
  },
  { timestamps: true },
);

const ChatMessageModel: Model<IChatMessage> = mongoose.model<IChatMessage>(
  modelConstants.chat,
  messageSchema,
);

export default ChatMessageModel;
