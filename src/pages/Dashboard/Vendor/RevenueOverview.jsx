import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaDollarSign, FaTicketAlt, FaChartLine } from "react-icons/fa";

const RevenueOverview = () => {
  const { data: revenueData, isLoading } = useQuery({
    queryKey: ["vendorRevenue"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/vendor/revenue`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const {
    totalRevenue = 0,
    totalTicketsSold = 0,
    totalTicketsAdded = 0,
  } = revenueData || {};

  // Sample data for charts
  const pieData = [
    { name: "Sold", value: totalTicketsSold },
    { name: "Available", value: totalTicketsAdded - totalTicketsSold },
  ];

  const COLORS = ["#3B82F6", "#8B5CF6"];

  const barData = [
    { month: "Jan", revenue: 0, tickets: 0 },
    { month: "Feb", revenue: 0, tickets: 0 },
    { month: "Mar", revenue: 0, tickets: 0 },
    { month: "Apr", revenue: 0, tickets: 0 },
    { month: "May", revenue: 0, tickets: 0 },
    { month: "Jun", revenue: totalRevenue, tickets: totalTicketsSold },
  ];

  const lineData = [
    { day: "Mon", revenue: totalRevenue * 0.1 },
    { day: "Tue", revenue: totalRevenue * 0.15 },
    { day: "Wed", revenue: totalRevenue * 0.2 },
    { day: "Thu", revenue: totalRevenue * 0.25 },
    { day: "Fri", revenue: totalRevenue * 0.15 },
    { day: "Sat", revenue: totalRevenue * 0.1 },
    { day: "Sun", revenue: totalRevenue * 0.05 },
  ];

  return (
    <div>
      <Helmet>
        <title>Revenue Overview - TicketBari</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Revenue Overview
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold opacity-90">Total Revenue</h3>
            <FaDollarSign className="text-4xl opacity-80" />
          </div>
          <p className="text-4xl font-bold">৳{totalRevenue.toLocaleString()}</p>
          <p className="text-sm opacity-80 mt-2">All time earnings</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold opacity-90">Tickets Sold</h3>
            <FaTicketAlt className="text-4xl opacity-80" />
          </div>
          <p className="text-4xl font-bold">{totalTicketsSold}</p>
          <p className="text-sm opacity-80 mt-2">Total tickets sold</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold opacity-90">Tickets Added</h3>
            <FaChartLine className="text-4xl opacity-80" />
          </div>
          <p className="text-4xl font-bold">{totalTicketsAdded}</p>
          <p className="text-sm opacity-80 mt-2">Total listings</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
            Ticket Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
            Monthly Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#3B82F6" name="Revenue (৳)" />
              <Bar dataKey="tickets" fill="#8B5CF6" name="Tickets Sold" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
          Weekly Revenue Trend
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              strokeWidth={3}
              name="Revenue (৳)"
              dot={{ fill: "#3B82F6", r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Additional Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Average Ticket Price
          </p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            ৳
            {totalTicketsSold > 0
              ? (totalRevenue / totalTicketsSold).toFixed(2)
              : 0}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Sales Rate
          </p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {totalTicketsAdded > 0
              ? ((totalTicketsSold / totalTicketsAdded) * 100).toFixed(1)
              : 0}
            %
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Available Tickets
          </p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {totalTicketsAdded - totalTicketsSold}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Commission (10%)
          </p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            ৳{(totalRevenue * 0.1).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueOverview;
