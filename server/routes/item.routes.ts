import { authenticateJWTMiddleware } from "../middlewares/JWTMiddleware";
import { createStandardRoutes } from "./routeCreator.routes";
import controller = require("../controllers/item.controller");

export const itemRouter = createStandardRoutes(
  "../controllers/item.controller"
);

itemRouter.use(authenticateJWTMiddleware);

itemRouter.post("/sequences", controller.updateSequencesRequest);
