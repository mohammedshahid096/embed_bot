import { Bot } from "lucide-react";
import type { ChatMessage, ChatConfig } from "../types";

interface ChatMessageListProps {
  messages: ChatMessage[];
  config: ChatConfig;
}

export default function ChatMessageList({
  messages,
  config,
}: ChatMessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center">
        <div
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${config.accentColor}15` }}
        >
          <Bot className="h-7 w-7" style={{ color: config.accentColor }} />
        </div>
        <p
          className="text-sm font-medium text-gray-800 dark:text-gray-200"
          style={{ color: config.textColor || undefined }}
        >
          {config.welcomeMessage}
        </p>
        <p
          className="mt-1 text-xs text-gray-400 dark:text-gray-500"
          style={{ color: config.textColor ? `${config.textColor}99` : undefined }}
        >
          Ask me anything about our services
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          {msg.role === "bot" && (
            <div
              className="mr-2 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${config.accentColor}20` }}
            >
              <Bot
                className="h-3.5 w-3.5"
                style={{ color: config.accentColor }}
              />
            </div>
          )}
          <div
            className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
              msg.role === "user"
                ? "rounded-br-md"
                : "bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-200 rounded-bl-md"
            }`}
            style={
              msg.role === "user"
                ? {
                    backgroundColor: config.userMessageBgColor || config.accentColor,
                    color: config.userMessageTextColor || "#ffffff",
                  }
                : {
                    ...(config.botMessageBgColor
                      ? { backgroundColor: config.botMessageBgColor }
                      : {}),
                    ...(config.botMessageTextColor || config.textColor
                      ? { color: config.botMessageTextColor || config.textColor }
                      : {}),
                  }
            }
          >
            {msg.content}
          </div>
        </div>
      ))}
    </div>
  );
}
