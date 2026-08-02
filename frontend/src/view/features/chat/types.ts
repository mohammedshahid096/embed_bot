// Chat widget configuration types
// These types define what the client can customize

// --- Sub-interfaces for grouped config ---

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
  borderRadius: number; // in px
}

export interface ChatConfigButton {
  bgColor: string;
  textColor: string;
  borderRadius: number; // in px
  width: number; // in px
  maxWidth: number; // in px
}

export interface ChatConfigInput {
  bgColor: string;
  textColor: string;
  borderColor: string;
  borderRadius: number; // in px
}

export interface ChatConfigMessages {
  botBgColor: string;
  botTextColor: string;
  userBgColor: string;
  userTextColor: string;
}

// --- Root ChatConfig (grouped) ---

export interface ChatConfig {
  general: ChatConfigGeneral;
  theme: ChatConfigTheme;
  button: ChatConfigButton;
  input: ChatConfigInput;
  messages: ChatConfigMessages;
}

// --- Utility types ---

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// --- Other types ---

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

export interface ChatTheme {
  id: string;
  name: string;
  description: string;
  previewColors: string[];
  config: DeepPartial<ChatConfig>;
}

// --- Defaults ---

export const defaultChatConfig: ChatConfig = {
  general: {
    botName: "Embed Bot",
    welcomeMessage: "Hello! How can I help you today?",
    inputPlaceholder: "Type your message...",
  },
  theme: {
    accentColor: "#7c3aed", // purple-600
    backgroundColor: "", // default theme background
    textColor: "", // default theme text color
    borderColor: "", // default border color
    borderRadius: 16, // px
  },
  button: {
    bgColor: "", // default accentColor
    textColor: "#ffffff", // default white icon/text
    borderRadius: 28, // px
    width: 56, // px
    maxWidth: 160, // px
  },
  input: {
    bgColor: "", // default input background
    textColor: "", // default input text color
    borderColor: "", // default input border color
    borderRadius: 12, // px
  },
  messages: {
    botBgColor: "", // default soft gray
    botTextColor: "", // default theme text
    userBgColor: "", // default accentColor
    userTextColor: "#ffffff", // default white text
  },
};

// --- Deep merge utility ---

/**
 * Deep-merges a partial config onto a base ChatConfig.
 * Only overrides fields that are explicitly provided in the override.
 */
export function deepMergeChatConfig(
  base: ChatConfig,
  override?: DeepPartial<ChatConfig>,
): ChatConfig {
  if (!override) return { ...base };

  const result: ChatConfig = {
    general: { ...base.general },
    theme: { ...base.theme },
    button: { ...base.button },
    input: { ...base.input },
    messages: { ...base.messages },
  };

  for (const groupKey of Object.keys(override) as (keyof ChatConfig)[]) {
    const overrideGroup = override[groupKey];
    if (overrideGroup && typeof overrideGroup === "object") {
      (result as unknown as Record<string, unknown>)[groupKey] = {
        ...result[groupKey],
        ...overrideGroup,
      };
    }
  }

  return result;
}
