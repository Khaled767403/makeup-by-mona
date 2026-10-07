import { Router } from "express";
import {
  listProducts, getProduct, createProduct, updateProduct, deleteProduct,
} from "../../controllers/admin/products.controller.js";
import { validate } from "../../middleware/validate.js";
import { productSchema, productUpdateSchema } from "../../utils/schemas.js";

const router = Router();
router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", validate(productSchema), createProduct);
router.put("/:id", validate(productUpdateSchema), updateProduct);
router.delete("/:id", deleteProduct);
export default router;
