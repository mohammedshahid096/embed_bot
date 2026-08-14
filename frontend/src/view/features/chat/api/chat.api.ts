import axios from "axios";
import type { ChatConfig } from "../types";

const BASE_URL = "http://localhost:8000/api/v1";

const chatAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ChatBotDetails {
  _id: string;
  config: ChatConfig;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  otherData?: any;
}

/**
 * Fetch details and configuration for a specific chatbot
 */
export const getChatBotDetailsApi = async (chatbotId: string) => {
  const response = await chatAxios.get(`/chat/bot-details/${chatbotId}`);
  return response.data;
};

/**
 * Create a new chat session for a chatbot
 */
export const createNewChatSessionApi = async (
  chatbotId: string,
  query: string,
  origin?: string,
) => {
  const response = await chatAxios.post(`/chat/${chatbotId}/new-chat`, {
    origin:
      origin ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000"),
    query,
  });
  return response.data;
};

/**
 * Send a message to the AI agent in an existing chat session
 */
export const sendAgentChatMessageApi = async (
  chatbotId: string,
  sessionId: string,
  inputQuestion: string,
) => {
  const response = await chatAxios.post(`/chat/${chatbotId}/${sessionId}`, {
    inputQuestion,
  });
  return response;
};

/**
 * Get existing chat session details
 */
export const getChatSessionDetailsApi = async (
  chatbotId: string,
  sessionId: string,
) => {
  const response = await chatAxios.get(`/chat/${chatbotId}/${sessionId}`);
  return response.data;
};

export const pollingOnSessionDetailsApi = async (
  chatbotId: string,
  sessionId: string,
) => {
  const response = await chatAxios.get(
    `/chat/polling/${chatbotId}/${sessionId}`,
  );
  return response.data;
};
