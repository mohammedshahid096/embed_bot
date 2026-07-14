// Define allowed environment modes
type EnvMode = "development" | "production";

// Define the shape of your API configuration
interface ServerConfig {
  API_SERVER: string;
  API_SERVER_BASE_URL: string;
}

// Development configuration
const development: ServerConfig = {
  API_SERVER: "http://localhost:8000/api/v1",
  API_SERVER_BASE_URL: "http://localhost:8000",
};

// Production configuration
const production: ServerConfig = {
  API_SERVER: import.meta.env.VITE_API_SERVER as string,
  API_SERVER_BASE_URL: import.meta.env.VITE_BACKEND_SERVER_URL
    ? `${import.meta.env.VITE_BACKEND_SERVER_URL}`
    : "http://localhost:8000",
};

// Map environments to configs
const configUrls: Record<EnvMode, ServerConfig> = {
  development,
  production,
};

// Get current environment mode (default to development)
const currentMode =
  (import.meta.env.VITE_DEVELOPMENT_MODE as EnvMode) || "development";

const API_URLS: ServerConfig = configUrls[currentMode];

export default API_URLS;
