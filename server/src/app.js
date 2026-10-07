import express from "express";
import cors from "cors";
import "dotenv/config";

import { requireAdminAuth } from "./middleware/auth.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

import publicCatalogRoutes from "./routes/public/catalog.routes.js";
import publicCheckoutRoutes from "./routes/public/checkout.routes.js";
import publicShippingRoutes from "./routes/public/shipping.routes.js";
import publicStoreConfigRoutes from "./routes/public/storeConfig.routes.js";

import adminAuthRoutes from "./routes/admin/auth.routes.js";
import adminSettingsRoutes from "./routes/admin/settings.routes.js";
import adminStoreSettingsRoutes from "./routes/admin/storeSettings.routes.js";
import adminCategoriesRoutes from "./routes/admin/categories.routes.js";
import adminProductsRoutes from "./routes/admin/products.routes.js";
import adminBannersRoutes from "./routes/admin/banners.routes.js";
import adminOrdersRoutes from "./routes/admin/orders.routes.js";
import adminAnalyticsRoutes from "./routes/admin/analytics.routes.js";

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

// ---- Public storefront API (no auth) ----
app.use("/api/public/catalog", publicCatalogRoutes);
app.use("/api/public/checkout", publicCheckoutRoutes);
app.use("/api/public/shipping", publicShippingRoutes);
app.use("/api/public/store-config", publicStoreConfigRoutes);

// ---- Admin auth (login itself is unauthenticated) ----
app.use("/api/admin/auth", adminAuthRoutes);

// ---- Everything below requires a valid admin JWT ----
app.use("/api/admin/settings", requireAdminAuth, adminSettingsRoutes);
app.use("/api/admin/store-settings", requireAdminAuth, adminStoreSettingsRoutes);
app.use("/api/admin/categories", requireAdminAuth, adminCategoriesRoutes);
app.use("/api/admin/products", requireAdminAuth, adminProductsRoutes);
app.use("/api/admin/banners", requireAdminAuth, adminBannersRoutes);
app.use("/api/admin/orders", requireAdminAuth, adminOrdersRoutes);
app.use("/api/admin/analytics", requireAdminAuth, adminAnalyticsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
