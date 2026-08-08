"use client";

import { useState, useCallback } from "react";
import type { ChatConfig, ChatMessage } from "./types";
import { defaultChatConfig, deepMergeChatConfig } from "./types";
import type { DeepPartial } from "./types";
import ChatHeader from "./components/ChatHeader";
import ChatMessageList from "./components/ChatMessageList";
import ChatInput from "./components/ChatInput";
import ChatTrigger from "./components/ChatTrigger";

interface ChatWidgetProps {
  config?: DeepPartial<ChatConfig>;
  isPopupOpen?: boolean;
  isClient?: boolean;
}

export default function ChatWidget({
  config: configOverrides,
  isPopupOpen = false,
  // isClient = true,
}: ChatWidgetProps) {
  const config: ChatConfig = deepMergeChatConfig(
    defaultChatConfig,
    configOverrides,
  );

  const [isOpen, setIsOpen] = useState(isPopupOpen);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSend = useCallback(
    (content: string) => {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // TODO: Replace with actual API call
      setTimeout(() => {
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: "bot",
          content: `Thanks for your message! This is a placeholder reply from ${config.general.botName}.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }, 800);
    },
    [config.general.botName],
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Popup */}
      {isOpen && (
        <div
          className="flex flex-col overflow-hidden border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1a2e] animate-in fade-in slide-in-from-bottom-2"
          style={{
            width: "380px",
            height: "520px",
            ...(config.theme.backgroundColor ? { backgroundColor: config.theme.backgroundColor } : {}),
            ...(config.theme.textColor ? { color: config.theme.textColor } : {}),
            ...(config.theme.borderColor ? { borderColor: config.theme.borderColor } : {}),
            borderRadius: `${config.theme.borderRadius}px`,
          }}
        >
          <ChatHeader config={config} onClose={() => setIsOpen(false)} />

          <ChatMessageList messages={messages} config={config} />

          <ChatInput config={config} onSend={handleSend} />
        </div>
      )}

      {/* Floating Trigger */}
      <ChatTrigger config={config} onClick={() => setIsOpen((prev) => !prev)} />
    </div>
  );
}
