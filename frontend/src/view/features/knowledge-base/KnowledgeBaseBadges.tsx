import type { KnowledgeBaseStatus, KnowledgeBaseSourceType } from "@/types/api/knowledge-base.types";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";

interface KnowledgeBaseStatusBadgeProps {
  status: KnowledgeBaseStatus;
}

const statusConfig: Record<
  KnowledgeBaseStatus,
  { label: string; icon: React.ReactNode; className: string }
> = {
  processing: {
    label: "Processing",
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
    className:
      "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  ready: {
    label: "Ready",
    icon: <CheckCircle2 className="h-3 w-3" />,
    className:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  failed: {
    label: "Failed",
    icon: <XCircle className="h-3 w-3" />,
    className:
      "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

export const KnowledgeBaseStatusBadge = ({ status }: KnowledgeBaseStatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all ${config.className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

// Source type badge
interface KnowledgeBaseSourceBadgeProps {
  sourceType: KnowledgeBaseSourceType;
}

const sourceConfig: Record<
  KnowledgeBaseSourceType,
  { label: string; className: string }
> = {
  url: {
    label: "URL",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  pdf: {
    label: "PDF",
    className: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  text: {
    label: "Text",
    className: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
  faq: {
    label: "FAQ",
    className: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
};

export const KnowledgeBaseSourceBadge = ({ sourceType }: KnowledgeBaseSourceBadgeProps) => {
  const config = sourceConfig[sourceType];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-all ${config.className}`}
    >
      {config.label}
    </span>
  );
};

// Timestamp component
interface KnowledgeBaseTimestampProps {
  createdAt: string;
}

export const KnowledgeBaseTimestamp = ({ createdAt }: KnowledgeBaseTimestampProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/60">
      <Clock className="h-3 w-3" />
      {formatDate(createdAt)}
    </span>
  );
};
