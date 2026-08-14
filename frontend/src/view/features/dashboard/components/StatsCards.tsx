import {
  MessageSquare,
  Users,
  Zap,
  AlertTriangle,
  Database,
  Bot,
} from "lucide-react";
import type { DashboardStats, DashboardTokenUsage } from "@/types/context/dashboard.types";

interface StatsCardsProps {
  stats: DashboardStats;
  tokenUsage: DashboardTokenUsage;
}

const statCards = [
  {
    key: "totalSessions",
    label: "Total Sessions",
    icon: Users,
    gradient: "from-purple-500 to-indigo-600",
    shadowColor: "shadow-purple-500/20",
  },
  {
    key: "totalMessages",
    label: "Total Messages",
    icon: MessageSquare,
    gradient: "from-blue-500 to-cyan-600",
    shadowColor: "shadow-blue-500/20",
  },
  {
    key: "aiMessages",
    label: "AI Responses",
    icon: Bot,
    gradient: "from-emerald-500 to-teal-600",
    shadowColor: "shadow-emerald-500/20",
  },
  {
    key: "totalTokens",
    label: "Total Tokens",
    icon: Zap,
    gradient: "from-amber-500 to-orange-600",
    shadowColor: "shadow-amber-500/20",
    isToken: true,
  },
  {
    key: "totalKnowledgeBases",
    label: "Knowledge Bases",
    icon: Database,
    gradient: "from-pink-500 to-rose-600",
    shadowColor: "shadow-pink-500/20",
  },
  {
    key: "failedMessages",
    label: "Failed Messages",
    icon: AlertTriangle,
    gradient: "from-red-500 to-rose-600",
    shadowColor: "shadow-red-500/20",
  },
] as const;

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export default function StatsCards({ stats, tokenUsage }: StatsCardsProps) {
  const getValue = (key: string, isToken?: boolean) => {
    if (isToken) return tokenUsage.totalTokens;
    return (stats as any)[key] ?? 0;
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {statCards.map((card) => {
        const Icon = card.icon;
        const value = getValue(card.key, card.isToken);

        return (
          <div
            key={card.key}
            className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-background/60 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:shadow-lg ${card.shadowColor}`}
          >
            <div
              className={`absolute -top-4 -right-4 h-16 w-16 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 blur-xl transition-opacity group-hover:opacity-20`}
            />
            <div className="relative">
              <div
                className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg ${card.shadowColor}`}
              >
                <Icon className="h-4 w-4 text-white" />
              </div>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {formatNumber(value)}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {card.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
