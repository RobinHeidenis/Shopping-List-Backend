import { createStandardRoutes } from "./routeCreator.routes";
import { authenticateJWTMiddleware } from "../middlewares/JWTMiddleware";

const controller = require("../controllers/item.controller");

const router = createStandardRoutes("../controllers/item.controller");

router.use(authenticateJWTMiddleware);

router.post("/sequences", controller.updateSequencesRequest);

module.exports = router;
