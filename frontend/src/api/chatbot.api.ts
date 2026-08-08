import Service from "@/services";

export const getChatBotDetailsApi = async () => {
  const response = await Service.fetchGetAuth(`/chat/chatbot-details`);
  return response;
};

export const updateChatBotDetailsApi = async (config: any) => {
  const response = await Service.fetchPutAuth(`/chat/chatbot-details`, {
    config,
  });
  return response;
};
