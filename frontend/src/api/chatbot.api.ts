import Service from "@/services";

export const getChatBotDetailsApi = async () => {
  const response = await Service.fetchGet(`/chat/chatbot-details`);
  return response;
};
