// src/services/productCategoryService.ts
import axios from "axios";
import { API_URL, getHeaders } from "../config/api";
import { Product } from "./productService";
import { Category } from "./categoryService";

export interface ProductWithCategory extends Product {
  categoryName: string;
}

const ProductCategoryService = {
  /**
   * Gets products with their corresponding category names
   * @param filter Optional category filter
   * @param searchTerm Optional search term
   * @returns Promise with products including category names
   */
  getProductsWithCategories: async (
    filter: string = "ALL",
    searchTerm: string = ""
  ): Promise<ProductWithCategory[]> => {
    try {
      // Get all categories first to create a mapping
      const categoriesResponse = await axios.get(`${API_URL}/categories`, {
        headers: getHeaders(),
      });

      const categories: Category[] = categoriesResponse.data;
      const categoryMap = new Map<number, string>();

      categories.forEach((category) => {
        categoryMap.set(parseInt(category.id), category.name);
      });

      // Get products filtered by category if specified
      const productsResponse = await axios.get(`${API_URL}/products`, {
        params: {
          category: filter !== "ALL" ? filter : undefined,
          search: searchTerm || undefined,
        },
        headers: getHeaders(),
      });

      const products: Product[] = productsResponse.data;

      // Map products to include category names
      const productsWithCategories: ProductWithCategory[] = products.map(
        (product) => ({
          ...product,
          categoryName:
            categoryMap.get(product.category as unknown as number) || "Unknown",
        })
      );

      return productsWithCategories;
    } catch (error) {
      console.error("Error fetching products with categories:", error);
      throw error;
    }
  },

  /**
   * Gets all products for a specific category
   * @param categoryId Category ID to filter products
   * @returns Promise with products for the specified category
   */
  getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
    try {
      const response = await axios.get(`${API_URL}/products`, {
        params: { category: categoryId },
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching products for category ${categoryId}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Gets category details with count of products in each category
   * @returns Promise with categories and their product counts
   */
  getCategoriesWithProductCounts: async (): Promise<
    { id: string; name: string; productCount: number }[]
  > => {
    try {
      // Get all categories
      const categoriesResponse = await axios.get(`${API_URL}/categories`, {
        headers: getHeaders(),
      });
      const categories: Category[] = categoriesResponse.data;

      // Get all products
      const productsResponse = await axios.get(`${API_URL}/products`, {
        headers: getHeaders(),
      });
      const products: Product[] = productsResponse.data;

      // Count products in each category
      const categoryProductCounts = categories.map((category) => {
        const count = products.filter(
          (product) =>
            product.category === category.id ||
            product.category === parseInt(category.id)
        ).length;

        return {
          id: category.id,
          name: category.name,
          productCount: count,
        };
      });

      return categoryProductCounts;
    } catch (error) {
      console.error("Error fetching categories with product counts:", error);
      throw error;
    }
  },

  /**
   * Creates a product with category validation
   * @param productData Product data to create
   * @returns Promise with created product
   */
  createProductWithCategory: async (
    productData: Omit<Product, "id"> & { categoryId: number }
  ): Promise<Product> => {
    try {
      // First check if the category exists
      await axios.get(`${API_URL}/categories/${productData.categoryId}`, {
        headers: getHeaders(),
      });

      // If category exists, create the product
      const response = await axios.post(
        `${API_URL}/products`,
        {
          ...productData,
          category: productData.categoryId,
        },
        {
          headers: getHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error creating product with category:", error);
      throw error;
    }
  },

  /**
   * Updates both product and category information if needed
   * @param productId Product ID to update
   * @param productData Updated product data
   * @param categoryName Optional category name to update
   * @returns Promise with updated product
   */
  updateProductAndCategory: async (
    productId: number,
    productData: Partial<Product>,
    categoryName?: string
  ): Promise<Product> => {
    try {
      // If category name is provided, update the category
      if (categoryName && productData.category) {
        await axios.put(
          `${API_URL}/categories/${productData.category}`,
          { name: categoryName },
          { headers: getHeaders() }
        );
      }

      // Update the product
      const response = await axios.put(
        `${API_URL}/products/${productId}`,
        productData,
        { headers: getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error(`Error updating product ${productId} and category:`, error);
      throw error;
    }
  },
};

export default ProductCategoryService;
