import prisma from "../../config/prisma.js";
import { asyncHandler } from "../../middleware/errorHandler.js";

// Resolves { from, to } from ?range=daily|monthly|yearly|custom&from=&to=
function resolveRange(query) {
  const now = new Date();
  let from, to;

  switch (query.range) {
    case "yearly":
      from = new Date(now.getFullYear() - 4, 0, 1);
      to = now;
      break;
    case "custom":
      from = query.from ? new Date(query.from) : new Date(now.getFullYear(), now.getMonth(), 1);
      to = query.to ? new Date(query.to) : now;
      break;
    case "monthly":
      from = new Date(now.getFullYear(), now.getMonth() - 11, 1);
      to = now;
      break;
    case "daily":
    default:
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
      to = now;
      break;
  }
  return { from, to };
}

function previousPeriod(from, to) {
  const spanMs = to.getTime() - from.getTime();
  return { prevFrom: new Date(from.getTime() - spanMs), prevTo: from };
}

function pctChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export const getOverview = asyncHandler(async (req, res) => {
  const { from, to } = resolveRange(req.query);
  const { prevFrom, prevTo } = previousPeriod(from, to);

  const excludedStatus = "CANCELLED";

  const [currentAgg, prevAgg, currentCount, prevCount] = await Promise.all([
    prisma.order.aggregate({
      where: { createdAt: { gte: from, lte: to }, status: { not: excludedStatus } },
      _sum: { grandTotal: true },
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: prevFrom, lt: prevTo }, status: { not: excludedStatus } },
      _sum: { grandTotal: true },
    }),
    prisma.order.count({ where: { createdAt: { gte: from, lte: to }, status: { not: excludedStatus } } }),
    prisma.order.count({ where: { createdAt: { gte: prevFrom, lt: prevTo }, status: { not: excludedStatus } } }),
  ]);

  const currentRevenue = Number(currentAgg._sum.grandTotal || 0);
  const prevRevenue = Number(prevAgg._sum.grandTotal || 0);
  const avgOrderValue = currentCount ? currentRevenue / currentCount : 0;
  const prevAvgOrderValue = prevCount ? prevRevenue / prevCount : 0;

  res.json({
    range: { from, to },
    revenue: { value: currentRevenue, changePct: pctChange(currentRevenue, prevRevenue), currency: "EGP" },
    orders: { value: currentCount, changePct: pctChange(currentCount, prevCount) },
    avgOrderValue: { value: Number(avgOrderValue.toFixed(2)), changePct: pctChange(avgOrderValue, prevAvgOrderValue), currency: "EGP" },
  });
});

export const getSalesTrend = asyncHandler(async (req, res) => {
  const { from, to } = resolveRange(req.query);

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: from, lte: to }, status: { not: "CANCELLED" } },
    select: { createdAt: true, grandTotal: true },
    orderBy: { createdAt: "asc" },
  });

  const bucket = new Map();
  const isYearly = req.query.range === "yearly";
  const isMonthly = req.query.range === "monthly";

  for (const order of orders) {
    const d = new Date(order.createdAt);
    let key;
    if (isYearly) key = `${d.getFullYear()}`;
    else if (isMonthly) key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    else key = d.toISOString().slice(0, 10);

    bucket.set(key, (bucket.get(key) || 0) + Number(order.grandTotal));
  }

  const series = Array.from(bucket.entries())
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([label, total]) => ({ label, total: Number(total.toFixed(2)) }));

  res.json(series);
});

export const getTopProducts = asyncHandler(async (req, res) => {
  const { from, to } = resolveRange(req.query);
  const limit = Number(req.query.limit) || 5;

  const grouped = await prisma.orderItem.groupBy({
    by: ["productId", "titleSnapshot"],
    where: { order: { createdAt: { gte: from, lte: to }, status: { not: "CANCELLED" } } },
    _sum: { quantity: true, priceSnapshot: true },
  });

  const withRevenue = await Promise.all(
    grouped.map(async (g) => {
      const items = await prisma.orderItem.findMany({
        where: {
          productId: g.productId,
          order: { createdAt: { gte: from, lte: to }, status: { not: "CANCELLED" } },
        },
        select: { quantity: true, priceSnapshot: true },
      });
      const revenue = items.reduce((sum, i) => sum + Number(i.priceSnapshot) * i.quantity, 0);
      const qty = items.reduce((sum, i) => sum + i.quantity, 0);
      return { productId: g.productId, title: g.titleSnapshot, quantity: qty, revenue };
    })
  );

  const deduped = Object.values(
    withRevenue.reduce((acc, item) => {
      const key = item.productId || item.title;
      if (!acc[key]) acc[key] = item;
      return acc;
    }, {})
  )
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);

  res.json(deduped);
});

export const getTopCategories = asyncHandler(async (req, res) => {
  const { from, to } = resolveRange(req.query);

  const items = await prisma.orderItem.findMany({
    where: { order: { createdAt: { gte: from, lte: to }, status: { not: "CANCELLED" } } },
    select: {
      quantity: true,
      priceSnapshot: true,
      product: { select: { category: { select: { name: true } } } },
    },
  });

  const byCategory = {};
  for (const item of items) {
    const name = item.product?.category?.name || "Uncategorized";
    byCategory[name] = (byCategory[name] || 0) + Number(item.priceSnapshot) * item.quantity;
  }

  const result = Object.entries(byCategory)
    .map(([name, revenue]) => ({ name, revenue: Number(revenue.toFixed(2)) }))
    .sort((a, b) => b.revenue - a.revenue);

  res.json(result);
});
