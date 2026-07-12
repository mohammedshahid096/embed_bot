import express, { Application, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
// configs
import corsConfig from "./config/cors.config";
import helmetConfig from "./config/helmet.config";
import ratelimitConfig from "./config/ratelimit.config";
import errorHandling from "./utils/errorHandling.util";
import compressionConfig from "./config/compression.config";
import MongoDataBaseConnection from "./config/db.config";
// routes
import IndexRoutes from "./routes/index.route";

const app: Application = express();

MongoDataBaseConnection();

// configs using middlewares
app.use(ratelimitConfig);
app.use(compressionConfig);
app.use(express.json());
app.use(cookieParser());
app.use(helmetConfig);
app.use(corsConfig);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// routes
app.use(IndexRoutes);

// error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  errorHandling.handlingAppError(err, res);
});

export default app;
