import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import "./assets/css/style.css";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/dashboard/dashboard.tsx";
import Pos from "./pages/pos/SalonPOS.tsx";
import AddProduct from "./pages/pos/add_product.tsx";

import Inventory from "./pages/inventory/Inventory.tsx";

import Product_Registration from "./pages/product/register.tsx";
import Product_List from "./pages/product/list.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pos" element={<Pos />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/product" element={<Product_List />} />
        <Route path="/product/create" element={<Product_Registration />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
