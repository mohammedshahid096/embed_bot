import { useState } from "react";
import { MessageSquare } from "lucide-react";
import ClientLayout from "@/view/layout/ClientLayout";
import { ChatWidget } from "@/view/features/chat";
import type { ChatConfig, DeepPartial } from "@/view/features/chat";
import { defaultChatConfig, deepMergeChatConfig } from "@/view/features/chat";
import ChatSettingsForm from "@/view/features/chat/components/ChatSettingsForm";

export default function ChatSettingsPage() {
  const [config, setConfig] = useState<ChatConfig>({ ...defaultChatConfig });

  const updateConfig = <G extends keyof ChatConfig>(
    group: G,
    key: keyof ChatConfig[G],
    value: string | number,
  ) => {
    setConfig((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: value,
      },
    }));
  };

  const applyTheme = (themeConfig: DeepPartial<ChatConfig>) => {
    setConfig((prev) => deepMergeChatConfig(prev, themeConfig));
  };

  return (
    <ClientLayout>
      <div className="relative min-h-screen bg-background pb-16">
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-blob absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl" />
          <div className="animate-blob animation-delay-2000 absolute top-20 -right-40 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="animate-blob animation-delay-4000 absolute -bottom-40 left-1/2 h-[500px] w-[500px] rounded-full bg-emerald-500/8 blur-3xl" />
        </div>

        {/* Grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Chat Widget
              </h1>
              <p className="text-sm text-muted-foreground">
                Configure and preview your chatbot widget
              </p>
            </div>
          </div>

          {/* Settings Form */}
          <ChatSettingsForm
            config={config}
            onConfigChange={updateConfig}
            onApplyTheme={applyTheme}
          />
        </div>

        {/* Live Preview: floating ChatWidget */}
        <ChatWidget config={config} />
      </div>
    </ClientLayout>
  );
}
