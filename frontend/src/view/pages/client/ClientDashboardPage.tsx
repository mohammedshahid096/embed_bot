import { useEffect, useContext } from "react";
import { LayoutDashboard, RefreshCw } from "lucide-react";
import ClientLayout from "@/view/layout/ClientLayout";
import Context from "@/context/context";
import StatsCards from "@/view/features/dashboard/components/StatsCards";
import MessagesChart from "@/view/features/dashboard/components/MessagesChart";
import TokenUsageChart from "@/view/features/dashboard/components/TokenUsageChart";
import RecentSessions from "@/view/features/dashboard/components/RecentSessions";
import KnowledgeBaseStatus from "@/view/features/dashboard/components/KnowledgeBaseStatus";
import EmbedScriptCard from "@/view/features/dashboard/components/EmbedScriptCard";

const ClientDashboardPage = () => {
  const {
    dashboardState: { dashboardData, isLoading, getDashboardDataAction },
  } = useContext(Context);

  useEffect(() => {
    if (!dashboardData) {
      getDashboardDataAction();
    }
  }, []);

  const handleRefresh = () => {
    getDashboardDataAction();
  };

  return (
    <ClientLayout>
      <div className="relative min-h-screen bg-background pb-16">
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-blob absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl" />
          <div className="animate-blob animation-delay-2000 absolute top-20 -right-40 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="animate-blob animation-delay-4000 absolute -bottom-40 left-1/2 h-[500px] w-[500px] rounded-full bg-emerald-500/8 blur-3xl" />
        </div>

        {/* Grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Overview of your chatbot analytics
                </p>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-background/80 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all hover:border-white/20 hover:text-foreground disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {/* Loading State */}
          {isLoading && !dashboardData && (
            <div className="flex h-[400px] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="h-8 w-8 animate-spin text-purple-500" />
                <p className="text-sm text-muted-foreground">
                  Loading dashboard data...
                </p>
              </div>
            </div>
          )}

          {/* Dashboard Content */}
          {dashboardData && (
            <div className="flex flex-col gap-6">
              {/* Chatbot ID Badge */}
              {dashboardData.chatBotId && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Chatbot ID:
                  </span>
                  <code className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-mono text-purple-400">
                    {dashboardData.chatBotId}
                  </code>
                </div>
              )}

              {/* Stats Cards */}
              <StatsCards
                stats={dashboardData.stats}
                tokenUsage={dashboardData.tokenUsage}
              />

              {/* Embed Script Card */}
              <EmbedScriptCard chatBotId={dashboardData.chatBotId} />

              {/* Charts Row */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <MessagesChart data={dashboardData.messagesPerDay} />
                <TokenUsageChart tokenUsage={dashboardData.tokenUsage} />
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <RecentSessions sessions={dashboardData.recentSessions} />
                <KnowledgeBaseStatus
                  statusMap={dashboardData.stats.knowledgeBaseByStatus}
                  total={dashboardData.stats.totalKnowledgeBases}
                />
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !dashboardData && (
            <div className="flex h-[400px] flex-col items-center justify-center gap-4">
              <LayoutDashboard className="h-12 w-12 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                Unable to load dashboard data. Please try again.
              </p>
              <button
                onClick={handleRefresh}
                className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientDashboardPage;
