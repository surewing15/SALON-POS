// src/services/categoryService.ts
import axios from "axios";
import { API_URL, getHeaders } from "../config/api";

export interface Category {
  id: string;
  name: string;
}

interface CategoryCreateRequest {
  name: string;
}

const CategoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await axios.get(`${API_URL}/categories`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  createCategory: async (
    categoryData: CategoryCreateRequest | { name: string }
  ): Promise<Category> => {
    try {
      const response = await axios.post(
        `${API_URL}/categories`,
        { name: categoryData.name },
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  updateCategory: async (
    id: string,
    categoryData: Category
  ): Promise<Category> => {
    try {
      const response = await axios.put(
        `${API_URL}/categories/${id}`,
        { name: categoryData.name },
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  // Delete a category
  deleteCategory: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/categories/${id}`, {
        headers: getHeaders(),
      });
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },
};

export default CategoryService;
