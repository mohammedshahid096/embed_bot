"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Bot,
  User,
  SendHorizontal,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  MessageSquare,
  ShieldAlert,
  Zap,
} from "lucide-react";

interface Message {
  id: string;
  role: "human" | "ai";
  content: string;
  timestamp: Date;
  tokenUsage?: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
  };
  error?: boolean;
}

interface ChatInterfaceProps {
  chatbotId: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const STARTER_QUESTIONS = [
  "What services do you offer?",
  "How can I get started?",
  "Can you help me troubleshoot an issue?",
  "What are your business hours?",
];

export default function ChatInterface({ chatbotId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  // Load existing session if saved in localStorage
  useEffect(() => {
    const localKey = `embed_bot_session_${chatbotId}`;
    const savedSessionId = localStorage.getItem(localKey);

    if (savedSessionId) {
      setSessionId(savedSessionId);
      // Fetch session details from backend
      fetch(`${API_BASE_URL}/chat/${chatbotId}/${savedSessionId}/chat`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data?.messages) {
            const loadedMsgs: Message[] = data.data.messages.map(
              (m: any, index: number) => ({
                id: m._id || `msg-${index}`,
                role: m.role === "human" ? "human" : "ai",
                content: m.content || "",
                timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
                tokenUsage: m.tokenUsage,
              })
            );
            setMessages(loadedMsgs);
          }
        })
        .catch((err) => {
          console.error("Failed to load chat session history:", err);
        })
        .finally(() => {
          setFetchingHistory(false);
        });
    } else {
      setFetchingHistory(false);
    }
  }, [chatbotId]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearSession = () => {
    const localKey = `embed_bot_session_${chatbotId}`;
    localStorage.removeItem(localKey);
    setSessionId(null);
    setMessages([]);
    setErrorMessage(null);
  };

  const sendMessage = async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed || loading) return;

    setErrorMessage(null);
    const userTimestamp = new Date();
    const tempUserMsg: Message = {
      id: `user-${Date.now()}`,
      role: "human",
      content: trimmed,
      timestamp: userTimestamp,
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setInput("");
    setLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      if (!sessionId) {
        // Create new chat session
        const res = await fetch(`${API_BASE_URL}/chat/${chatbotId}/new-chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            origin:
              typeof window !== "undefined"
                ? window.location.origin
                : "http://localhost:3000",
            query: trimmed,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to create chat session");
        }

        const newSession = data.data;
        const newSessId = newSession._id;
        setSessionId(newSessId);
        localStorage.setItem(`embed_bot_session_${chatbotId}`, newSessId);

        // Now send the first message to get AI response
        const agentRes = await fetch(
          `${API_BASE_URL}/chat/${chatbotId}/${newSessId}/chat`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputQuestion: trimmed,
            }),
          }
        );

        const agentData = await agentRes.json();

        if (!agentRes.ok || !agentData.success) {
          throw new Error(
            agentData.message || "Failed to process message with AI"
          );
        }

        const aiMessageContent =
          agentData.otherData?.aiMessage ||
          agentData.otherData?.aiResponse?.output ||
          "Sorry, I couldn't generate a response.";

        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          role: "ai",
          content: aiMessageContent,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMsg]);
      } else {
        // Continue existing chat session
        const res = await fetch(
          `${API_BASE_URL}/chat/${chatbotId}/${sessionId}/chat`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputQuestion: trimmed,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to process message");
        }

        const aiMessageContent =
          data.otherData?.aiMessage ||
          data.otherData?.aiResponse?.output ||
          "Sorry, I couldn't generate a response.";

        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          role: "ai",
          content: aiMessageContent,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      setErrorMessage(
        err.message || "Something went wrong. Please try again."
      );
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "ai",
          content:
            err.message ||
            "Unable to connect to the assistant. Please check backend connection.",
          timestamp: new Date(),
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex h-screen w-full flex-col bg-zinc-950 text-zinc-100 font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-zinc-800/80 bg-zinc-900/90 px-4 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 shadow-md shadow-violet-500/20">
            <Bot className="h-5.5 w-5.5 text-white" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-zinc-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold tracking-tight text-white sm:text-lg">
                Embed Assistant
              </h1>
              <span className="rounded-md bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-400 border border-violet-500/20">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-zinc-400 truncate max-w-[200px] sm:max-w-xs">
              ID: <span className="font-mono text-zinc-300">{chatbotId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {sessionId && (
            <button
              onClick={handleClearSession}
              title="Reset Conversation"
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Chat Content */}
      <main className="flex flex-1 flex-col overflow-hidden relative">
        {/* Background ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[350px] w-[500px] rounded-full bg-violet-600/20 blur-[120px]" />
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8 max-w-4xl w-full mx-auto space-y-6 relative z-10">
          {fetchingHistory ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-zinc-500 py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
              <p className="text-sm">Loading session history...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                <Sparkles className="h-8 w-8 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">
                How can I help you today?
              </h2>
              <p className="text-sm text-zinc-400 max-w-md mb-8">
                Ask me questions about documentation, products, issues, or
                general information.
              </p>

              {/* Starter Question Chips */}
              <div className="w-full max-w-lg space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 text-left mb-3">
                  Suggested Prompts
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {STARTER_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(q)}
                      className="flex items-center gap-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3 text-left text-xs font-medium text-zinc-300 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white transition-all cursor-pointer group"
                    >
                      <Zap className="h-4 w-4 text-violet-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span>{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 ${
                    msg.role === "human" ? "justify-end" : "justify-start"
                  } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  {msg.role === "ai" && (
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl ${
                        msg.error
                          ? "bg-rose-500/20 border border-rose-500/30 text-rose-400"
                          : "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-sm"
                      }`}
                    >
                      {msg.error ? (
                        <ShieldAlert className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4.5 w-4.5" />
                      )}
                    </div>
                  )}

                  <div className="flex flex-col max-w-[85%] sm:max-w-[75%] gap-1">
                    <div
                      className={`group relative rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "human"
                          ? "bg-violet-600 text-white rounded-tr-none shadow-lg shadow-violet-600/15"
                          : msg.error
                          ? "bg-rose-950/40 border border-rose-800/50 text-rose-200 rounded-tl-none"
                          : "bg-zinc-900 border border-zinc-800/80 text-zinc-100 rounded-tl-none shadow-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>

                      {/* Copy button */}
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-zinc-800/80 text-zinc-400 hover:text-white"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>

                    <div
                      className={`flex items-center gap-2 text-[10px] text-zinc-500 px-1 ${
                        msg.role === "human" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span>
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {msg.role === "human" && (
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300">
                      <User className="h-4.5 w-4.5" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3.5 justify-start animate-in fade-in duration-200">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-sm">
                    <Bot className="h-4.5 w-4.5 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-none bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-zinc-400">
                    <span className="h-2 w-2 rounded-full bg-violet-500 animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="h-2 w-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Bottom Input Section */}
      <footer className="z-20 border-t border-zinc-800/80 bg-zinc-900/90 p-4 backdrop-blur-md">
        <div className="max-w-4xl mx-auto">
          {errorMessage && (
            <div className="mb-2 flex items-center justify-between rounded-lg bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 text-xs text-rose-400">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-rose-400 hover:text-white"
              >
                &times;
              </button>
            </div>
          )}

          <div className="relative flex items-end rounded-2xl border border-zinc-800 bg-zinc-950/80 p-1.5 focus-within:border-violet-500/60 focus-within:ring-1 focus-within:ring-violet-500/50 transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              disabled={loading}
              className="flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none disabled:opacity-50 max-h-32"
            />

            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white hover:bg-violet-500 active:scale-95 disabled:opacity-40 disabled:hover:bg-violet-600 disabled:active:scale-100 transition-all cursor-pointer"
              title="Send message"
            >
              <SendHorizontal className="h-4.5 w-4.5" />
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500 px-1">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>Powered by Embed Bot AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
