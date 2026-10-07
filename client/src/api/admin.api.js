import api from "./axios.js";

export const adminApi = {
  login: (username, password) =>
    api.post("/admin/auth/login", { username, password }).then((r) => r.data),
  me: () => api.get("/admin/auth/me").then((r) => r.data),
  updateSettings: (payload) => api.put("/admin/settings", payload).then((r) => r.data),

  // Store settings (e.g. WhatsApp number orders are sent to)
  getStoreSettings: () => api.get("/admin/store-settings").then((r) => r.data),
  updateStoreSettings: (payload) => api.put("/admin/store-settings", payload).then((r) => r.data),

  // Categories
  getCategories: () => api.get("/admin/categories").then((r) => r.data),
  createCategory: (data) => api.post("/admin/categories", data).then((r) => r.data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data).then((r) => r.data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`).then((r) => r.data),

  // Products
  getProducts: (params = {}) => api.get("/admin/products", { params }).then((r) => r.data),
  getProduct: (id) => api.get(`/admin/products/${id}`).then((r) => r.data),
  createProduct: (data) => api.post("/admin/products", data).then((r) => r.data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data).then((r) => r.data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`).then((r) => r.data),

  // Banners
  getBanners: () => api.get("/admin/banners").then((r) => r.data),
  createBanner: (data) => api.post("/admin/banners", data).then((r) => r.data),
  updateBanner: (id, data) => api.put(`/admin/banners/${id}`, data).then((r) => r.data),
  deleteBanner: (id) => api.delete(`/admin/banners/${id}`).then((r) => r.data),

  // Orders
  getOrders: (params = {}) => api.get("/admin/orders", { params }).then((r) => r.data),
  getOrder: (id) => api.get(`/admin/orders/${id}`).then((r) => r.data),
  updateOrderStatus: (id, status) =>
    api.patch(`/admin/orders/${id}/status`, { status }).then((r) => r.data),

  // Analytics
  getOverview: (params = {}) => api.get("/admin/analytics/overview", { params }).then((r) => r.data),
  getSalesTrend: (params = {}) => api.get("/admin/analytics/sales-trend", { params }).then((r) => r.data),
  getTopProducts: (params = {}) => api.get("/admin/analytics/top-products", { params }).then((r) => r.data),
  getTopCategories: (params = {}) => api.get("/admin/analytics/top-categories", { params }).then((r) => r.data),
};
