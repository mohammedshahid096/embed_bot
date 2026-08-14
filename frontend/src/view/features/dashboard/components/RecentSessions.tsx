import { MessageSquare, Clock } from "lucide-react";
import type { DashboardRecentSession } from "@/types/context/dashboard.types";

interface RecentSessionsProps {
  sessions: DashboardRecentSession[];
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000,
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function RecentSessions({ sessions }: RecentSessionsProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-background/60 p-5 backdrop-blur-sm">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Recent Sessions
      </h3>

      {sessions.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
          No sessions yet
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((session) => (
            <div
              key={session._id}
              className="group flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-all hover:border-white/10 hover:bg-white/[0.04]"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                <MessageSquare className="h-4 w-4 text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {session.lastMessage || "No messages"}
                  </p>
                  <span className="flex flex-shrink-0 items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {timeAgo(session.createdAt)}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {session.messageCount} messages
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
