import { Router } from "express";
import { createOrder } from "../../controllers/public/checkout.controller.js";
import { validate } from "../../middleware/validate.js";
import { checkoutSchema } from "../../utils/schemas.js";

const router = Router();
router.post("/", validate(checkoutSchema), createOrder);
export default router;
