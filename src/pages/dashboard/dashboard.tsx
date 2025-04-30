import { FC, useState, useEffect } from "react";
import Header from "../../layouts/header";
import Sidemenu from "../../layouts/sidemenu";
import {
  FiArrowUp,
  FiArrowDown,
  FiShoppingBag,
  FiCalendar,
  FiAlertCircle,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SaleService from "../../services/SaleService";

interface ChartDataPoint {
  name: string;
  value: number;
  revenue: number;
}

interface TopProduct {
  product_name: string;
  count: number;
  revenue: number;
}

interface SaleStats {
  today: number;
  yesterday: number;
  total: number;
  trend: number;
}

interface RevenueStats {
  today: number;
  yesterday: number;
  total: number;
  trend: number;
}

interface CardConfig {
  title: string;
  icon: React.ReactNode;
  data: SaleStats | RevenueStats;
  format: (val: number) => string | number;
}

interface DateRange {
  start: string;
  end: string;
}

const ensureArray = (data: any): any[] => {
  if (Array.isArray(data)) {
    return data.filter((item) => item != null);
  }
  return [];
};

const transformToTopProducts = (inventoryData: any[]): TopProduct[] => {
  return inventoryData
    .map((item) => ({
      product_name: item.name || "Unknown Product",
      count: parseInt(item.quantity || 0),
      revenue: parseFloat(item.revenue || 0),
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
};

const transformToChartData = (data: any): ChartDataPoint[] => {
  if (!data || !data.daily_data) {
    if (data && data.hourly_breakdown) {
      return Object.entries(data.hourly_breakdown).map(
        ([hour, stats]: [string, any]) => ({
          name: stats.hour || `${hour}:00`,
          value: stats.sales_count || 0,
          revenue: stats.revenue || 0,
        })
      );
    }

    if (data && data.top_products && Array.isArray(data.top_products)) {
      return data.top_products.map((product: any) => ({
        name: product.product_name || "Unknown",
        value: product.count || 0,
        revenue: product.revenue || 0,
      }));
    }

    return [];
  }

  return Object.entries(data.daily_data || {}).map(
    ([date, stats]: [string, any]) => ({
      name: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: stats.count || 0,
      revenue: stats.revenue || 0,
    })
  );
};

const processStatsData = (
  data: any
): { sales: SaleStats; revenue: RevenueStats } => {
  const defaultStats = { today: 0, yesterday: 0, total: 0, trend: 0 };

  if (!data) return { sales: defaultStats, revenue: defaultStats };

  const sales: SaleStats = {
    today: data.today?.count || 0,
    yesterday: data.yesterday?.count || 0,
    total: data.total_sales || 0,
    trend:
      data.today && data.yesterday && data.yesterday.count
        ? ((data.today.count - data.yesterday.count) / data.yesterday.count) *
          100
        : 0,
  };

  const revenue: RevenueStats = {
    today: data.today?.revenue || 0,
    yesterday: data.yesterday?.revenue || 0,
    total: data.total_revenue || 0,
    trend:
      data.today && data.yesterday && data.yesterday.revenue
        ? ((data.today.revenue - data.yesterday.revenue) /
            data.yesterday.revenue) *
          100
        : 0,
  };

  return { sales, revenue };
};

const Dashboard: FC = () => {
  const [stats, setStats] = useState<{
    sales: SaleStats;
    revenue: RevenueStats;
    isLoading: boolean;
  }>({
    sales: { today: 0, yesterday: 0, total: 0, trend: 0 },
    revenue: { today: 0, yesterday: 0, total: 0, trend: 0 },
    isLoading: true,
  });

  const [weeklySalesData, setWeeklySalesData] = useState<ChartDataPoint[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    end: new Date().toISOString().slice(0, 10),
  });
  const [isChartLoading, setIsChartLoading] = useState<boolean>(true);
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(value || 0);
  };

  const getTrendIndicator = (trend: number): React.ReactNode => {
    if (trend > 0) {
      return (
        <span className="flex items-center text-green-500">
          <FiArrowUp className="mr-1" />
          {Math.abs(trend).toFixed(1)}%
        </span>
      );
    } else if (trend < 0) {
      return (
        <span className="flex items-center text-red-500">
          <FiArrowDown className="mr-1" />
          {Math.abs(trend).toFixed(1)}%
        </span>
      );
    }
    return <span className="text-gray-500">0%</span>;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyDateFilter = async () => {
    fetchDashboardData();
  };

  const formatDateForDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formattedDateRange = `${formatDateForDisplay(
    dateRange.start
  )} - ${formatDateForDisplay(dateRange.end)}`;

  const fetchDashboardData = async () => {
    setStats((prev) => ({ ...prev, isLoading: true }));
    setIsChartLoading(true);
    setIsProductsLoading(true);
    setError(null);

    try {
      const statsData = await SaleService.getSalesStats(
        "custom",
        dateRange.start,
        dateRange.end
      );

      const processedStats = processStatsData(statsData);

      setStats({
        sales: processedStats.sales,
        revenue: processedStats.revenue,
        isLoading: false,
      });

      const chartData = transformToChartData(statsData);
      setWeeklySalesData(chartData);
      setIsChartLoading(false);

      try {
        const inventoryData = await SaleService.getInventoryReport({
          date_from: dateRange.start,
          date_to: dateRange.end,
        });

        const productsData = transformToTopProducts(ensureArray(inventoryData));
        setTopProducts(productsData);
      } catch (prodErr: any) {
        console.error("Error fetching products data:", prodErr);
        setError(
          `Error fetching products data: ${prodErr.message || "Unknown error"}`
        );
        setTopProducts([]);
      } finally {
        setIsProductsLoading(false);
      }
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      setError(
        `Failed to load dashboard data: ${err.message || "Unknown error"}`
      );
      setStats((prev) => ({ ...prev, isLoading: false }));
      setIsChartLoading(false);
      setIsProductsLoading(false);
      setWeeklySalesData([]);
      setTopProducts([]);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const generateCardData = (): CardConfig[] => [
    {
      title: "Sales",
      icon: <FiShoppingBag className="w-6 h-6" />,
      data: stats.sales,
      format: (val: number): number => val,
    },
    {
      title: "Revenue",
      icon: <span className="text-2xl font-bold">₱</span>,
      data: stats.revenue,
      format: formatCurrency,
    },
  ];

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content bg-gray-50">
        <div className="container-fluid mx-auto px-4 py-6 max-w-7xl">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
              <FiAlertCircle className="mr-2" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
              <p className="text-sm text-gray-500">
                Welcome back! Here's what's happening with your salon today.
              </p>
            </div>

            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <input
                type="date"
                name="start"
                value={dateRange.start}
                onChange={handleDateChange}
                className="border rounded px-2 py-1 text-sm"
              />
              <span>to</span>
              <input
                type="date"
                name="end"
                value={dateRange.end}
                onChange={handleDateChange}
                className="border rounded px-2 py-1 text-sm"
              />
              <button
                className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                onClick={applyDateFilter}
              >
                Apply
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {generateCardData().map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="flex items-center px-4 py-3">
                  <div className="p-2 mr-3">{card.icon}</div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {card.title}
                  </h3>
                </div>

                <div className="p-4 pt-0">
                  {stats.isLoading ? (
                    <div className="animate-pulse h-10 bg-gray-200 rounded"></div>
                  ) : (
                    <>
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-2xl font-bold text-gray-800">
                          {card.format(card.data?.today || 0)}
                        </h4>
                        {getTrendIndicator(card.data?.trend || 0)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Compared to yesterday
                      </p>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Yesterday</span>
                          <span className="font-medium">
                            {card.format(card.data?.yesterday || 0)}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm w-full">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-semibold text-gray-800">Weekly Sales</h4>
              <div className="text-sm text-gray-500 flex items-center">
                <FiCalendar className="mr-2" />
                {formattedDateRange}
              </div>
            </div>
            <div className="h-64">
              {isChartLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : Array.isArray(weeklySalesData) &&
                weeklySalesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={weeklySalesData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "revenue") {
                          return [formatCurrency(value as number), "Revenue"];
                        }
                        return [value, "Sales Count"];
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Sales Count"
                      stroke="#6366F1"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No data available for the selected date range
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm w-full mt-6">
            <h4 className="font-semibold text-gray-800 mb-4">Top Products</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="py-2 px-4 border-b text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Count
                    </th>
                    <th className="py-2 px-4 border-b text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isProductsLoading ? (
                    Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <tr key={index}>
                          <td className="py-3 px-4 border-b">
                            <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                          </td>
                          <td className="py-3 px-4 border-b text-right">
                            <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                          </td>
                          <td className="py-3 px-4 border-b text-right">
                            <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                          </td>
                        </tr>
                      ))
                  ) : Array.isArray(topProducts) && topProducts.length > 0 ? (
                    topProducts.map((product, index) => (
                      <tr key={index}>
                        <td className="py-3 px-4 border-b">
                          {product?.product_name || "Unknown Product"}
                        </td>
                        <td className="py-3 px-4 border-b text-right">
                          {product?.count || 0}
                        </td>
                        <td className="py-3 px-4 border-b text-right">
                          {formatCurrency(product?.revenue || 0)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-4 text-center text-gray-500"
                      >
                        No products found for the selected date range
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
