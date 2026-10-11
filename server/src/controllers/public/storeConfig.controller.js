import prisma from "../../config/prisma.js";
import { asyncHandler } from "../../middleware/errorHandler.js";

// Public, read-only: the storefront uses this for the wa.me checkout link and
// for the contact / social icons in the footer, so none of it is baked into
// the frontend build and Mona can change it from Admin → Settings anytime.
export const getStoreConfig = asyncHandler(async (req, res) => {
  const settings = await prisma.storeSettings.findUnique({ where: { id: "store" } });
  res.json({
    whatsappNumber: settings?.whatsappNumber || null,
    socialLinks: settings?.socialLinks || [],
  });
});
