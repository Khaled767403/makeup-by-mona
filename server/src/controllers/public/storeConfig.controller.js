import prisma from "../../config/prisma.js";
import { asyncHandler } from "../../middleware/errorHandler.js";

// Public, read-only: lets the storefront build the wa.me checkout link
// without the number being baked into the frontend build.
export const getStoreConfig = asyncHandler(async (req, res) => {
  const settings = await prisma.storeSettings.findUnique({ where: { id: "store" } });
  res.json({ whatsappNumber: settings?.whatsappNumber || null });
});
