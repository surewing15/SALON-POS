// src/mocks/api.ts
// Simple mock API implementation to help test the UI without a backend

import axios from 'axios';

// Mock data
const mockCategories = [
  { id: "SKINCARE", name: "Skincare" },
  { id: "MAKEUP", name: "Makeup" },
  { id: "FRAGRANCE", name: "Fragrance" },
  { id: "HAIR_CARE", name: "Hair Care" }
];

const mockProducts = [
  {
    id: 1,
    name: "Facial Cleanser",
    price: 499.99,
    category: "SKINCARE",
    description: "Gentle facial cleanser for all skin types",
    image: "lotus"
  },
  {
    id: 2,
    name: "Matte Lipstick",
    price: 299.995,
    category: "MAKEUP",
    description: "Long-lasting matte lipstick in various shades",
    image: "lotus"
  },
  {
    id: 3,
    name: "Hair Serum",
    price: 450.0,
    category: "HAIR_CARE",
    description: "Nourishing hair serum for damaged hair",
    image: "lotus"
  }
];

// Mock implementation setup
export const setupMockApi = () => {
  // Store original axios methods
  const originalAxiosGet = axios.get;
  const originalAxiosPost = axios.post;
  const originalAxiosPut = axios.put;
  const originalAxiosDelete = axios.delete;

  // Override axios methods for development/testing
  axios.get = jest.fn((url, config) => {
    console.log('[MOCK API] GET', url, config);
    
    if (url.includes('/categories')) {
      return Promise.resolve({ data: mockCategories });
    } 
    
    if (url.includes('/products')) {
      const { category, search } = config?.params || {};
      
      let filteredProducts = [...mockProducts];
      
      // Apply category filter
      if (category && category !== 'ALL') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
      }
      
      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchLower) || 
          p.description.toLowerCase().includes(searchLower)
        );
      }
      
      return Promise.resolve({ data: filteredProducts });
    }
    
    // Fallback to original implementation if not mocked
    return originalAxiosGet(url, config);
  });
  
  axios.post = jest.fn((url, data) => {
    console.log('[MOCK API] POST', url, data);
    
    if (url.includes('/categories')) {
      // Add new category
      return Promise.resolve({ data });
    }
    
    if (url.includes('/products')) {
      // Add new product with auto-generated ID
      const newProduct = { ...data, id: mockProducts.length + 1 };
      mockProducts.push(newProduct);
      return Promise.resolve({ data: newProduct });
    }
    
    // Fallback to original implementation if not mocked
    return originalAxiosPost(url, data);
  });
  
  axios.put = jest.fn((url, data) => {
    console.log('[MOCK API] PUT', url, data);
    
    if (url.includes('/categories/')) {
      // Update category
      const categoryId = url.split('/').pop();
      const categoryIndex = mockCategories.findIndex(c => c.id === categoryId);
      
      if (categoryIndex >= 0) {
        mockCategories[categoryIndex] = { ...data };
      }
      
      return Promise.resolve({ data });
    }
    
    if (url.includes('/products/