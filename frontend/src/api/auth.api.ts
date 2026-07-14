import Service from "@/services";
import axios from "axios";
import type { LoginAuthBody, RegisterUserBody } from "@/types/api/auth.type";
import API_URLS from "@/services/config";

export const loginAuthApi = async (body: LoginAuthBody) => {
  const response = await Service.fetchPost("/auth/login", body);
  return response;
};

export const registerAuthApi = async (body: RegisterUserBody) => {
  const response = await Service.fetchPost("/auth/register", body);
  return response;
};

export const getAccessTokenFromRefreshTokenAuthApi = async () => {
  const response = await axios.get(
    `${API_URLS.API_SERVER}/auth/generate-access-token`,
    {
      withCredentials: true,
    },
  );
  return response;
};
