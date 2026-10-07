import { Router } from "express";
import { getStoreConfig } from "../../controllers/public/storeConfig.controller.js";

const router = Router();
router.get("/", getStoreConfig);
export default router;
