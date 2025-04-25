import { useEffect, useState } from "react";
import Header from "../layouts/header";
import Sidemenu from "../layouts/sidemenu";
import {
  FiArrowUp,
  FiArrowDown,
  FiDollarSign,
  FiUsers,
  FiShoppingBag,
  FiCreditCard,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Define TypeScript interfaces for our data structures
interface StatData {
  today: number;
  yesterday: number;
  total: number;
  trend: number;
}

interface WeekStats {
  paid: number;
  partiallyPaid: number;
  unpaid: number;
  refunds: number;
  taxes: number;
  complete: number;
  partialOrders: number;
  unpaidTotal: number;
  refundTotal: number;
  discounts: number;
}

interface StatsState {
  sales: StatData;
  turnover: StatData;
  customers: StatData;
  receivables: StatData;
  weekStats: WeekStats;
}

interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

interface CardConfig {
  title: string;
  icon: JSX.Element;
  color: string;
  data: StatData;
  format: (val: number) => string | number;
}

function Dashboard() {
  const [stats, setStats] = useState<StatsState>({
    sales: { today: 135, yesterday: 165, total: 1082, trend: -18.2 },
    turnover: { today: 452.6, yesterday: 544.3, total: 3218.2, trend: -16.8 },
    customers: { today: 8, yesterday: 12, total: 156, trend: -33.3 },
    receivables: { today: 85.5, yesterday: 112.7, total: 643.4, trend: -24.1 },
    weekStats: {
      paid: 1245.8,
      partiallyPaid: 358.25,
      unpaid: 421.5,
      refunds: 86.75,
      taxes: 182.4,
      complete: 42,
      partialOrders: 15,
      unpaidTotal: 12,
      refundTotal: 3,
      discounts: 124.5,
    },
  });

  // Sample data for charts
  const salesData: ChartDataPoint[] = [
    { name: "Mon", value: 125 },
    { name: "Tue", value: 168 },
    { name: "Wed", value: 145 },
    { name: "Thu", value: 190 },
    { name: "Fri", value: 165 },
    { name: "Sat", value: 210 },
    { name: "Sun", value: 135 },
  ];

  const paymentStatusData: ChartDataPoint[] = [
    { name: "Paid", value: stats.weekStats.paid, color: "#10B981" },
    {
      name: "Partially Paid",
      value: stats.weekStats.partiallyPaid,
      color: "#6366F1",
    },
    { name: "Unpaid", value: stats.weekStats.unpaid, color: "#F59E0B" },
    { name: "Refunds", value: stats.weekStats.refunds, color: "#EF4444" },
  ];

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-BH", {
      style: "currency",
      currency: "BHD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Get trend indicator
  const getTrendIndicator = (trend: number): JSX.Element => {
    if (trend > 0) {
      return (
        <span className="flex items-center text-green-500">
          <FiArrowUp className="mr-1" />
          {Math.abs(trend)}%
        </span>
      );
    } else if (trend < 0) {
      return (
        <span className="flex items-center text-red-500">
          <FiArrowDown className="mr-1" />
          {Math.abs(trend)}%
        </span>
      );
    }
    return <span className="text-gray-500">0%</span>;
  };

  // Card config with icons
  const cardData: CardConfig[] = [
    {
      title: "Sales",
      icon: <FiShoppingBag className="w-6 h-6" />,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      data: stats.sales,
      format: (val: number): number => val,
    },
    {
      title: "Revenue",
      icon: <FiDollarSign className="w-6 h-6" />,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      data: stats.turnover,
      format: formatCurrency,
    },
    {
      title: "Customers",
      icon: <FiUsers className="w-6 h-6" />,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      data: stats.customers,
      format: (val: number): number => val,
    },
    {
      title: "Receivables",
      icon: <FiCreditCard className="w-6 h-6" />,
      color: "bg-gradient-to-r from-red-500 to-red-600",
      data: stats.receivables,
      format: formatCurrency,
    },
  ];

  useEffect(() => {
    // Replace this with real API call later
    // fetch('/api/dashboard-stats').then(res => res.json()).then(setStats);
  }, []);

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content bg-gray-50">
        <div className="container-fluid mx-auto px-4 py-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
              <p className="text-sm text-gray-500">
                Welcome back! Here's what's happening with your salon today.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Download Report
              </button>
            </div>
          </div>

          {/* Key Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cardData.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className={`${card.color} px-4 py-2 flex items-center`}>
                  <div className="bg-white/20 p-2 rounded-lg mr-3">
                    {card.icon}
                  </div>
                  <h3 className="font-semibold text-white">{card.title}</h3>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-2xl font-bold text-gray-800">
                      {card.format(card.data.today)}
                    </h4>
                    {getTrendIndicator(card.data.trend)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Compared to yesterday
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Yesterday</span>
                      <span className="font-medium">
                        {card.format(card.data.yesterday)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-2">
                      <span className="text-gray-500">Total</span>
                      <span className="font-medium">
                        {card.format(card.data.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sales Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-semibold text-gray-800">Weekly Sales</h4>
                <div className="text-sm text-gray-500">
                  May 10 - May 16, 2023
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#6366F1"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Payment Status Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-800">Payment Status</h4>
                <div className="text-sm text-gray-500">
                  May 10 - May 16, 2023
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label
                      >
                        {paymentStatusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color || "#000"}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="pt-4 md:pt-0">
                  {paymentStatusData.map((item, index) => (
                    <div key={index} className="flex items-center mb-3">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <div className="flex justify-between items-center w-full">
                        <span className="text-sm text-gray-600">
                          {item.name}
                        </span>
                        <span className="text-sm font-medium">
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-800">
                        Total
                      </span>
                      <span className="text-sm font-bold">
                        {formatCurrency(
                          paymentStatusData.reduce(
                            (acc, item) => acc + item.value,
                            0
                          )
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Week Stats and Additional Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Week Stats */}
            <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-semibold text-gray-800">Week Summary</h4>
                <div className="text-sm text-gray-500">
                  May 10 - May 16, 2023
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Paid Orders</p>
                    <p className="text-lg font-bold text-gray-800">
                      {formatCurrency(stats.weekStats.paid)}
                    </p>
                    <div className="h-1 bg-gray-100 rounded-full mt-1">
                      <div
                        className="h-1 bg-green-500 rounded-full"
                        style={{ width: "70%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Partially Paid</p>
                    <p className="text-lg font-bold text-gray-800">
                      {formatCurrency(stats.weekStats.partiallyPaid)}
                    </p>
                    <div className="h-1 bg-gray-100 rounded-full mt-1">
                      <div
                        className="h-1 bg-blue-500 rounded-full"
                        style={{ width: "40%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Unpaid Orders</p>
                    <p className="text-lg font-bold text-gray-800">
                      {formatCurrency(stats.weekStats.unpaid)}
                    </p>
                    <div className="h-1 bg-gray-100 rounded-full mt-1">
                      <div
                        className="h-1 bg-amber-500 rounded-full"
                        style={{ width: "30%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Refunds</p>
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(stats.weekStats.refunds)}
                    </p>
                    <div className="h-1 bg-gray-100 rounded-full mt-1">
                      <div
                        className="h-1 bg-red-500 rounded-full"
                        style={{ width: "10%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Taxes Collected</p>
                    <p className="text-lg font-bold text-gray-800">
                      {formatCurrency(stats.weekStats.taxes)}
                    </p>
                    <div className="h-1 bg-gray-100 rounded-full mt-1">
                      <div
                        className="h-1 bg-purple-500 rounded-full"
                        style={{ width: "20%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Discounts Applied</p>
                    <p className="text-lg font-bold text-gray-800">
                      {formatCurrency(stats.weekStats.discounts)}
                    </p>
                    <div className="h-1 bg-gray-100 rounded-full mt-1">
                      <div
                        className="h-1 bg-indigo-500 rounded-full"
                        style={{ width: "15%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Complete Orders</p>
                  <p className="text-xl font-bold text-gray-800">
                    {stats.weekStats.complete}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Partial Orders</p>
                  <p className="text-xl font-bold text-gray-800">
                    {stats.weekStats.partialOrders}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Total Refunds</p>
                  <p className="text-xl font-bold text-red-600">
                    {stats.weekStats.refundTotal}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">
                Quick Actions
              </h4>
              <div className="space-y-3">
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center justify-center text-sm font-medium transition-colors">
                  <FiShoppingBag className="mr-2" /> New Sale
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center text-sm font-medium transition-colors">
                  <FiUsers className="mr-2" /> Add Customer
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center text-sm font-medium transition-colors">
                  <FiDollarSign className="mr-2" /> Process Payment
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h5 className="font-medium text-gray-800 mb-3">
                  Recent Notifications
                </h5>
                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                    <p className="text-sm text-green-800">
                      Payment of BHD 45.00 received from customer #1204
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      10 minutes ago
                    </p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-500">
                    <p className="text-sm text-amber-800">
                      Appointment scheduled for tomorrow at 2:00 PM
                    </p>
                    <p className="text-xs text-amber-600 mt-1">
                      35 minutes ago
                    </p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-500">
                    <p className="text-sm text-red-800">
                      Inventory alert: 3 products below threshold
                    </p>
                    <p className="text-xs text-red-600 mt-1">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
