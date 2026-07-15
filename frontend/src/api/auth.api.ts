import Service from "@/services";
import axios from "axios";
import type { LoginAuthBody, RegisterUserBody } from "@/types/api/auth.type";
import API_URLS from "@/services/config";

export const loginAuthApi = async (body: LoginAuthBody) => {
  const response = await Service.fetchPost("/auth/login", body);
  return response;
};

export const checkEmailAvailabilityAuthApi = async (email: string) => {
  const response = await Service.fetchGet(
    `/auth/register/check-email-availability?email=${email}`,
  );
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

export const checkRegisterVerificationLinkAuthApi = async (token: string) => {
  const response = await Service.fetchGet(
    `/auth/register/verify/check-token-validity?token=${token}`,
  );
  return response;
};

export const verifyRegisterVerificationLinkAuthApi = async (token: string) => {
  const response = await Service.fetchGet(
    `/auth/register/verify?token=${token}`,
  );
  return response;
};
