const API_URLS = {
  API_SERVER: import.meta.env.VITE_BACKEND_SERVER_URL
    ? `${import.meta.env.VITE_BACKEND_SERVER_URL}/api/v1`
    : "http://localhost:8000/api/v1",
  API_SERVER_BASE_URL: import.meta.env.VITE_BACKEND_SERVER_URL
    ? `${import.meta.env.VITE_BACKEND_SERVER_URL}`
    : "http://localhost:8000",
};

export default API_URLS;
