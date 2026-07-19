import Service from "@/services";

export const getOrganisationKnowledgeBasesApi = async () => {
  const response = await Service.fetchGetAuth("/knowledge-base");
  return response;
};
