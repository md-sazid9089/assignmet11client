import { useEffect, useState } from 'react';
import {
  MdConfirmationNumber,
  MdCheckCircle,
  MdPeople,
  MdStorefront,
} from 'react-icons/md';
import api from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTickets: 0,
    approvedTickets: 0,
    totalUsers: 0,
    totalVendors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ticketsRes, usersRes] = await Promise.all([
          api.get('/tickets'),
          api.get('/users'),
        ]);

        const tickets = ticketsRes.data.tickets || [];
        const users = usersRes.data.users || [];

        setStats({
          totalTickets: tickets.length,
          approvedTickets: tickets.filter((t) => t.status === 'approved').length,
          totalUsers: users.filter((u) => u.role === 'user').length,
          totalVendors: users.filter((u) => u.role === 'vendor').length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Tickets',
      value: stats.totalTickets,
      icon: MdConfirmationNumber,
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Approved Tickets',
      value: stats.approvedTickets,
      icon: MdCheckCircle,
      gradient: 'from-green-500 to-green-600',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: MdPeople,
      gradient: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Total Vendors',
      value: stats.totalVendors,
      icon: MdStorefront,
      gradient: 'from-pink-500 to-pink-600',
      bgLight: 'bg-pink-50',
      textColor: 'text-pink-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your admin control panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                  <p className={`text-4xl font-bold mt-2 ${card.textColor}`}>
                    {card.value}
                  </p>
                </div>
                <div
                  className={`${card.bgLight} w-16 h-16 rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`text-3xl ${card.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary py-3">View All Tickets</button>
          <button className="btn-secondary py-3">Manage Users</button>
          <button className="btn-outline py-3">Create Advertisement</button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <p className="text-gray-600">No recent activity to display.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
