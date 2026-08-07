import mongoose, { Document, Model, Schema } from "mongoose";
import modelConstants from "../constants/model.constant";
import { OrganizationInterface } from "./organisation.model";

export interface ChatConfigGeneral {
  botName: string;
  welcomeMessage: string;
  inputPlaceholder: string;
}

export interface ChatConfigTheme {
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderRadius: number;
}

export interface ChatConfigButton {
  bgColor: string;
  textColor: string;
  borderRadius: number;
  width: number;
  maxWidth: number;
}

export interface ChatConfigInput {
  bgColor: string;
  textColor: string;
  borderColor: string;
  borderRadius: number;
}

export interface ChatConfigMessages {
  botBgColor: string;
  botTextColor: string;
  userBgColor: string;
  userTextColor: string;
}

export interface ChatConfig {
  general: ChatConfigGeneral;
  theme: ChatConfigTheme;
  button: ChatConfigButton;
  input: ChatConfigInput;
  messages: ChatConfigMessages;
}

export interface AISettings {
  systemPrompt: string;
  temperature: number;
  model: string;
}

export interface ChatBotInterface extends Document {
  organizationId: mongoose.Types.ObjectId | OrganizationInterface;
  allowedDomains: string[];
  config: ChatConfig;
  ai: AISettings;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const generalSchema = new Schema<ChatConfigGeneral>(
  {
    botName: {
      type: String,
      default: "Embed Bot",
    },
    welcomeMessage: {
      type: String,
      default: "Hello! How can I help you today?",
    },
    inputPlaceholder: {
      type: String,
      default: "Type your message...",
    },
  },
  { _id: false },
);

const themeSchema = new Schema<ChatConfigTheme>(
  {
    accentColor: {
      type: String,
      default: "#7c3aed",
    },
    backgroundColor: {
      type: String,
      default: "",
    },
    textColor: {
      type: String,
      default: "",
    },
    borderColor: {
      type: String,
      default: "",
    },
    borderRadius: {
      type: Number,
      default: 16,
    },
  },
  { _id: false },
);

const buttonSchema = new Schema<ChatConfigButton>(
  {
    bgColor: {
      type: String,
      default: "",
    },
    textColor: {
      type: String,
      default: "#ffffff",
    },
    borderRadius: {
      type: Number,
      default: 28,
    },
    width: {
      type: Number,
      default: 56,
    },
    maxWidth: {
      type: Number,
      default: 160,
    },
  },
  { _id: false },
);

const inputSchema = new Schema<ChatConfigInput>(
  {
    bgColor: {
      type: String,
      default: "",
    },
    textColor: {
      type: String,
      default: "",
    },
    borderColor: {
      type: String,
      default: "",
    },
    borderRadius: {
      type: Number,
      default: 12,
    },
  },
  { _id: false },
);

const messagesSchema = new Schema<ChatConfigMessages>(
  {
    botBgColor: {
      type: String,
      default: "",
    },
    botTextColor: {
      type: String,
      default: "",
    },
    userBgColor: {
      type: String,
      default: "",
    },
    userTextColor: {
      type: String,
      default: "#ffffff",
    },
  },
  { _id: false },
);

const configSchema = new Schema<ChatConfig>(
  {
    general: {
      type: generalSchema,
      default: () => ({}),
    },
    theme: {
      type: themeSchema,
      default: () => ({}),
    },
    button: {
      type: buttonSchema,
      default: () => ({}),
    },
    input: {
      type: inputSchema,
      default: () => ({}),
    },
    messages: {
      type: messagesSchema,
      default: () => ({}),
    },
  },
  { _id: false },
);

const aiSchema = new Schema<AISettings>(
  {
    systemPrompt: {
      type: String,
      default: "",
    },
    temperature: {
      type: Number,
      default: 0.7,
      min: 0,
      max: 2,
    },
    model: {
      type: String,
      default: "gpt-4.1-mini",
    },
  },
  { _id: false },
);

// =======================
// Main Schema
// =======================

const chatBotSchema = new Schema<ChatBotInterface>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: modelConstants.organization,
      required: true,
    },

    allowedDomains: {
      type: [String],
      default: [],
    },

    config: {
      type: configSchema,
      default: () => ({}),
    },

    ai: {
      type: aiSchema,
      default: () => ({}),
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const ChatBotModel: Model<ChatBotInterface> = mongoose.model(
  modelConstants.chatBot,
  chatBotSchema,
);

export default ChatBotModel;
