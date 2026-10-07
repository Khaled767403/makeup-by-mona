import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const username = process.env.ADMIN_USERNAME || "mona";
  const password = process.env.ADMIN_PASSWORD || "changeme123";
  const hashed = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { username },
    update: {},
    create: { username, password: hashed },
  });
  console.log(`✔ Admin ready: ${username} / (from .env)`);

  const categoriesData = [
    { name: "Skincare", description: "Cleansers, serums, moisturizers & more", imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600" },
    { name: "Makeup Boxes", description: "Curated makeup bundles & gift sets", imageUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600" },
    { name: "Beauty Accessories", description: "Brushes, sponges, mirrors & tools", imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600" },
  ];

  const categories = [];
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { slug: slugify(c.name) },
      update: {},
      create: { ...c, slug: slugify(c.name) },
    });
    categories.push(cat);
  }
  console.log(`✔ Categories seeded: ${categories.length}`);

  const productsData = [
    {
      title: "Rose Glow Hydrating Serum",
      description: "A lightweight vitamin C + rose water serum for radiant, hydrated skin.",
      price: 650,
      offerPrice: 520,
      mainImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
      galleryImages: ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800"],
      featured: true,
      categoryName: "Skincare",
    },
    {
      title: "Nude Essentials Makeup Box",
      description: "A curated 6-piece box of everyday nude-tone makeup essentials.",
      price: 1200,
      offerPrice: null,
      mainImage: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800",
      galleryImages: [],
      featured: true,
      categoryName: "Makeup Boxes",
    },
    {
      title: "Rose Gold Brush Set (12pc)",
      description: "Soft, cruelty-free bristles with a rose gold handle finish.",
      price: 450,
      offerPrice: 380,
      mainImage: "https://images.unsplash.com/photo-1583241800698-e8ab01c85009?w=800",
      galleryImages: [],
      featured: false,
      categoryName: "Beauty Accessories",
    },
    {
      title: "Gentle Cleansing Foam",
      description: "pH-balanced daily cleanser with chamomile extract.",
      price: 320,
      offerPrice: null,
      mainImage: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800",
      galleryImages: [],
      featured: false,
      categoryName: "Skincare",
    },
    {
      title: "Bridal Glam Makeup Box",
      description: "Full glam bundle for brides: foundation, palette, lashes & setting spray.",
      price: 2200,
      offerPrice: 1899,
      mainImage: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800",
      galleryImages: [],
      featured: true,
      categoryName: "Makeup Boxes",
    },
  ];

  for (const p of productsData) {
    const category = categories.find((c) => c.name === p.categoryName);
    const slug = slugify(p.title);
    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        title: p.title,
        slug,
        description: p.description,
        price: p.price,
        offerPrice: p.offerPrice,
        mainImage: p.mainImage,
        galleryImages: p.galleryImages,
        featured: p.featured,
        inStock: true,
        categoryId: category.id,
      },
    });
  }
  console.log(`✔ Products seeded: ${productsData.length}`);

  await prisma.banner.upsert({
    where: { id: "seed-banner-1" },
    update: {},
    create: {
      id: "seed-banner-1",
      imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1400",
      headline: "Glow Naturally",
      subtitle: "Skincare & makeup boxes curated by Mona",
      ctaLink: "/catalog",
      isActive: true,
      sortOrder: 0,
    },
  });
  console.log("✔ Banner seeded");

  await prisma.storeSettings.upsert({
    where: { id: "store" },
    update: {},
    create: {
      id: "store",
      whatsappNumber: process.env.STORE_WHATSAPP_NUMBER || "201000000000",
    },
  });
  console.log("✔ Store settings seeded (edit the WhatsApp number from Admin → Settings)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
