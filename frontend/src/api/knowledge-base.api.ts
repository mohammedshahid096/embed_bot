import Service from "@/services";
import type { AddFaqPayload } from "@/types/api/knowledge-base.types";

export const getOrganisationKnowledgeBasesApi = async () => {
  const response = await Service.fetchGetAuth("/knowledge-base");
  return response;
};

export const addFaqToKnowledgeBaseApi = async (payload: AddFaqPayload) => {
  const response = await Service.fetchPostAuth("/knowledge-base/add/faq", payload);
  return response;
};
