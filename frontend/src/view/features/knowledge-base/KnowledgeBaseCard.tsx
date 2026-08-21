import { useState } from "react";
import type { KnowledgeBaseItem } from "@/types/api/knowledge-base.types";
import {
  Globe,
  FileText,
  MessageSquare,
  File,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from "lucide-react";
import {
  KnowledgeBaseStatusBadge,
  KnowledgeBaseSourceBadge,
  KnowledgeBaseTimestamp,
} from "./KnowledgeBaseBadges";

interface KnowledgeBaseCardProps {
  item: KnowledgeBaseItem;
}

const sourceIconMap = {
  url: Globe,
  pdf: FileText,
  text: File,
  faq: MessageSquare,
};

const KnowledgeBaseCard = ({ item }: KnowledgeBaseCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const SourceIcon = sourceIconMap[item.sourceType] || Globe;

  const handleCopyContent = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.content) return;
    navigator.clipboard.writeText(item.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <div className="group relative rounded-xl border border-white/8 bg-card/50 p-4 backdrop-blur-sm transition-all duration-300 hover:border-white/15 hover:bg-card/70 hover:shadow-lg hover:shadow-black/5">
      {/* Processing pulse indicator */}
      {item.status === "processing" && (
        <div className="absolute top-3 right-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
          </span>
        </div>
      )}

      {/* Header Row */}
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/15 to-blue-500/15 text-purple-400 transition-colors group-hover:from-purple-500/25 group-hover:to-blue-500/25">
          <SourceIcon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium text-foreground/90 group-hover:text-foreground transition-colors">
            {item.name}
          </h3>

          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground/50 hover:text-purple-400 transition-colors truncate max-w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-2.5 w-2.5 shrink-0" />
              <span className="truncate">{item.sourceUrl}</span>
            </a>
          )}
        </div>
      </div>

      {/* Content Data Section */}
      {item.content && (
        <div className="mt-3 rounded-lg bg-black/25 p-3 border border-white/5 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground/70 tracking-wider uppercase">
              Content
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyContent}
                className="flex items-center gap-1 text-[11px] text-muted-foreground/60 hover:text-foreground transition-colors px-1.5 py-0.5 rounded hover:bg-white/5"
                title="Copy Content"
              >
                {isCopied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 transition-colors px-1.5 py-0.5 rounded hover:bg-purple-500/10"
              >
                <span>{isExpanded ? "Show Less" : "Show More"}</span>
                {isExpanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
            </div>
          </div>

          <div
            className={`text-[12px] text-foreground/80 leading-relaxed font-sans ${
              isExpanded
                ? "max-h-60 overflow-y-auto pr-1 whitespace-pre-wrap"
                : "line-clamp-2"
            }`}
          >
            {item.content}
          </div>
        </div>
      )}

      {/* Footer Row */}
      <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-white/5">
        <div className="flex items-center gap-2">
          <KnowledgeBaseSourceBadge sourceType={item.sourceType} />
          <KnowledgeBaseStatusBadge status={item.status} />
        </div>

        <div className="flex items-center gap-3">
          {item.status === "ready" && item.chunkCount > 0 && (
            <span className="text-[11px] text-muted-foreground/60">
              {item.chunkCount} chunks
            </span>
          )}
          <KnowledgeBaseTimestamp createdAt={item.createdAt} />
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseCard;
