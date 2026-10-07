import { Router } from "express";
import { getStoreSettings, updateStoreSettings } from "../../controllers/admin/storeSettings.controller.js";
import { validate } from "../../middleware/validate.js";
import { storeSettingsSchema } from "../../utils/schemas.js";

const router = Router();
router.get("/", getStoreSettings);
router.put("/", validate(storeSettingsSchema), updateStoreSettings);
export default router;
