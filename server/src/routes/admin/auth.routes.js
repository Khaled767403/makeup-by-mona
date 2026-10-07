import { Router } from "express";
import { login, me } from "../../controllers/admin/auth.controller.js";
import { validate } from "../../middleware/validate.js";
import { loginSchema } from "../../utils/schemas.js";
import { requireAdminAuth } from "../../middleware/auth.js";

const router = Router();
router.post("/login", validate(loginSchema), login);
router.get("/me", requireAdminAuth, me);
export default router;
