import { Router } from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";

const apiV1Routes = Router();

apiV1Routes.use("/auth", authRoutes);
apiV1Routes.use("/user", userRoutes);

export default apiV1Routes;
