import { Router } from "express";
import {
  getOverview, getSalesTrend, getTopProducts, getTopCategories,
} from "../../controllers/admin/analytics.controller.js";

const router = Router();
router.get("/overview", getOverview);
router.get("/sales-trend", getSalesTrend);
router.get("/top-products", getTopProducts);
router.get("/top-categories", getTopCategories);
export default router;
