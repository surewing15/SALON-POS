// src/config/api.ts
/**
 * API configuration for the application
 */

// Base API URL - adjust this based on your Laravel deployment
// For local development
export const API_URL = "http://localhost:8000/api";

// For production
// export const API_URL = '/api';  // If serving from the same domain
// export const API_URL = 'https://your-production-api.com/api';

// Headers configuration
export const getHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // If you're using token-based authentication, uncomment this section
  /*
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  */

  return headers;
};
