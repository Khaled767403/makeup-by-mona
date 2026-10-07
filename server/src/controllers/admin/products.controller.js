import prisma from "../../config/prisma.js";
import { asyncHandler } from "../../middleware/errorHandler.js";
import { slugify } from "../../utils/slugify.js";

export const listProducts = asyncHandler(async (req, res) => {
  const { search, categoryId, page = 1, limit = 20 } = req.query;
  const where = {
    ...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
    ...(categoryId ? { categoryId } : {}),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
    prisma.product.count({ where }),
  ]);

  res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { category: true },
  });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const { title, ...rest } = req.body;
  const product = await prisma.product.create({
    data: { ...rest, title, slug: slugify(title) },
  });
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { title, ...rest } = req.body;
  const data = { ...rest };
  if (title) {
    data.title = title;
    data.slug = slugify(title);
  }
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data,
  });
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
