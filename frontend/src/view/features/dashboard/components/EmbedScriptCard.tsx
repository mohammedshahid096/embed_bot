import { useState } from "react";
import { Code2, Copy, Check, Terminal } from "lucide-react";
import { toast } from "sonner";
import API_URLS from "@/services/config";

interface EmbedScriptCardProps {
  chatBotId: string | null;
}

export default function EmbedScriptCard({ chatBotId }: EmbedScriptCardProps) {
  const [copied, setCopied] = useState(false);

  const baseUrl = API_URLS.CLIENT_BASE_URL;

  const scriptTag = `<script src="${baseUrl}/embed" data-chatbot-id="${
    chatBotId || "YOUR_CHATBOT_ID"
  }"></script>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scriptTag);
      setCopied(true);
      toast.success("Embed script copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy embed script.");
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-background/60 p-6 backdrop-blur-sm shadow-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              Embed Script
            </h3>
            <p className="text-xs text-muted-foreground">
              Copy and paste this script tag into the HTML of your website.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-semibold text-purple-300 transition-all hover:bg-purple-500/20 hover:border-purple-500/50 active:scale-95 shadow-sm"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Script</span>
            </>
          )}
        </button>
      </div>

      {/* Code Box */}
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/80 p-4 font-mono text-xs shadow-inner">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[11px] text-muted-foreground/70">
          <span className="flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-purple-400" />
            HTML Embed Code
          </span>
          {chatBotId && (
            <span className="text-[10px] text-purple-400/80 font-mono">
              ID: {chatBotId}
            </span>
          )}
        </div>
        <pre className="overflow-x-auto text-purple-200/90 whitespace-pre-wrap break-all selection:bg-purple-500/30">
          <span className="text-blue-400">&lt;script</span>{" "}
          <span className="text-purple-300">src</span>=
          <span className="text-emerald-300">&quot;{baseUrl}/embed&quot;</span>{" "}
          <span className="text-purple-300">data-chatbot-id</span>=
          <span className="text-amber-300">
            &quot;{chatBotId || "YOUR_CHATBOT_ID"}&quot;
          </span>
          <span className="text-blue-400">&gt;&lt;/script&gt;</span>
        </pre>
      </div>
    </div>
  );
}
