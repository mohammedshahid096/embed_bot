export type KnowledgeBaseStatus = "processing" | "ready" | "failed";
export type KnowledgeBaseSourceType = "pdf" | "url" | "text" | "faq";

export interface KnowledgeBaseItem {
  _id: string;
  organisationId: string;
  name: string;
  sourceType: KnowledgeBaseSourceType;
  sourceUrl: string;
  status: KnowledgeBaseStatus;
  chunkCount: number;
  content: string;
  vectorNamespace?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}
