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
    VERIFICATION_TOKEN_KEY: string;
    VERIFICATION_TOKEN_KEY_TIME: string;
  };

  chromadb: {
    CHROMA_HOST: string;
    CHROMA_PORT: number;
    CHROMA_SSL: boolean;
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
    ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY || "something",
    ACCESS_TOKEN_KEY_TIME: process.env.ACCESS_TOKEN_KEY_TIME || "1D",
    VERIFICATION_TOKEN_KEY: process.env.VERIFICATION_TOKEN_KEY || "something2",
    VERIFICATION_TOKEN_KEY_TIME:
      process.env.VERIFICATION_TOKEN_KEY_TIME || "5m",
  },

  chromadb: {
    CHROMA_HOST: process.env.CHROMA_HOST ?? "localhost",
    CHROMA_PORT: Number(process.env.CHROMA_PORT ?? 8000),
    CHROMA_SSL: Boolean(process.env.CHROMA_SSL ?? false),
  },
};

export default config;
