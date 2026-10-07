import api from "./axios.js";

export const publicApi = {
  getCategories: () => api.get("/public/catalog/categories").then((r) => r.data),

  getProducts: (params = {}) =>
    api.get("/public/catalog/products", { params }).then((r) => r.data),

  getProductBySlug: (slug) =>
    api.get(`/public/catalog/products/${slug}`).then((r) => r.data),

  getBanners: () => api.get("/public/catalog/banners").then((r) => r.data),

  getShippingRates: () => api.get("/public/shipping").then((r) => r.data),

  getStoreConfig: () => api.get("/public/store-config").then((r) => r.data),

  createOrder: (payload) => api.post("/public/checkout", payload).then((r) => r.data),
};
