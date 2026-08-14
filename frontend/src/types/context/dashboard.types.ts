export interface DashboardStats {
  totalSessions: number;
  totalMessages: number;
  humanMessages: number;
  aiMessages: number;
  failedMessages: number;
  totalKnowledgeBases: number;
  knowledgeBaseByStatus: Record<string, number>;
}

export interface DashboardTokenUsage {
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTokens: number;
}

export interface DashboardRecentSession {
  _id: string;
  chatBotId: string;
  messageCount: number;
  lastMessage: string;
  lastMessageRole: string;
  createdAt: string;
}

export interface DashboardMessagePerDay {
  _id: string;
  count: number;
}

export interface DashboardChatBot {
  _id: string;
  config: any;
  isActive: boolean;
  allowedDomains: string[];
}

export interface DashboardData {
  chatBotId: string | null;
  chatBot: DashboardChatBot | null;
  stats: DashboardStats;
  tokenUsage: DashboardTokenUsage;
  recentSessions: DashboardRecentSession[];
  messagesPerDay: DashboardMessagePerDay[];
}

export interface DashboardStateType {
  dashboardData: DashboardData | null;
  isLoading: boolean;
}
