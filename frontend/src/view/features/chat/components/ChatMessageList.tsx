"use client";

import { useEffect, useRef } from "react";
import { Bot } from "lucide-react";
import type { ChatMessage, ChatConfig } from "../types";

interface ChatMessageListProps {
  messages: ChatMessage[];
  config: ChatConfig;
  loading?: boolean;
}

export default function ChatMessageList({
  messages,
  config,
  loading = false,
}: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (messages.length === 0 && !loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center">
        <div
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${config.theme.accentColor}15` }}
        >
          <Bot
            className="h-7 w-7"
            style={{ color: config.theme.accentColor }}
          />
        </div>
        <p
          className="text-sm font-medium text-gray-800 dark:text-gray-200"
          style={{ color: config.theme.textColor || undefined }}
        >
          {config.general.welcomeMessage}
        </p>
        <p
          className="mt-1 text-xs text-gray-400 dark:text-gray-500"
          style={{
            color: config.theme.textColor
              ? `${config.theme.textColor}99`
              : undefined,
          }}
        >
          Ask me anything about our services
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
      {messages.map((msg, index) => {
        const isUser = msg.role === "human";
        const key = msg._id;

        return (
          <div
            key={key}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
          >
            {!isUser && (
              <div
                className="mr-2 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${config.theme.accentColor}20` }}
              >
                <Bot
                  className="h-3.5 w-3.5"
                  style={{ color: config.theme.accentColor }}
                />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                isUser
                  ? "rounded-br-md"
                  : "bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-200 rounded-bl-md"
              }`}
              style={
                isUser
                  ? {
                      backgroundColor:
                        config.messages.userBgColor || config.theme.accentColor,
                      color: config.messages.userTextColor || "#ffffff",
                    }
                  : {
                      ...(config.messages.botBgColor
                        ? { backgroundColor: config.messages.botBgColor }
                        : {}),
                      ...(config.messages.botTextColor || config.theme.textColor
                        ? {
                            color:
                              config.messages.botTextColor ||
                              config.theme.textColor,
                          }
                        : {}),
                    }
              }
            >
              {msg.content}
            </div>
          </div>
        );
      })}

      {loading && (
        <div className="flex justify-start">
          <div
            className="mr-2 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: `${config.theme.accentColor}20` }}
          >
            <Bot
              className="h-3.5 w-3.5"
              style={{ color: config.theme.accentColor }}
            />
          </div>
          <div className="rounded-2xl rounded-bl-md bg-gray-100 dark:bg-white/10 px-3.5 py-2 text-sm flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
            <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
            <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
