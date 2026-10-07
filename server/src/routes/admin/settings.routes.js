import { Router } from "express";
import { updateSettings } from "../../controllers/admin/settings.controller.js";
import { validate } from "../../middleware/validate.js";
import { updateSettingsSchema } from "../../utils/schemas.js";

const router = Router();
router.put("/", validate(updateSettingsSchema), updateSettings);
export default router;
