import { Router } from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import userOrganisationRoutes from "./user-org.routes";

const apiV1Routes = Router();

apiV1Routes.use("/auth", authRoutes);
apiV1Routes.use("/user", userRoutes);
apiV1Routes.use("/organisation", userOrganisationRoutes);

export default apiV1Routes;
