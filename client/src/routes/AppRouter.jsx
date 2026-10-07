import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";

import StoreLayout from "../pages/store/StoreLayout.jsx";
import Home from "../pages/store/Home.jsx";
import Catalog from "../pages/store/Catalog.jsx";
import ProductDetail from "../pages/store/ProductDetail.jsx";
import Cart from "../pages/store/Cart.jsx";
import Checkout from "../pages/store/Checkout.jsx";

import AdminLayout from "../pages/admin/AdminLayout.jsx";
import Login from "../pages/admin/Login.jsx";
import Dashboard from "../pages/admin/Dashboard.jsx";
import Categories from "../pages/admin/Categories.jsx";
import Products from "../pages/admin/Products.jsx";
import Banners from "../pages/admin/Banners.jsx";
import Orders from "../pages/admin/Orders.jsx";
import Settings from "../pages/admin/Settings.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer storefront */}
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Products />} />
          <Route path="banners" element={<Banners />} />
          <Route path="orders" element={<Orders />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
