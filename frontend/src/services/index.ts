import API_URLS from "./config";

// Define access point keys based on API_URLS
type AccessPoint = "server";

// Content type options
type ContentType = "json" | "formData" | null;

// Define the unified API response tuple
export type ServiceResponse<T = any> = [boolean, T, number?, Response?];

// Map base API URLs
const ApiUrlMapper: Record<AccessPoint, string> = {
  server: API_URLS.API_SERVER,
};

export class FetchConfig {
  private config: RequestInit;

  constructor() {
    this.config = {
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      credentials: "include",
    };
  }

  addConfig<K extends keyof RequestInit>(key: K, value: RequestInit[K]): void {
    this.config[key] = value;
  }

  removeConfig(key: keyof RequestInit): void {
    if (Object.prototype.hasOwnProperty.call(this.config, key)) {
      delete this.config[key];
    }
  }

  addConfigHeader(key: string, value: string): void {
    if (!(this.config.headers instanceof Headers)) {
      this.config.headers = new Headers(this.config.headers || {});
    }
    (this.config.headers as Headers).set(key, value);
  }

  removeConfigHeader(key: string): void {
    if (this.config.headers instanceof Headers) {
      this.config.headers.delete(key);
    } else if (this.config.headers && typeof this.config.headers === "object") {
      delete (this.config.headers as Record<string, string>)[key];
    }
  }

  removeContentType(): void {
    this.removeConfigHeader("Content-Type");
  }

  addAuthorization(token: string): void {
    this.addConfigHeader("Authorization", `Bearer ${token}`);
  }

  addFormHeaderContentType(): void {
    // When using fetch with FormData, we generally don't set the Content-Type
    // to multipart/form-data manually, because the browser needs to set it
    // with the boundary automatically.
    this.removeContentType();
  }

  getConfig(): RequestInit {
    return this.config;
  }
}

/**
 * Builds headers dynamically based on token and content type.
 */
const handleHeaders = (
  token?: string | null,
  contentType?: ContentType,
): RequestInit => {
  const fetchConfig = new FetchConfig();

  if (!contentType) {
    fetchConfig.removeContentType();
  } else if (contentType === "formData") {
    fetchConfig.addFormHeaderContentType();
  }

  if (token) {
    fetchConfig.addAuthorization(token);
  }

  return fetchConfig.getConfig();
};

/**
 * Handles fetch responses and normalizes the result.
 */
const processResponse = async <T = any>(
  response: Response | Error | any,
): Promise<ServiceResponse<T>> => {
  if (response instanceof Error) {
    if (response.name === "AbortError") {
      return [
        false,
        { message: "api is aborted" } as unknown as T,
        undefined,
        undefined,
      ];
    }
    return [
      false,
      { message: response.message } as unknown as T,
      500,
      undefined,
    ];
  }

  let data: any = null;

  // Safely parse JSON if possible, otherwise read text
  try {
    const contentType = response.headers?.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
      // Try to parse text as JSON just in case no content-type is returned but it's JSON
      try {
        if (data) {
          data = JSON.parse(data);
        }
      } catch (e) {
        // Leave as text
      }
    }
  } catch (error) {
    data = null;
  }

  if (response.status === 200 || response.status === 201) {
    return [true, data as T, response.status, response];
  } else if (response.status === 401) {
    onUserKickedOut();
    return [false, data as T, response.status, response];
  } else {
    return [false, data as T, response.status, response];
  }
};

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

  /** Generic request method core */
  private async triggerFetch<T = any>(
    url: string,
    method: string,
    config: RequestInit = {},
  ): Promise<Response> {
    const controller = new AbortController();
    const finalConfig = { ...config, method, signal: controller.signal };
    const cleanup = this.registerRequest(url, method, controller);

    try {
      const response = await fetch(url, finalConfig);
      cleanup();
      return response;
    } catch (e: any) {
      cleanup();
      throw e;
    }
  }

  /** Helper to format body for fetch */
  private formatBody(body: any, config?: RequestInit): RequestInit {
    const finalConfig = { ...config };
    if (body !== undefined && body !== null) {
      if (typeof FormData !== "undefined" && body instanceof FormData) {
        finalConfig.body = body;
      } else if (typeof Blob !== "undefined" && body instanceof Blob) {
        finalConfig.body = body;
      } else if (
        typeof URLSearchParams !== "undefined" &&
        body instanceof URLSearchParams
      ) {
        finalConfig.body = body;
      } else if (typeof body === "object") {
        finalConfig.body = JSON.stringify(body);
      } else {
        finalConfig.body = body as any;
      }
    }
    return finalConfig;
  }

  /** Generic GET method */
  async getMethod<T = any>(
    url: string,
    config?: RequestInit,
  ): Promise<Response> {
    return this.triggerFetch<T>(url, "GET", config);
  }

  /** Generic POST method */
  async postMethod<T = any, B = any>(
    url: string,
    body?: B,
    config?: RequestInit,
  ): Promise<Response> {
    const finalConfig = this.formatBody(body, config);
    return this.triggerFetch<T>(url, "POST", finalConfig);
  }

  /** Generic PUT method */
  async putMethod<T = any, B = any>(
    url: string,
    body?: B,
    config?: RequestInit,
  ): Promise<Response> {
    const finalConfig = this.formatBody(body, config);
    return this.triggerFetch<T>(url, "PUT", finalConfig);
  }

  /** Generic PATCH method */
  async patchMethod<T = any, B = any>(
    url: string,
    body?: B,
    config?: RequestInit,
  ): Promise<Response> {
    const finalConfig = this.formatBody(body, config);
    return this.triggerFetch<T>(url, "PATCH", finalConfig);
  }

  /** Generic DELETE method */
  async deleteMethod<T = any>(
    url: string,
    config?: RequestInit,
  ): Promise<Response> {
    return this.triggerFetch<T>(url, "DELETE", config);
  }
}

// Create API request handler
const apiFetch = new RequestMethodInstance();

/**
 * Unified API service with typed endpoints.
 */
const Service = {
  fetchGet: async <T = any>(
    url: string,
    token: string | null = null,
    contentType: ContentType = null,
    accessPoint: AccessPoint = "server",
  ): Promise<ServiceResponse<T>> => {
    try {
      const endpoint = ApiUrlMapper[accessPoint] + url;
      const config = handleHeaders(token, contentType);
      const response = await apiFetch.getMethod<T>(endpoint, config);
      return processResponse<T>(response);
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log(`Request to ${url} was cancelled`);
        return [false, { message: "api is aborted" } as unknown as T];
      }
      onFailure("network", url);
      return processResponse<T>(error);
    }
  },

  fetchPost: async <T = any, B = any>(
    url: string,
    body: B,
    token?: string,
    contentType: ContentType = "json",
    accessPoint: AccessPoint = "server",
  ): Promise<ServiceResponse<T>> => {
    try {
      const endpoint = ApiUrlMapper[accessPoint] + url;
      const config = handleHeaders(token, contentType);
      const response = await apiFetch.postMethod<T, B>(endpoint, body, config);
      return processResponse<T>(response);
    } catch (error: any) {
      onFailure("network", url);
      return processResponse<T>(error);
    }
  },

  fetchPut: async <T = any, B = any>(
    url: string,
    body: B,
    token: string | null = null,
    contentType: ContentType = "json",
    accessPoint: AccessPoint = "server",
  ): Promise<ServiceResponse<T>> => {
    try {
      const endpoint = ApiUrlMapper[accessPoint] + url;
      const config = handleHeaders(token, contentType);
      const response = await apiFetch.putMethod<T, B>(endpoint, body, config);
      return processResponse<T>(response);
    } catch (error: any) {
      onFailure("network", url);
      return processResponse<T>(error);
    }
  },

  fetchPatch: async <T = any, B = any>(
    url: string,
    body: B,
    token: string | null = null,
    contentType: ContentType = "json",
    accessPoint: AccessPoint = "server",
  ): Promise<ServiceResponse<T>> => {
    try {
      const endpoint = ApiUrlMapper[accessPoint] + url;
      const config = handleHeaders(token, contentType);
      const response = await apiFetch.patchMethod<T, B>(endpoint, body, config);
      return processResponse<T>(response);
    } catch (error: any) {
      onFailure("network", url);
      return processResponse<T>(error);
    }
  },

  fetchDelete: async <T = any>(
    url: string,
    token: string | null = null,
    contentType: ContentType = "json",
    accessPoint: AccessPoint = "server",
  ): Promise<ServiceResponse<T>> => {
    try {
      const endpoint = ApiUrlMapper[accessPoint] + url;
      const config = handleHeaders(token, contentType);
      const response = await apiFetch.deleteMethod<T>(endpoint, config);
      return processResponse<T>(response);
    } catch (error: any) {
      onFailure("network", url);
      return processResponse<T>(error);
    }
  },

  cancelAllRequests: (): void => {
    apiFetch.cancelAllRequests();
  },

  cancelRequest: (
    url: string,
    method: string,
    accessPoint: AccessPoint = "server",
  ): void => {
    const endpoint = ApiUrlMapper[accessPoint] + url;
    apiFetch.cancelRequest(endpoint, method);
  },
};

/**
 * Handles generic API failures.
 */
const onFailure = async (res: string, url: string): Promise<void> => {
  console.error(`API FAILED: ${url} (${res})`);
};

/**
 * Handles forced user logout (401 responses).
 */
const onUserKickedOut = async (): Promise<void> => {
  if (typeof window !== "undefined") {
    localStorage.clear();
    window.location.href = "/";
  }
};

export default Service;
