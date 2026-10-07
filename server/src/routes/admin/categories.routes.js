import { Router } from "express";
import {
  listCategories, getCategory, createCategory, updateCategory, deleteCategory,
} from "../../controllers/admin/categories.controller.js";
import { validate } from "../../middleware/validate.js";
import { categorySchema, categoryUpdateSchema } from "../../utils/schemas.js";

const router = Router();
router.get("/", listCategories);
router.get("/:id", getCategory);
router.post("/", validate(categorySchema), createCategory);
router.put("/:id", validate(categoryUpdateSchema), updateCategory);
router.delete("/:id", deleteCategory);
export default router;
