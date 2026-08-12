"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { ChatConfig, ChatMessage, DeepPartial } from "./types";
import { defaultChatConfig, deepMergeChatConfig } from "./types";
import ChatHeader from "./components/ChatHeader";
import ChatMessageList from "./components/ChatMessageList";
import ChatInput from "./components/ChatInput";
import ChatTrigger from "./components/ChatTrigger";
import {
  getChatBotDetailsApi,
  createNewChatSessionApi,
  sendAgentChatMessageApi,
  getChatSessionDetailsApi,
  pollingOnSessionDetailsApi,
} from "./api/chat.api";
import {
  getChatSession,
  setChatSession,
} from "./helpers/session-storage.helper";
import type { CSSProperties } from "react";

const POLLING_INTERVAL_MS = 1500;
const MAX_POLLING_ATTEMPTS = 60; // 1.5s * 60 = 90s max

interface ChatWidgetProps {
  chatbotId?: string;
  config?: DeepPartial<ChatConfig>;
  isPopupOpen?: boolean;
  isClient?: boolean;
}

interface ChatWidgetInfo {
  isValidBot: boolean;
  isFetchingBot: boolean;
  sessionId: string | null;
  fetchedConfig: DeepPartial<ChatConfig> | null;
  pollingAiMessageId: string | null;
}

export default function ChatWidget({
  chatbotId,
  config: configOverrides,
  isPopupOpen = false,
  isClient = true,
}: ChatWidgetProps) {
  const [chatWidgetInfo, setChatWidgetInfo] = useState<ChatWidgetInfo>({
    isValidBot: !chatbotId,
    isFetchingBot: !!chatbotId,
    sessionId: null,
    fetchedConfig: null,
    pollingAiMessageId: null,
  });

  const [isOpen, setIsOpen] = useState(isPopupOpen);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollingAttemptRef = useRef(0);

  // Merge default config -> fetched config from API -> local prop overrides
  const baseWithFetched = chatWidgetInfo.fetchedConfig
    ? deepMergeChatConfig(defaultChatConfig, chatWidgetInfo.fetchedConfig)
    : defaultChatConfig;
  const config: ChatConfig = deepMergeChatConfig(
    baseWithFetched,
    configOverrides,
  );

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  // Fetch bot details if chatbotId is provided
  useEffect(() => {
    if (!chatbotId) {
      setChatWidgetInfo((prev) => ({
        ...prev,
        isValidBot: true,
        isFetchingBot: false,
      }));
      return;
    }

    if (isClient && chatbotId) {
      initBotAndSession();
    }
  }, [chatbotId, isClient]);

  useEffect(() => {
    const sessionExist = getChatSession();
    if (sessionExist && chatbotId) {
      getSessionDetailsFunction(sessionExist);
    }
  }, [chatbotId]);

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    pollingAttemptRef.current = 0;
    setChatWidgetInfo((prev) => ({ ...prev, pollingAiMessageId: null }));
  };

  const startPolling = (sessionId: string, aiMessageId: string) => {
    stopPolling();
    setChatWidgetInfo((prev) => ({ ...prev, pollingAiMessageId: aiMessageId }));

    pollingRef.current = setInterval(async () => {
      pollingAttemptRef.current += 1;

      if (pollingAttemptRef.current >= MAX_POLLING_ATTEMPTS) {
        stopPolling();
        setLoading(false);
        return;
      }

      try {
        const res = await pollingOnSessionDetailsApi(chatbotId!, sessionId);
        if (res.success && res.data?.messages) {
          setMessages(res.data.messages);

          const aiMessage = res.data.messages.find(
            (msg: ChatMessage) => msg._id === aiMessageId,
          );

          if (
            aiMessage &&
            (aiMessage.status === "completed" ||
              aiMessage.status === "failed" ||
              aiMessage.status === "error")
          ) {
            stopPolling();
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
        stopPolling();
        setLoading(false);
      }
    }, POLLING_INTERVAL_MS);
  };

  const initBotAndSession = async () => {
    setChatWidgetInfo((prev) => ({
      ...prev,
      isFetchingBot: true,
    }));

    try {
      const res = await getChatBotDetailsApi(chatbotId!);
      if (res.success && res.data?.config) {
        setChatWidgetInfo((prev) => ({
          ...prev,
          fetchedConfig: res.data.config,
          isValidBot: true,
        }));
      } else {
        setChatWidgetInfo((prev) => ({
          ...prev,
          isValidBot: false,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch chatbot details:", err);
      setChatWidgetInfo((prev) => ({
        ...prev,
        isValidBot: false,
      }));
    } finally {
      setChatWidgetInfo((prev) => ({
        ...prev,
        isFetchingBot: false,
      }));
    }
  };

  const getSessionDetailsFunction = async (sessionId: string) => {
    setLoading(true);
    try {
      const res = await getChatSessionDetailsApi(chatbotId!, sessionId);
      if (res.success && res.data?.messages) {
        setMessages(res.data.messages);
        setChatWidgetInfo((prev) => ({
          ...prev,
          sessionId,
        }));
      }
    } catch (err) {
      console.error("Failed to get session details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = useCallback(
    async (content: string) => {
      const userMessage: ChatMessage = {
        _id: `user-${Date.now()}`,
        role: "human",
        content,
        timestamp: new Date(),
        order: messages.length + 1,
        status: "completed",
      };
      setMessages((prev) => [...prev, userMessage]);

      if (!chatbotId) {
        // Fallback for preview mode without backend
        setTimeout(() => {
          const botMessage: ChatMessage = {
            _id: `bot-${Date.now()}`,
            role: "ai",
            content: `Thanks for your message! This is a placeholder reply from ${config.general.botName}.`,
            timestamp: new Date(),
            order: messages.length + 2,
            status: "completed",
          };
          setMessages((prev) => [...prev, botMessage]);
        }, 800);
        return;
      }

      setLoading(true);

      try {
        let currentSessionId = getChatSession() || chatWidgetInfo.sessionId;

        if (!currentSessionId) {
          const newSessionRes = await createNewChatSessionApi(
            chatbotId,
            content,
          );
          if (newSessionRes.success && newSessionRes.data?._id) {
            currentSessionId = newSessionRes.data._id;
            setChatWidgetInfo((prev) => ({
              ...prev,
              sessionId: currentSessionId,
            }));
            if (currentSessionId) {
              setChatSession(currentSessionId);
            }
          }
        }

        if (currentSessionId) {
          const agentRes = await sendAgentChatMessageApi(
            chatbotId,
            currentSessionId,
            content,
          );

          console.log("agentResagentRes", agentRes);

          if (agentRes.status === 200 && agentRes.data?.data) {
            setMessages(agentRes.data.data.messages);

            // Start polling if we got an aiMessageId
            const aiMessageId = agentRes.data?.aiMessageId;
            console.log(aiMessageId);
            if (aiMessageId) {
              startPolling(currentSessionId, aiMessageId);
            } else {
              setLoading(false);
            }
          } else {
            const replyText = "Sorry, I couldn't generate a response.";

            const botMessage: ChatMessage = {
              _id: `bot-${Date.now()}`,
              role: "ai",
              content: replyText,
              timestamp: new Date(),
              order: messages.length + 2,
              status: "completed",
            };
            setMessages((prev) => [...prev, botMessage]);
            setLoading(false);
          }
        }
      } catch (err: any) {
        console.error("Error sending message:", err);
        const errorMessage: ChatMessage = {
          _id: `bot-err-${Date.now()}`,
          role: "ai",
          content:
            err?.response?.data?.message ||
            "Failed to reach the assistant. Please try again.",
          timestamp: new Date(),
          order: messages.length + 2,
          status: "failed",
        };
        setMessages((prev) => [...prev, errorMessage]);
        setLoading(false);
      }
    },
    [chatbotId, config.general.botName, chatWidgetInfo.sessionId],
  );

  const postPassingMessageFunction = (properties: CSSProperties): void => {
    const payload: {
      type: "resize";
      properties: CSSProperties;
    } = {
      type: "resize",
      properties,
    };

    window.parent.postMessage(payload, "*");
  };

  if (
    chatbotId &&
    (chatWidgetInfo.isFetchingBot || !chatWidgetInfo.isValidBot)
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Popup */}
      {isOpen && (
        <div
          className="flex flex-col overflow-hidden border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1a2e]"
          style={{
            width: "380px",
            height: "520px",
            ...(config.theme.backgroundColor
              ? { backgroundColor: config.theme.backgroundColor }
              : {}),
            ...(config.theme.textColor
              ? { color: config.theme.textColor }
              : {}),
            ...(config.theme.borderColor
              ? { borderColor: config.theme.borderColor }
              : {}),
            borderRadius: `${config.theme.borderRadius}px`,
            animation:
              "chatWidgetPopIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            transformOrigin: "bottom right",
          }}
        >
          <style>{`
            @keyframes chatWidgetPopIn {
              0% {
                opacity: 0;
                transform: scale(0.85) translateY(8px);
              }
              100% {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
          `}</style>
          <ChatHeader config={config} onClose={() => setIsOpen(false)} />

          <ChatMessageList
            messages={
              chatWidgetInfo.pollingAiMessageId
                ? messages.filter(
                    (msg) => msg._id !== chatWidgetInfo.pollingAiMessageId,
                  )
                : messages
            }
            config={config}
            loading={loading}
          />

          <ChatInput config={config} onSend={handleSend} disabled={loading} />
        </div>
      )}

      {/* Floating Trigger */}
      <ChatTrigger
        config={config}
        onClick={() => {
          setIsOpen((prev) => !prev);

          if (postPassingMessageFunction) {
            postPassingMessageFunction({
              width: "430px",
              height: "620px",
              borderRadius: 0,
            });
          }
        }}
      />
    </div>
  );
}
