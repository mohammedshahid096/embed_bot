import { getAccessTokenFromRefreshTokenAuthApi } from "@/api/auth.api";
import {
  getSecondaryAccessToken,
  removeSecondaryAccessToken,
  setSecondaryAccessToken,
} from "@/helpers/cookie.helper";
import { removeLoginToken, setLoginToken } from "@/helpers/localstorage.helper";
import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(async (res) => {
  try {
    const haveAAccessKey = getSecondaryAccessToken();
    if (!haveAAccessKey) {
      const response = await getAccessTokenFromRefreshTokenAuthApi();
      if (response.data?.data?.accessToken) {
        const newToken = response.data?.data?.accessToken;
        setSecondaryAccessToken(newToken);
        setLoginToken(newToken);
        return res;
      }
    }
    return res;
  } catch (error: any) {
    if (error.response?.data?.statusCode === 401) {
      removeSecondaryAccessToken();
      removeLoginToken();
      let currentPath = window.location.pathname;
      if (currentPath !== "/") {
        window.location.href = "/";
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(error);
    }
  }
});

export class AxiosConfig {
  private config: AxiosRequestConfig;

  constructor() {
    this.config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
  }

  addConfig<K extends keyof AxiosRequestConfig>(
    key: K,
    value: AxiosRequestConfig[K],
  ): void {
    this.config[key] = value;
  }

  removeConfig(key: keyof AxiosRequestConfig): void {
    if (Object.prototype.hasOwnProperty.call(this.config, key)) {
      delete this.config[key];
    }
  }

  addConfigHeader(key: string, value: string): void {
    if (!this.config.headers) this.config.headers = {};
    this.config.headers[key] = value;
  }

  removeConfigHeader(key: string): void {
    if (this.config.headers && key in this.config.headers) {
      delete this.config.headers[key];
    }
  }

  removeContentType(): void {
    this.removeConfigHeader("Content-Type");
  }

  addAuthorization(token: string): void {
    this.addConfigHeader("Authorization", `Bearer ${token}`);
  }

  addFormHeaderContentType(): void {
    this.addConfigHeader("Content-Type", "multipart/form-data");
  }

  getConfig(): AxiosRequestConfig {
    return this.config;
  }
}

/**
 * RequestMethodInstance handles API requests with cancellation support.
 */
export class RequestMethodInstance {
  private activeRequests: Map<string, AbortController>;

  constructor() {
    this.activeRequests = new Map();
  }

  /** Generate a unique key for each request */
  private getRequestKey(url: string, method: string): string {
    return `${method.toUpperCase()}:${url}`;
  }

  /** Cancel specific request */
  cancelRequest(url: string, method: string): void {
    const key = this.getRequestKey(url, method);
    const controller = this.activeRequests.get(key);
    if (controller) {
      controller.abort();
      this.activeRequests.delete(key);
    }
  }

  /** Cancel all active requests */
  cancelAllRequests(): void {
    this.activeRequests.forEach((controller) => controller.abort());
    this.activeRequests.clear();
  }

  /** Register a new request with its controller */
  private registerRequest(
    url: string,
    method: string,
    controller: AbortController,
  ): () => void {
    const key = this.getRequestKey(url, method);
    this.activeRequests.set(key, controller);
    return () => this.activeRequests.delete(key);
  }

  /** Generic GET method */
  async getMethod<T = any>(
    url: string,
    headers?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const controller = new AbortController();
    const config = { ...headers, signal: controller.signal };
    const cleanup = this.registerRequest(url, "GET", controller);
    const response = await axios.get<T>(url, config);
    cleanup();
    return response;
  }

  /** Generic POST method */
  async postMethod<T = any, B = any>(
    url: string,
    body?: B,
    headers?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const controller = new AbortController();
    const config = { ...headers, signal: controller.signal };
    const cleanup = this.registerRequest(url, "POST", controller);
    const response = await axios.post<T>(url, body, config);
    cleanup();
    return response;
  }

  /** Generic PUT method */
  async putMethod<T = any, B = any>(
    url: string,
    body?: B,
    headers?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const controller = new AbortController();
    const config = { ...headers, signal: controller.signal };
    const cleanup = this.registerRequest(url, "PUT", controller);
    const response = await axios.put<T>(url, body, config);
    cleanup();
    return response;
  }

  /** Generic PATCH method */
  async patchMethod<T = any, B = any>(
    url: string,
    body?: B,
    headers?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const controller = new AbortController();
    const config = { ...headers, signal: controller.signal };
    const cleanup = this.registerRequest(url, "PATCH", controller);
    const response = await axios.patch<T>(url, body, config);
    cleanup();
    return response;
  }

  /** Generic DELETE method */
  async deleteMethod<T = any>(
    url: string,
    headers?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const controller = new AbortController();
    const config = { ...headers, signal: controller.signal };
    const cleanup = this.registerRequest(url, "DELETE", controller);
    const response = await axios.delete<T>(url, config);
    cleanup();
    return response;
  }

  /** Generic GET with Interceptor method */
  async intercepterGetMethod<T = any>(
    url: string,
    headers?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const controller = new AbortController();
    const config = { ...headers, signal: controller.signal };
    const cleanup = this.registerRequest(url, "GET", controller);
    const response = await axiosInstance.get<T>(url, config);
    cleanup();
    return response;
  }
}
