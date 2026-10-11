import prisma from "../../config/prisma.js";
import { asyncHandler } from "../../middleware/errorHandler.js";

export const getStoreSettings = asyncHandler(async (req, res) => {
  const settings = await prisma.storeSettings.findUnique({ where: { id: "store" } });
  res.json(settings || { id: "store", whatsappNumber: "", socialLinks: [] });
});

// Only the fields that were sent are changed, so saving the WhatsApp number
// never wipes the social links (and vice versa).
export const updateStoreSettings = asyncHandler(async (req, res) => {
  const { whatsappNumber, socialLinks } = req.body;
  const links = socialLinks ? [...new Set(socialLinks)] : undefined;

  const data = {
    ...(whatsappNumber !== undefined ? { whatsappNumber } : {}),
    ...(links !== undefined ? { socialLinks: links } : {}),
  };

  const settings = await prisma.storeSettings.upsert({
    where: { id: "store" },
    update: data,
    create: { id: "store", whatsappNumber: whatsappNumber ?? "", socialLinks: links ?? [] },
  });

  res.json(settings);
});
