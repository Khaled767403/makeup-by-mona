import { Router } from "express";
import {
  listCategories, listProducts, getProductBySlug, listBanners,
} from "../../controllers/public/catalog.controller.js";

const router = Router();
router.get("/categories", listCategories);
router.get("/products", listProducts);
router.get("/products/:slug", getProductBySlug);
router.get("/banners", listBanners);
export default router;
