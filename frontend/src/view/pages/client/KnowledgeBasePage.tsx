import { KnowledgeBaseList } from "@/view/features/knowledge-base";

const KnowledgeBasePage = () => {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Animated gradient background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute top-20 -right-40 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute -bottom-40 left-1/2 h-[500px] w-[500px] rounded-full bg-emerald-500/8 blur-3xl" />
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

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-12">
        <KnowledgeBaseList />
      </div>
    </div>
  );
};

export default KnowledgeBasePage;
