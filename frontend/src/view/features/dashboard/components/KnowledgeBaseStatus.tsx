import { CheckCircle, Loader, XCircle } from "lucide-react";

interface KnowledgeBaseStatusProps {
  statusMap: Record<string, number>;
  total: number;
}

const statusConfig: Record<
  string,
  { label: string; icon: typeof CheckCircle; color: string; bg: string }
> = {
  ready: {
    label: "Ready",
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  processing: {
    label: "Processing",
    icon: Loader,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
};

export default function KnowledgeBaseStatus({
  statusMap,
  total,
}: KnowledgeBaseStatusProps) {
  const statuses = Object.entries(statusMap);

  return (
    <div className="rounded-2xl border border-white/10 bg-background/60 p-5 backdrop-blur-sm">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Knowledge Base
        <span className="ml-2 text-xs font-normal text-muted-foreground">
          {total} total
        </span>
      </h3>

      {statuses.length === 0 ? (
        <div className="flex h-[100px] items-center justify-center text-sm text-muted-foreground">
          No knowledge bases
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {statuses.map(([status, count]) => {
            const config = statusConfig[status] || {
              label: status,
              icon: CheckCircle,
              color: "text-gray-400",
              bg: "bg-gray-500/10",
            };
            const Icon = config.icon;
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

            return (
              <div key={status} className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.bg}`}
                >
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {config.label}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {count}
                    </p>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${
                        status === "ready"
                          ? "from-emerald-500 to-teal-500"
                          : status === "processing"
                            ? "from-amber-500 to-orange-500"
                            : "from-red-500 to-rose-500"
                      } transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
