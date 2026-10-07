import prisma from "../../config/prisma.js";
import { asyncHandler } from "../../middleware/errorHandler.js";
import { getShippingFee } from "../../utils/shipping.js";

// All prices and the shipping fee are recomputed server-side from the
// database — the client only supplies productId + quantity + delivery info.
// This is what makes the sales analytics trustworthy.
export const createOrder = asyncHandler(async (req, res) => {
  const { customerName, phone, governorate, address, notes, items } = req.body;

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  if (products.length !== productIds.length) {
    return res.status(400).json({ message: "One or more products no longer exist." });
  }

  const outOfStock = products.filter((p) => !p.inStock);
  if (outOfStock.length) {
    return res.status(409).json({
      message: `Out of stock: ${outOfStock.map((p) => p.title).join(", ")}`,
    });
  }

  const orderItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const effectivePrice = product.offerPrice ? Number(product.offerPrice) : Number(product.price);
    return {
      productId: product.id,
      titleSnapshot: product.title,
      priceSnapshot: effectivePrice,
      quantity: item.quantity,
    };
  });

  const itemsTotal = orderItems.reduce((sum, i) => sum + i.priceSnapshot * i.quantity, 0);
  const shippingFee = getShippingFee(governorate);
  const grandTotal = itemsTotal + shippingFee;

  const order = await prisma.order.create({
    data: {
      customerName,
      phone,
      governorate,
      address,
      notes,
      shippingFee,
      itemsTotal,
      grandTotal,
      items: { create: orderItems },
    },
    include: { items: true },
  });

  res.status(201).json(order);
});
