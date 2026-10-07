import prisma from "../../config/prisma.js";
import { asyncHandler } from "../../middleware/errorHandler.js";

export const listBanners = asyncHandler(async (req, res) => {
  const banners = await prisma.banner.findMany({ orderBy: { sortOrder: "asc" } });
  res.json(banners);
});

export const createBanner = asyncHandler(async (req, res) => {
  const banner = await prisma.banner.create({ data: req.body });
  res.status(201).json(banner);
});

export const updateBanner = asyncHandler(async (req, res) => {
  const banner = await prisma.banner.update({ where: { id: req.params.id }, data: req.body });
  res.json(banner);
});

export const deleteBanner = asyncHandler(async (req, res) => {
  await prisma.banner.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
