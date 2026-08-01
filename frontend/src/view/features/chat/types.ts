// Chat widget configuration types
// These types define what the client can customize

export interface ChatConfig {
  botName: string;
  inputPlaceholder: string;
  welcomeMessage: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  buttonBorderRadius: number; // in px
  buttonWidth: number; // in px
  buttonMaxWidth: number; // in px
  inputBgColor: string;
  inputTextColor: string;
  inputBorderColor: string;
  inputBorderRadius: number; // in px
  botMessageBgColor: string;
  botMessageTextColor: string;
  userMessageBgColor: string;
  userMessageTextColor: string;
  borderRadius: number; // in px
}

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

export const defaultChatConfig: ChatConfig = {
  botName: "Embed Bot",
  inputPlaceholder: "Type your message...",
  welcomeMessage: "Hello! How can I help you today?",
  accentColor: "#7c3aed", // purple-600
  backgroundColor: "", // default theme background
  textColor: "", // default theme text color
  borderColor: "", // default border color
  buttonBgColor: "", // default accentColor
  buttonTextColor: "#ffffff", // default white icon/text
  buttonBorderRadius: 28, // px
  buttonWidth: 56, // px
  buttonMaxWidth: 160, // px
  inputBgColor: "", // default input background
  inputTextColor: "", // default input text color
  inputBorderColor: "", // default input border color
  inputBorderRadius: 12, // px
  botMessageBgColor: "", // default soft gray
  botMessageTextColor: "", // default theme text
  userMessageBgColor: "", // default accentColor
  userMessageTextColor: "#ffffff", // default white text
  borderRadius: 16, // px
};

