import dotenv from "dotenv";

type Environment = "development" | "production";

interface Config {
  PORT: number | string;
  DEVELOPMENT_MODE: Environment;

  cors: {
    CORS_ALLOW_ORIGINS: string[];
  };

  mongodb: {
    DB_URL: string;
  };

  redis: {
    REDIS_URL: string;
    FLUSH_ALL: boolean;
  };

  jwt: {
    ACCESS_TOKEN_KEY: string;
    ACCESS_TOKEN_KEY_TIME: string;
    REFRESH_TOKEN_KEY: string;
    REFRESH_TOKEN_KEY_TIME: string;
    VERIFICATION_TOKEN_KEY: string;
    VERIFICATION_TOKEN_KEY_TIME: string;
  };

  cookie: {
    ACCESS_TOKEN_COOKIE_TIME: string;
    REFRESH_TOKEN_COOKIE_TIME: string;
  };

  chromadb: {
    CHROMA_HOST: string;
    CHROMA_PORT: number;
    CHROMA_SSL: boolean;
  };

  hosts: {
    CLIENT_HOST_URL: string;
  };
}

dotenv.config();

const config: Config = {
  PORT: process.env.PORT || 8001,
  DEVELOPMENT_MODE:
    (process.env.DEVELOPMENT_MODE as Environment) || "development",

  cors: {
    CORS_ALLOW_ORIGINS: JSON.parse(process.env.ALLOW_ORIGINS_ACCESS || "[]"),
  },

  mongodb: {
    DB_URL: process.env.DB_URL || "mongodb://127.0.0.1:27017/embed_bot",
  },

  redis: {
    REDIS_URL: "redis://localhost:6379",
    FLUSH_ALL: false,
  },

  jwt: {
    ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY || "something_access_token",
    ACCESS_TOKEN_KEY_TIME: process.env.ACCESS_TOKEN_KEY_TIME || "5m",
    REFRESH_TOKEN_KEY:
      process.env.REFRESH_TOKEN_KEY || "something_refresh_token",
    REFRESH_TOKEN_KEY_TIME: process.env.REFRESH_TOKEN_KEY_TIME || "3D",
    VERIFICATION_TOKEN_KEY:
      process.env.VERIFICATION_TOKEN_KEY || "something_verification_token",
    VERIFICATION_TOKEN_KEY_TIME:
      process.env.VERIFICATION_TOKEN_KEY_TIME || "5m",
  },

  cookie: {
    ACCESS_TOKEN_COOKIE_TIME: process.env.ACCESS_TOKEN_COOKIE_TIME || "5", //mins
    REFRESH_TOKEN_COOKIE_TIME: process.env.REFRESH_TOKEN_COOKIE_TIME || "3", //days
  },

  chromadb: {
    CHROMA_HOST: process.env.CHROMA_HOST ?? "localhost",
    CHROMA_PORT: Number(process.env.CHROMA_PORT ?? 8000),
    CHROMA_SSL: Boolean(process.env.CHROMA_SSL ?? false),
  },

  hosts: {
    CLIENT_HOST_URL: "http://localhost:3000",
  },
};

export default config;
