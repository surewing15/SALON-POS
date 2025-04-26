// src/services/SaleService.ts
import axios from "axios";
import { API_URL, getHeaders } from "../config/api";

export interface SaleItem {
  name: string;
  price: number;
  discount: number;
  total: number;
  product_id?: number;
}

export interface Sale {
  id?: number;
  invoice_number?: string;
  cart_items: SaleItem[];
  saleItems?: SaleItem[];
  sub_total: number;
  total_discount: number;
  grand_total: number;
  payment_method: string;
  notes?: string;
  status?: string;
  created_at?: string;
}

export interface PaymentDetails {
  amountTendered?: string;
  referenceNumber?: string;
}

export interface SaleFilter {
  date_from?: string;
  date_to?: string;
  payment_method?: string;
  status?: string;
  page?: number;
  limit?: number;
}

interface StatParams {
  period: string;
  start_date?: string;
  end_date?: string;
}

const SaleService = {
  /**
   * Create a new sale
   * @param {Sale} saleData  data including cart items, totals, and payment details
   * @returns {Promise<any>} - Response from API with sale and receipt data
   */
  createSale: async (saleData: Sale): Promise<any> => {
    try {
      const response = await axios.post(`${API_URL}/sales`, saleData, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error creating sale:", error);
      throw error;
    }
  },

  /**
   * Get all sales with optional filters
   * @param {SaleFilter} filters - Filters like date range, payment method, etc.
   * @returns {Promise<any>} - Response with sales data
   */
  getSales: async (filters: SaleFilter = {}): Promise<any> => {
    try {
      const response = await axios.get(`${API_URL}/sales`, {
        params: filters,
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching sales:", error);
      throw error;
    }
  },

  /**
   * Get a specific sale by ID
   * @param {number} id - Sale ID
   * @returns {Promise<Sale>} - Response with sale details
   */
  getSaleById: async (id: number): Promise<Sale> => {
    try {
      const response = await axios.get(`${API_URL}/sales/${id}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching sale ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update the status of a sale
   * @param {number} id - Sale ID
   * @param {string} status - New status (completed, cancelled, refunded)
   * @param {string} [notes] - Optional notes explaining the status change
   * @returns {Promise<any>} - Response with updated sale information
   */
  updateSaleStatus: async (
    id: number,
    status: string,
    notes: string = ""
  ): Promise<any> => {
    try {
      const response = await axios.patch(
        `${API_URL}/sales/${id}/status`,
        { status, notes },
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating sale status ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get sales statistics
   * @param {string} period - Period for statistics (today, this_week, this_month, etc.)
   * @param {string} [startDate] - Start date for custom period (YYYY-MM-DD)
   * @param {string} [endDate] - End date for custom period (YYYY-MM-DD)
   * @returns {Promise<any>} - Response with sales statistics
   */
  getSalesStats: async (
    period: string = "today",
    startDate: string | null = null,
    endDate: string | null = null
  ): Promise<any> => {
    try {
      const params: StatParams = { period };

      if (period === "custom" && startDate && endDate) {
        params.start_date = startDate;
        params.end_date = endDate;
      }

      const response = await axios.get(`${API_URL}/sales/stats`, {
        params,
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching sales statistics:", error);
      throw error;
    }
  },

  /**
   * Hold a sale for completion later
   * @param {Sale} saleData - The sale data to be held
   * @returns {Promise<any>} - Response with the held sale information
   */
  holdSale: async (saleData: Sale): Promise<any> => {
    try {
      const holdData = {
        ...saleData,
        status: "on_hold",
      };

      const response = await axios.post(`${API_URL}/sales/hold`, holdData, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error holding sale:", error);
      throw error;
    }
  },

  /**
   * Retrieve held sales
   * @returns {Promise<Sale[]>} - Response with list of held sales
   */
  getHeldSales: async (): Promise<Sale[]> => {
    try {
      const response = await axios.get(`${API_URL}/sales/held`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error retrieving held sales:", error);
      throw error;
    }
  },

  /**
   * Resume a previously held sale
   * @param {number} id - Held sale ID
   * @returns {Promise<Sale>} - Response with the held sale data to resume
   */
  resumeHeldSale: async (id: number): Promise<Sale> => {
    try {
      const response = await axios.get(`${API_URL}/sales/held/${id}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`Error resuming held sale ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a held sale
   * @param {number} id - Held sale ID
   * @returns {Promise<any>} - Response indicating success
   */
  deleteHeldSale: async (id: number): Promise<any> => {
    try {
      const response = await axios.delete(`${API_URL}/sales/held/${id}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting held sale ${id}:`, error);
      throw error;
    }
  },

  /**
   * Generate and retrieve receipt for a completed sale
   * @param {number} id - Sale ID
   * @param {string} format - Receipt format (html, pdf)
   * @returns {Promise<any>} - Response with receipt data
   */
  getReceipt: async (id: number, format: string = "html"): Promise<any> => {
    try {
      const response = await axios.get(`${API_URL}/sales/${id}/receipt`, {
        params: { format },
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`Error generating receipt for sale ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get daily sales summary for end-of-day reports
   * @param {string} [date] - Specific date (YYYY-MM-DD), defaults to today
   * @returns {Promise<any>} - Response with daily summary data
   */
  getDailySummary: async (date: string | null = null): Promise<any> => {
    try {
      const params = date ? { date } : {};
      const response = await axios.get(`${API_URL}/sales/daily-summary`, {
        params,
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error retrieving daily summary:", error);
      throw error;
    }
  },

  /**
   * Get inventory sales report
   * @param {Object} filters - Filters like date range and status
   * @returns {Promise<any>} - Response with aggregated inventory data
   */
  getInventoryReport: async (filters = {}): Promise<any> => {
    try {
      const response = await axios.get(`${API_URL}/inventory-report`, {
        params: filters,
        headers: getHeaders(),
      });

      // Transform the data if needed to match the frontend expected format
      const inventoryData = response.data || [];

      // Ensure data consistency and type handling
      return inventoryData.map((item: any) => ({
        id: parseInt(item.id) || 0,
        name: item.name || "Unknown Product",
        price: parseFloat(item.price || 0),
        quantity: parseInt(item.quantity || 0),
        revenue: parseFloat(item.revenue || 0),
      }));
    } catch (error) {
      console.error("Error fetching inventory report:", error);
      throw error;
    }
  },
};

export default SaleService;
