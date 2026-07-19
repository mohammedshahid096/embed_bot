import { Database } from "lucide-react";

const KnowledgeBaseLoadingSkeleton = () => {
  return (
    <div className="space-y-3">
      {/* Skeleton header */}
      <div className="flex items-center justify-center gap-3 py-6">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-3 border-purple-500/20 border-t-purple-500 animate-spin" />
          <Database className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-purple-400/60 animate-pulse" />
        </div>
        <div className="space-y-1.5">
          <div className="text-sm font-medium text-foreground/70">
            Loading knowledge bases...
          </div>
          <div className="text-xs text-muted-foreground/50">
            Fetching your data sources
          </div>
        </div>
      </div>

      {/* Skeleton cards */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-white/5 bg-card/30 p-4 animate-pulse"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-white/5" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-white/5" />
              <div className="h-3 w-1/2 rounded bg-white/3" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 pt-2 border-t border-white/3">
            <div className="h-5 w-12 rounded-full bg-white/5" />
            <div className="h-5 w-20 rounded-full bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default KnowledgeBaseLoadingSkeleton;
