import Service from "@/services";

export const getMyUserProfileApi = async () => {
  const response = await Service.fetchGetAuth("/user/profile");
  return response;
};
