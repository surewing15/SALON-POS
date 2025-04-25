// src/services/productService.ts
import axios from "axios";
import { API_URL, getHeaders } from "../config/api";

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

const ProductService = {
  
  getProducts: async (
    filter: string = "ALL",
    searchTerm: string = ""
  ): Promise<Product[]> => {
    try {
      const response = await axios.get(`${API_URL}/products`, {
        params: {
          category: filter,
          search: searchTerm,
        },
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  getProductById: async (id: number): Promise<Product> => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },


  createProduct: async (productData: Product): Promise<Product> => {
    try {
      const response = await axios.post(`${API_URL}/products`, productData, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

 
  updateProduct: async (id: number, productData: Product): Promise<Product> => {
    try {
      const response = await axios.put(
        `${API_URL}/products/${id}`,
        productData,
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  deleteProduct: async (id: number): Promise<any> => {
    try {
      const response = await axios.delete(`${API_URL}/products/${id}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },
};

export default ProductService;
