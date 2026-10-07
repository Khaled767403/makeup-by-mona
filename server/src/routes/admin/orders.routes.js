import { Router } from "express";
import { listOrders, getOrder, updateOrderStatus } from "../../controllers/admin/orders.controller.js";

const router = Router();
router.get("/", listOrders);
router.get("/:id", getOrder);
router.patch("/:id/status", updateOrderStatus);
export default router;
