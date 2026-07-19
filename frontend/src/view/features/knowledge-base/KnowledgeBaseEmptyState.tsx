import { Database } from "lucide-react";

const KnowledgeBaseEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 ring-1 ring-purple-500/20">
        <Database className="h-7 w-7 text-purple-400/60" />
      </div>
      <h3 className="text-base font-semibold text-foreground/80">
        No knowledge bases yet
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground/60">
        Your knowledge bases will appear here once you scrape website pages or
        upload documents from the onboarding flow.
      </p>
    </div>
  );
};

export default KnowledgeBaseEmptyState;
