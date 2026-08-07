import { Router } from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import userOrganisationRoutes from "./user-org.routes";
import knowledgeBaseRoutes from "./knowledge-base.route";
import chatRoutes from "./chat.route";
import { testingController } from "../controllers/testing.controller";

const apiV1Routes = Router();

apiV1Routes.use("/auth", authRoutes);
apiV1Routes.use("/user", userRoutes);
apiV1Routes.use("/organisation", userOrganisationRoutes);
apiV1Routes.use("/knowledge-base", knowledgeBaseRoutes);
apiV1Routes.use("/chat", chatRoutes);
apiV1Routes.route("/test").get(testingController);

export default apiV1Routes;
