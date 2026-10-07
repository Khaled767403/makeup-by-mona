import { Router } from "express";
import { SHIPPING_FEES } from "../../utils/shipping.js";

const router = Router();
// Lets the frontend render the governorate <select> with live fees without
// duplicating the fee table in client code.
router.get("/", (req, res) => {
  res.json(
    Object.entries(SHIPPING_FEES).map(([governorate, fee]) => ({ governorate, fee }))
  );
});
export default router;
