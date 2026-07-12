import { Router } from "express";
import authRoutes from "./auth.route";

const apiV1Routes = Router();

apiV1Routes.use("/auth", authRoutes);

export default apiV1Routes;
