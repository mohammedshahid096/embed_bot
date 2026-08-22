export interface IWebsiteScrapperPayload {
  url: string;
  organisationId: string;
  knowledgeBaseId: string;
  crawlJobId: string;
}
export interface IAddToKnowledgeBasePayload {
  organisationId: string;
  knowledgeBaseId: string;
}

export interface IChatMessagePayload {
  message: string;
  organisationId: string;
  sessionId: string;
  messageId: string;
  order: number;
}
