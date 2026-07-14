import Service from "@/services";
import type { LoginAuthBody, RegisterUserBody } from "@/types/api/auth.type";

export const loginAuthApi = async (body: LoginAuthBody) => {
  const response = await Service.fetchPost("/auth/login", body);
  return response;
};

export const registerAuthApi = async (body: RegisterUserBody) => {
  const response = await Service.fetchPost("/auth/register", body);
  return response;
};
