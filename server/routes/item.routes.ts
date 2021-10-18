import { createStandardRoutes } from "./routeCreator.routes";

const controller = require("../controllers/item.controller");

const router = createStandardRoutes("../controllers/item.controller");
router.post("/sequences", controller.updateSequencesRequest);
module.exports = router;
