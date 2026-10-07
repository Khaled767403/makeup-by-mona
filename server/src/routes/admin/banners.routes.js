import { Router } from "express";
import {
  listBanners, createBanner, updateBanner, deleteBanner,
} from "../../controllers/admin/banners.controller.js";
import { validate } from "../../middleware/validate.js";
import { bannerSchema, bannerUpdateSchema } from "../../utils/schemas.js";

const router = Router();
router.get("/", listBanners);
router.post("/", validate(bannerSchema), createBanner);
router.put("/:id", validate(bannerUpdateSchema), updateBanner);
router.delete("/:id", deleteBanner);
export default router;
