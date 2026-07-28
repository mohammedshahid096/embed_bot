import { useContext, useEffect, useState } from "react";
import {
  KeyRound,
  Loader2,
  ExternalLink,
  Eye,
  EyeOff,
  Info,
  Sparkles,
  Pencil,
  Save,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import ClientLayout from "@/view/layout/ClientLayout";
import Context from "@/context/context";
import {
  getApiKeySummaryApi,
  updateSingleApiKeyApi,
} from "@/api/organisation.api";

type ProviderKey = "gemini" | "openrouter";

interface ApiKeySummary {
  gemini: { keyLastFour: string } | null;
  openrouter: { keyLastFour: string } | null;
}

const API_PROVIDERS = [
  {
    id: "gemini" as ProviderKey,
    name: "Google Gemini",
    description:
      "Power your bot with Google's Gemini models for embedding and content generation.",
    consoleUrl: "https://aistudio.google.com/apikey",
    consoleLabel: "Google AI Studio",
    gradient: "from-blue-500 to-cyan-500",
    shadowColor: "shadow-blue-500/20",
    accentColor: "text-blue-400",
    bgAccent: "bg-blue-500/10",
    borderAccent: "border-blue-500/20",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    notes: [
      "Used for generating text embeddings of your website content.",
      "Get a free API key from Google AI Studio — no billing required for the free tier.",
      "Your key is encrypted and stored securely.",
    ],
  },
  {
    id: "openrouter" as ProviderKey,
    name: "OpenRouter",
    description:
      "Access a wide range of AI models through a unified API for content processing.",
    consoleUrl: "https://openrouter.ai/keys",
    consoleLabel: "OpenRouter Dashboard",
    gradient: "from-purple-500 to-pink-500",
    shadowColor: "shadow-purple-500/20",
    accentColor: "text-purple-400",
    bgAccent: "bg-purple-500/10",
    borderAccent: "border-purple-500/20",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path
          d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    notes: [
      "Used for cleaning and processing scraped website content.",
      "Free-tier models are available — no credit card needed to get started.",
      "Your key is encrypted and stored securely.",
    ],
  },
];

export default function ApiKeysPage() {
  const {
    organisationState: { organisationDetails },
  } = useContext(Context);

  const [keySummary, setKeySummary] = useState<ApiKeySummary | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [editingProvider, setEditingProvider] = useState<ProviderKey | null>(
    null,
  );
  const [newKeyValue, setNewKeyValue] = useState("");
  const [showNewKey, setShowNewKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchKeySummary = async () => {
    setIsPageLoading(true);
    const response = await getApiKeySummaryApi();
    if (response[0]) {
      setKeySummary(response[1]?.data);
    }
    setIsPageLoading(false);
  };

  useEffect(() => {
    if (organisationDetails) {
      fetchKeySummary();
    }
  }, [organisationDetails]);

  const handleStartEdit = (provider: ProviderKey) => {
    setEditingProvider(provider);
    setNewKeyValue("");
    setShowNewKey(false);
  };

  const handleCancelEdit = () => {
    setEditingProvider(null);
    setNewKeyValue("");
    setShowNewKey(false);
  };

  const handleSaveKey = async (provider: ProviderKey) => {
    if (!newKeyValue.trim()) {
      toast.error("Please enter an API key.");
      return;
    }

    setIsSaving(true);
    const response = await updateSingleApiKeyApi(provider, newKeyValue.trim());

    if (response[0]) {
      toast.success(
        `${provider === "gemini" ? "Google Gemini" : "OpenRouter"} API key updated!`,
      );
      // Update the local summary state
      setKeySummary((prev) =>
        prev
          ? {
              ...prev,
              [provider]: {
                keyLastFour: response[1]?.data?.keyLastFour || newKeyValue.slice(-4),
              },
            }
          : prev,
      );
      setEditingProvider(null);
      setNewKeyValue("");
      setShowNewKey(false);
    } else {
      toast.error(
        response[1]?.message || "Failed to update API key. Please try again.",
      );
    }
    setIsSaving(false);
  };

  const getMaskedKey = (lastFour: string | undefined) => {
    if (!lastFour) return null;
    return `•••• •••• •••• ${lastFour}`;
  };

  return (
    <ClientLayout>
      <div className="relative min-h-screen bg-background pb-16">
        {/* Animated gradient background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-blob absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl" />
          <div className="animate-blob animation-delay-2000 absolute top-20 -right-40 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="animate-blob animation-delay-4000 absolute -bottom-40 left-1/2 h-[500px] w-[500px] rounded-full bg-emerald-500/8 blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
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
              <KeyRound className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                API Keys
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your AI provider credentials securely
              </p>
            </div>
          </div>

          {/* Loading State */}
          {isPageLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            </div>
          ) : (
            <div className="space-y-6">
              {API_PROVIDERS.map((provider, index) => {
                const isEditing = editingProvider === provider.id;
                const keyData = keySummary?.[provider.id];
                const masked = getMaskedKey(keyData?.keyLastFour);

                return (
                  <Card
                    key={provider.id}
                    className={`border border-white/10 bg-card/60 shadow-xl backdrop-blur-xl dark:bg-card/40 animate-in fade-in slide-in-from-bottom-2 ${
                      isEditing ? "ring-1 ring-purple-500/30" : ""
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${provider.gradient} ${provider.shadowColor} shadow-md text-white`}
                          >
                            {provider.icon}
                          </div>
                          <div>
                            <CardTitle className="text-base">
                              {provider.name}
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {provider.description}
                            </CardDescription>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={provider.consoleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-1.5 text-xs font-medium ${provider.accentColor} hover:underline underline-offset-2 transition-colors`}
                          >
                            {provider.consoleLabel}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Info Notes */}
                      <div
                        className={`rounded-lg ${provider.bgAccent} border ${provider.borderAccent} p-3 space-y-1.5`}
                      >
                        {provider.notes.map((note, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Info
                              className={`h-3.5 w-3.5 mt-0.5 ${provider.accentColor} flex-shrink-0`}
                            />
                            <span className="text-xs text-muted-foreground leading-relaxed">
                              {note}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Current Key Display or Edit Mode */}
                      {!isEditing ? (
                        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Sparkles
                              className={`h-4 w-4 ${provider.accentColor}`}
                            />
                            {masked ? (
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm text-foreground tracking-wider">
                                  {masked}
                                </span>
                                <span className="flex items-center gap-1 text-[10px] text-emerald-400/80">
                                  <Check className="h-3 w-3" />
                                  Configured
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground/70 italic">
                                No key configured
                              </span>
                            )}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStartEdit(provider.id)}
                            className="border-white/10 hover:bg-white/5 text-xs gap-1.5"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Update
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3 rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                            <span className="text-xs font-medium text-purple-400">
                              Enter new API key
                            </span>
                          </div>

                          <div className="relative">
                            <input
                              type={showNewKey ? "text" : "password"}
                              placeholder={`Paste your new ${provider.name} API key`}
                              value={newKeyValue}
                              onChange={(e) => setNewKeyValue(e.target.value)}
                              className="w-full bg-background border border-white/10 rounded-md py-2.5 pl-4 pr-12 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewKey(!showNewKey)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                            >
                              {showNewKey ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancelEdit}
                              disabled={isSaving}
                              className="border-white/10 hover:bg-white/5 text-xs gap-1.5"
                            >
                              <X className="h-3.5 w-3.5" />
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSaveKey(provider.id)}
                              disabled={isSaving || !newKeyValue.trim()}
                              className={`bg-gradient-to-r ${provider.gradient} text-white shadow-md ${provider.shadowColor} hover:opacity-90 transition-all text-xs gap-1.5`}
                            >
                              {isSaving ? (
                                <>
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save className="h-3.5 w-3.5" />
                                  Save Key
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              <p className="text-[11px] text-muted-foreground/60 text-center pt-2">
                Your keys are encrypted before being stored. Only the last 4
                characters are visible for identification.
              </p>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
