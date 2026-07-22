import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  KeyRound,
  ArrowRight,
  Loader2,
  ExternalLink,
  Eye,
  EyeOff,
  Info,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { addOrganisationApiKeyApi } from "@/api/onboard.api";
import OnboardingLayout from "@/view/layout/OnboardingLayout";
import OnboardingStepper from "@/view/features/onboarding/OnboardingStepper";

const API_PROVIDERS = [
  {
    id: "gemini" as const,
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
    id: "openrouter" as const,
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

export default function AddApiKeys() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keys, setKeys] = useState({ gemini: "", openrouter: "" });
  const [visibility, setVisibility] = useState({
    gemini: false,
    openrouter: false,
  });

  const handleKeyChange = (
    provider: "gemini" | "openrouter",
    value: string,
  ) => {
    setKeys((prev) => ({ ...prev, [provider]: value }));
  };

  const toggleVisibility = (provider: "gemini" | "openrouter") => {
    setVisibility((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleSubmit = async () => {
    if (!keys.gemini.trim() && !keys.openrouter.trim()) {
      toast.error("Please provide at least one API key.");
      return;
    }

    setIsSubmitting(true);
    const response = await addOrganisationApiKeyApi({
      gemini: keys.gemini.trim(),
      openrouter: keys.openrouter.trim(),
    });

    if (response[1]?.success) {
      toast.success("API keys saved successfully!");
      navigate("/dashboard");
    } else {
      toast.error(
        response[1]?.message || "Failed to save API keys. Please try again.",
      );
    }
    setIsSubmitting(false);
  };

  return (
    <OnboardingLayout>
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
        {/* Animated gradient background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-blob absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-500/15 blur-3xl" />
          <div className="animate-blob animation-delay-2000 absolute top-20 -right-40 h-[500px] w-[500px] rounded-full bg-blue-500/15 blur-3xl" />
          <div className="animate-blob animation-delay-4000 absolute -bottom-40 left-1/2 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        {/* Subtle grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 w-full max-w-2xl">
          {/* Onboarding Stepper */}
          <OnboardingStepper />

          {/* Header */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25">
              <KeyRound className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-top-1">
                Connect API Keys
              </h1>
              <p className="mt-1 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2">
                Add your AI provider keys to power your chatbot
              </p>
            </div>
          </div>

          <Card className="border-0 bg-card/60 shadow-2xl shadow-black/5 ring-1 ring-white/10 backdrop-blur-xl dark:bg-card/40 dark:ring-white/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">API Configuration</CardTitle>
              <CardDescription>
                Provide your API keys below. Click the console links to generate
                new keys if you don't have them yet.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {API_PROVIDERS.map((provider, index) => (
                <div
                  key={provider.id}
                  className={`space-y-4 animate-in fade-in slide-in-from-bottom-2 ${
                    index > 0 ? "pt-4 border-t border-white/5" : ""
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Provider Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${provider.gradient} ${provider.shadowColor} shadow-md text-white`}
                      >
                        {provider.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">
                          {provider.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {provider.description}
                        </p>
                      </div>
                    </div>

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

                  {/* API Key Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground/80 flex items-center gap-1.5">
                      <Sparkles className={`h-3 w-3 ${provider.accentColor}`} />
                      API Key
                    </label>
                    <div className="relative">
                      <input
                        type={visibility[provider.id] ? "text" : "password"}
                        placeholder={`Paste your ${provider.name} API key here`}
                        value={keys[provider.id]}
                        onChange={(e) =>
                          handleKeyChange(provider.id, e.target.value)
                        }
                        className="w-full bg-background border border-white/10 rounded-md py-2.5 pl-4 pr-12 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => toggleVisibility(provider.id)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                      >
                        {visibility[provider.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {keys[provider.id] && (
                      <p className="text-[10px] text-emerald-400/80 flex items-center gap-1 mt-1">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Key provided
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>

            <CardFooter className="flex-col gap-3 border-0 bg-transparent pt-2 pb-6">
              <Button
                type="button"
                size="lg"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:from-purple-500 hover:to-blue-500 hover:shadow-purple-500/40 active:scale-[0.98]"
                disabled={
                  isSubmitting ||
                  (!keys.gemini.trim() && !keys.openrouter.trim())
                }
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving keys...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Save & Finish Setup</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-0.5" />
                  </div>
                )}
              </Button>
              <p className="text-[11px] text-muted-foreground/60 text-center">
                Your keys are encrypted before being stored. You can update them
                anytime from settings.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </OnboardingLayout>
  );
}
