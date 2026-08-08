import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { MessageSquare, Save, RotateCcw, Loader2 } from "lucide-react";
import ClientLayout from "@/view/layout/ClientLayout";
import { ChatWidget } from "@/view/features/chat";
import type { ChatConfig, DeepPartial } from "@/view/features/chat";
import { defaultChatConfig, deepMergeChatConfig } from "@/view/features/chat";
import ChatSettingsForm from "@/view/features/chat/components/ChatSettingsForm";
import Context from "@/context/context";
import { toast } from "sonner";

export default function ChatSettingsPage() {
  const [config, setConfig] = useState<ChatConfig>({ ...defaultChatConfig });
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const originalConfigRef = useRef<ChatConfig | null>(null);

  const {
    organisationState: {
      getChatBotDetailsAction,
      updateChatBotDetailsAction,
      chatBotDetails,
    },
  } = useContext(Context);

  useEffect(() => {
    if (!chatBotDetails) {
      getChatBotDetailsAction();
    }
  }, [chatBotDetails]);

  useEffect(() => {
    if (chatBotDetails) {
      const merged = deepMergeChatConfig(defaultChatConfig, chatBotDetails.config);
      setConfig(merged);
      originalConfigRef.current = merged;
      setHasChanges(false);
    }
  }, [chatBotDetails]);

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
    setHasChanges(true);
  };

  const applyTheme = (themeConfig: DeepPartial<ChatConfig>) => {
    setConfig((prev) => deepMergeChatConfig(prev, themeConfig));
    setHasChanges(true);
  };

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const response = await updateChatBotDetailsAction(config);
      if (response[0]) {
        toast.success("Chat widget settings saved successfully!");
        originalConfigRef.current = config;
        setHasChanges(false);
      } else {
        toast.error(
          response[1]?.message || "Failed to save settings. Please try again.",
        );
      }
    } catch {
      toast.error("An error occurred while saving settings.");
    } finally {
      setIsSaving(false);
    }
  }, [config, updateChatBotDetailsAction]);

  const handleReset = useCallback(() => {
    if (originalConfigRef.current) {
      setConfig(originalConfigRef.current);
      setHasChanges(false);
    }
  }, []);

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
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
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

            {/* Save / Reset buttons */}
            <div className="flex items-center gap-3">
              {hasChanges && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-background/80 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all hover:border-white/20 hover:text-foreground"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
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
        <ChatWidget config={config} isPopupOpen={true} isClient={false} />
      </div>
    </ClientLayout>
  );
}

