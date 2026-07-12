import config from "./index.config";
import cors from "cors";

const corsOptions = {
  origin: config.cors.CORS_ALLOW_ORIGINS,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowheaders: ["Content-Type", "Authorization"],
};

const corsConfig = cors(corsOptions);

export default corsConfig;
