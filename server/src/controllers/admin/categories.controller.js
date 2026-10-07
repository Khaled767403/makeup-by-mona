import prisma from "../../config/prisma.js";
import { asyncHandler } from "../../middleware/errorHandler.js";
import { slugify } from "../../utils/slugify.js";

export const listCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(categories);
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await prisma.category.findUnique({ where: { id: req.params.id } });
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.json(category);
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, imageUrl } = req.body;
  const category = await prisma.category.create({
    data: { name, description, imageUrl, slug: slugify(name) },
  });
  res.status(201).json(category);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, imageUrl } = req.body;
  const data = { description, imageUrl };
  if (name) {
    data.name = name;
    data.slug = slugify(name);
  }
  const category = await prisma.category.update({
    where: { id: req.params.id },
    data,
  });
  res.json(category);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const productCount = await prisma.product.count({ where: { categoryId: req.params.id } });
  if (productCount > 0) {
    return res.status(409).json({
      message: `Cannot delete: ${productCount} product(s) still belong to this category.`,
    });
  }
  await prisma.category.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
