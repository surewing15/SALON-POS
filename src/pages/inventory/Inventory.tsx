import React, { useState, useEffect } from "react";
import { Search, RefreshCw, Loader, Calendar, Download } from "lucide-react";
import Header from "../../layouts/header";
import Sidemenu from "../../layouts/sidemenu";
import SaleService from "../../services/SaleService";
import ProductService from "../../services/productService";

interface InventoryItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  revenue: number;
}

const InventorySales: React.FC = () => {
  const [totalProductCount, setTotalProductCount] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [inventorySales, setInventorySales] = useState<InventoryItem[]>([]);
  const [filteredSales, setFilteredSales] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });
  const [exporting, setExporting] = useState<boolean>(false);

  const displayDateRange = `${new Date(dateRange.from).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  )} - ${new Date(dateRange.to).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`;

  useEffect(() => {
    fetchInventorySales();
    fetchTotalProductCount();
  }, [dateRange.from, dateRange.to]);

  const fetchTotalProductCount = async (): Promise<void> => {
    try {
      const products = await ProductService.getProducts();
      setTotalProductCount(products.length);
    } catch (error) {
      console.error("Error fetching total product count:", error);
    }
  };

  const fetchInventorySales = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const filters = {
        date_from: dateRange.from,
        date_to: dateRange.to,
        status: "completed",
      };

      if (typeof SaleService.getInventoryReport !== "function") {
        throw new Error(
          "getInventoryReport method not available in SaleService"
        );
      }

      const inventoryData = await SaleService.getInventoryReport(filters);

      if (!Array.isArray(inventoryData)) {
        throw new Error("Invalid response format: expected an array");
      }

      setInventorySales(inventoryData);
      setFilteredSales(inventoryData);
    } catch (apiError) {
      console.error("API error:", apiError);
      setError(
        `Could not retrieve inventory data: ${
          apiError instanceof Error ? apiError.message : String(apiError)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = inventorySales.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSales(filtered);
  }, [searchTerm, inventorySales]);

  const formatCurrency = (v: number) => `₱${v.toFixed(2)}`;

  const handleDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "from" | "to"
  ) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const exportSalesToday = async () => {
    setExporting(true);

    try {
      const today = new Date().toISOString().split("T")[0];

      let todaySales = inventorySales;

      if (dateRange.from !== today || dateRange.to !== today) {
        alert(
          "Exporting today's sales data. Current filtered view will remain unchanged."
        );

        const filters = {
          date_from: today,
          date_to: today,
          status: "completed",
        };

        try {
          const todayData = await SaleService.getInventoryReport(filters);
          if (Array.isArray(todayData)) {
            todaySales = todayData;
          }
        } catch (fetchError) {
          console.error("Error fetching today's sales:", fetchError);
        }
      }

      let csvContent = "Product Name,Unit Price,Quantity Sold,Total Revenue\n";

      todaySales.forEach((item) => {
        csvContent += `"${item.name}",${item.price},${item.quantity},${item.revenue}\n`;
      });

      const totalQuantity = todaySales.reduce((sum, i) => sum + i.quantity, 0);
      const totalRevenue = todaySales.reduce((sum, i) => sum + i.revenue, 0);
      csvContent += `\nTOTAL,,${totalQuantity},${totalRevenue}\n`;
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const dateStr = new Date().toISOString().split("T")[0];
      link.setAttribute("href", url);
      link.setAttribute("download", `sales_report_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting sales:", error);
      alert("Failed to export sales. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-center items-center h-64">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchInventorySales}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Retry
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            All Inventory Sales
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-sm text-gray-600">From:</label>
              <input
                type="date"
                className="p-2 border border-gray-300 rounded-lg"
                value={dateRange.from}
                onChange={(e) => handleDateChange(e, "from")}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-sm text-gray-600">To:</label>
              <input
                type="date"
                className="p-2 border border-gray-300 rounded-lg"
                value={dateRange.to}
                onChange={(e) => handleDateChange(e, "to")}
              />
            </div>
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <button
              onClick={fetchInventorySales}
              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 flex items-center"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={exportSalesToday}
              disabled={exporting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              title="Export Today's Sales"
            >
              {exporting ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Export Today's Sales
            </button>
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-600 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Showing data for: {displayDateRange}</span>
        </div>

        {filteredSales.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {inventorySales.length === 0
              ? `No sales found for the selected date range.`
              : "No products match search."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Product Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Unit Price
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Quantity Sold
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Total Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-4 py-3 text-sm">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatCurrency(item.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm font-medium text-gray-500">
                Total Products
              </div>
              <div className="text-xl font-semibold mt-1">
                {totalProductCount}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm font-medium text-gray-500">
                Total Items Sold
              </div>
              <div className="text-xl font-semibold mt-1">
                {inventorySales.reduce((sum, i) => sum + i.quantity, 0)}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm font-medium text-gray-500">
                Total Revenue
              </div>
              <div className="text-xl font-semibold mt-1">
                {formatCurrency(
                  inventorySales.reduce((sum, i) => sum + i.revenue, 0)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidemenu />
        <main className="flex-1 p-6 ml-64">{renderContent()}</main>
      </div>
    </div>
  );
};

export default InventorySales;
