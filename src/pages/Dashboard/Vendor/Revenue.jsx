import { useState, useEffect } from 'react';
import api from '../../../config/api';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Revenue = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      const response = await api.get('/payments/vendor/revenue');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching revenue:', error);
      toast.error('Failed to load revenue data');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#FF9CE3', '#9B6BFF', '#A7F3D0', '#C7D2FE'];

  const chartData = stats
    ? [
        { name: 'Revenue', value: stats.totalRevenue },
        { name: 'Tickets Sold', value: stats.totalTicketsSold },
        { name: 'Tickets Added', value: stats.totalTicketsAdded },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-400"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold gradient-text mb-6">Revenue Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center bg-gradient-primary text-white">
          <p className="text-lg opacity-90 mb-2">Total Revenue</p>
          <p className="text-4xl font-bold">${stats?.totalRevenue || 0}</p>
        </div>

        <div className="card text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            Total Tickets Sold
          </p>
          <p className="text-4xl font-bold text-primary-500">
            {stats?.totalTicketsSold || 0}
          </p>
        </div>

        <div className="card text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            Total Tickets Added
          </p>
          <p className="text-4xl font-bold text-secondary-500">
            {stats?.totalTicketsAdded || 0}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-bold mb-4 gradient-text">Statistics Bar Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#FF9CE3" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-xl font-bold mb-4 gradient-text">Distribution Pie Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
