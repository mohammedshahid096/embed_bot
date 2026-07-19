import { useCallback, useEffect, useRef, useState } from "react";
import { Database, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { KnowledgeBaseItem } from "@/types/api/knowledge-base.types";
import { getOrganisationKnowledgeBasesApi } from "@/api/knowledge-base.api";
import KnowledgeBaseCard from "./KnowledgeBaseCard";
import KnowledgeBaseEmptyState from "./KnowledgeBaseEmptyState";
import KnowledgeBaseLoadingSkeleton from "./KnowledgeBaseLoadingSkeleton";

const KnowledgeBaseList = () => {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchKnowledgeBases = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await getOrganisationKnowledgeBasesApi();
      const success = response[0];
      const responseData = response[1];

      if (success && responseData?.data) {
        setKnowledgeBases(responseData.data as KnowledgeBaseItem[]);
      } else {
        setIsError(true);
        toast.error("Failed to fetch knowledge bases.");
      }
    } catch {
      setIsError(true);
      toast.error("An error occurred while fetching knowledge bases.");
    } finally {
      setIsLoading(false);
    }
  };

  // Silent poll — updates data without showing loading state or error toasts
  const pollKnowledgeBases = useCallback(async () => {
    try {
      const response = await getOrganisationKnowledgeBasesApi();
      const success = response[0];
      const responseData = response[1];

      if (success && responseData?.data) {
        setKnowledgeBases(responseData.data as KnowledgeBaseItem[]);
      }
    } catch {
      // Silently ignore polling errors
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchKnowledgeBases();
  }, []);

  // Poll every 1 minute while any item is "processing"
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const hasProcessing = knowledgeBases.some((kb) => kb.status === "processing");

  useEffect(() => {
    if (hasProcessing) {
      pollingIntervalRef.current = setInterval(pollKnowledgeBases, 15000);
    } else {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [hasProcessing, pollKnowledgeBases]);

  // Count statuses for the summary
  const processingCount = knowledgeBases.filter(
    (kb) => kb.status === "processing",
  ).length;
  const readyCount = knowledgeBases.filter(
    (kb) => kb.status === "ready",
  ).length;
  const failedCount = knowledgeBases.filter(
    (kb) => kb.status === "failed",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/20">
            <Database className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Knowledge Base
            </h2>
            <p className="text-xs text-muted-foreground/70">
              Your organisation's data sources
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchKnowledgeBases}
          disabled={isLoading}
          className="h-8 gap-1.5 border-white/10 bg-white/5 text-xs hover:bg-white/10 text-muted-foreground hover:text-foreground"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Status summary pills */}
      {!isLoading && !isError && knowledgeBases.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground/50">
            {knowledgeBases.length} total
          </span>
          <span className="text-muted-foreground/20">•</span>
          {readyCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/8 px-2 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/15">
              {readyCount} Ready
            </span>
          )}
          {processingCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/8 px-2 py-0.5 text-[11px] font-medium text-amber-400 border border-amber-500/15">
              {processingCount} Processing
            </span>
          )}
          {failedCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/8 px-2 py-0.5 text-[11px] font-medium text-red-400 border border-red-500/15">
              {failedCount} Failed
            </span>
          )}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <KnowledgeBaseLoadingSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 ring-1 ring-red-500/20">
            <AlertCircle className="h-6 w-6 text-red-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground/80">
              Failed to load knowledge bases
            </h3>
            <p className="text-xs text-muted-foreground/60">
              Something went wrong. Please try again.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchKnowledgeBases}
            className="mt-2 gap-1.5 border-white/10 bg-white/5 text-xs hover:bg-white/10"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </Button>
        </div>
      ) : knowledgeBases.length === 0 ? (
        <KnowledgeBaseEmptyState />
      ) : (
        <div className="grid gap-3">
          {knowledgeBases.map((kb) => (
            <KnowledgeBaseCard key={kb._id} item={kb} />
          ))}
        </div>
      )}
    </div>
  );
};

export default KnowledgeBaseList;
