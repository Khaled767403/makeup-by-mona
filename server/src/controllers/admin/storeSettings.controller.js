import prisma from "../../config/prisma.js";
import { asyncHandler } from "../../middleware/errorHandler.js";

export const getStoreSettings = asyncHandler(async (req, res) => {
  const settings = await prisma.storeSettings.findUnique({ where: { id: "store" } });
  res.json(settings || { id: "store", whatsappNumber: "" });
});

export const updateStoreSettings = asyncHandler(async (req, res) => {
  const { whatsappNumber } = req.body;

  const settings = await prisma.storeSettings.upsert({
    where: { id: "store" },
    update: { whatsappNumber },
    create: { id: "store", whatsappNumber },
  });

  res.json(settings);
});
