import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const updateSettingsSchema = z.object({
  username: z.string().min(3).optional(),
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
});

export const productSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  price: z.coerce.number().positive(),
  offerPrice: z.coerce.number().positive().optional().nullable(),
  mainImage: z.string().url(),
  galleryImages: z.array(z.string().url()).optional().default([]),
  inStock: z.coerce.boolean().optional().default(true),
  featured: z.coerce.boolean().optional().default(false),
  categoryId: z.string().min(1),
});

export const bannerSchema = z.object({
  imageUrl: z.string().url(),
  headline: z.string().min(1),
  subtitle: z.string().optional().nullable(),
  ctaLink: z.string().optional().nullable(),
  isActive: z.coerce.boolean().optional().default(true),
  sortOrder: z.coerce.number().optional().default(0),
});

// Digits only, country code first (e.g. "201234567890") — this is exactly
// the format wa.me requires, so we validate it at the boundary.
export const storeSettingsSchema = z.object({
  whatsappNumber: z.string().regex(/^\d{8,15}$/, "Enter digits only, with country code, e.g. 201234567890"),
});

export const categoryUpdateSchema = categorySchema.partial();
export const productUpdateSchema = productSchema.partial();
export const bannerUpdateSchema = bannerSchema.partial();

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(1),
  phone: z.string().min(6),
  governorate: z.string().min(1),
  address: z.string().min(1),
  notes: z.string().optional().nullable(),
  items: z.array(checkoutItemSchema).min(1),
});
