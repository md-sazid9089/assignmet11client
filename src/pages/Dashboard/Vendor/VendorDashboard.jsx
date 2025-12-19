import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  CreditCard, 
  Calendar, 
  Ticket, 
  DollarSign,
  CheckCircle,
  Clock,
  Receipt,
  TrendingUp,
  Package,
  Users,
  Plus,
  Eye,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router';

const VendorDashboard = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['vendor-dashboard'],
    queryFn: async () => {
      // // console.log('📊 Vendor fetching dashboard data...');
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        throw new Error('Vendor not authenticated');
      }

      // Fetch vendor's data
      const [ticketsResponse, bookingsResponse, transactionsResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/tickets/vendor/my-tickets`, {
          headers: { 'x-user-id': userId }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/bookings/vendor`, {
          headers: { 'x-user-id': userId }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/transactions/vendor/my-transactions`, {
          headers: { 'x-user-id': userId }
        })
      ]);

      const tickets = ticketsResponse.data.tickets || [];
      const bookings = bookingsResponse.data.bookings || [];
      const transactions = transactionsResponse.data.transactions || [];

      // Calculate statistics
      const totalTickets = tickets.length;
      const approvedTickets = tickets.filter(t => t.verificationStatus === 'approved');
      const pendingTickets = tickets.filter(t => t.verificationStatus === 'pending');
      
      const totalBookings = bookings.length;
      const pendingBookings = bookings.filter(b => b.status === 'Pending');
      const acceptedBookings = bookings.filter(b => b.status === 'Approved');
      const paidBookings = bookings.filter(b => b.status === 'Paid');
      
      const successfulTransactions = transactions.filter(t => t.status === 'Success');
      const totalRevenue = successfulTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
      
      const thisMonthRevenue = transactions
        .filter(t => t.status === 'Success' && new Date(t.date).getMonth() === new Date().getMonth())
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const thisMonthBookings = bookings.filter(b => 
        new Date(b.createdAt).getMonth() === new Date().getMonth()
      );

      // // console.log('✅ Vendor dashboard data calculated');

      return {
        tickets,
        bookings,
        transactions,
        stats: {
          totalTickets,
          approvedTickets: approvedTickets.length,
          pendingTickets: pendingTickets.length,
          totalBookings,
          pendingBookings: pendingBookings.length,
          acceptedBookings: acceptedBookings.length,
          paidBookings: paidBookings.length,
          totalRevenue,
          thisMonthRevenue,
          thisMonthBookings: thisMonthBookings.length,
          avgRevenuePerBooking: paidBookings.length > 0 ? totalRevenue / paidBookings.length : 0,
          conversionRate: totalBookings > 0 ? (paidBookings.length / totalBookings) * 100 : 0
        }
      };
    },
    onError: (error) => {
      console.error('❌ Error fetching vendor dashboard:', error);
      toast.error('Failed to load dashboard data');
    }
  });

  const stats = dashboardData?.stats || {};
  const recentBookings = dashboardData?.bookings?.slice(0, 5) || [];
  const recentTransactions = dashboardData?.transactions?.slice(0, 5) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-[#b35a44]"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <Helmet>
        <title>Vendor Dashboard - Uraan</title>
      </Helmet>

      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Vendor Dashboard 🚌
          </h1>
          <p className="text-gray-600">
            Track your tickets, bookings, and revenue performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              ৳{stats.totalRevenue?.toLocaleString() || 0}
            </h3>
            <p className="text-gray-600 text-sm">Total Revenue</p>
            <p className="text-green-600 text-xs mt-1">
              ৳{stats.thisMonthRevenue?.toLocaleString() || 0} this month
            </p>
          </motion.div>

          {/* Total Tickets */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Ticket className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {stats.approvedTickets} Live
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {stats.totalTickets || 0}
            </h3>
            <p className="text-gray-600 text-sm">My Tickets</p>
            <p className="text-orange-600 text-xs mt-1">
              {stats.pendingTickets} pending approval
            </p>
          </motion.div>

          {/* Total Bookings */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                {stats.pendingBookings} New
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {stats.totalBookings || 0}
            </h3>
            <p className="text-gray-600 text-sm">Total Bookings</p>
            <p className="text-purple-600 text-xs mt-1">
              {stats.paidBookings} completed
            </p>
          </motion.div>

          {/* Conversion Rate */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-indigo-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {stats.conversionRate?.toFixed(1) || 0}%
            </h3>
            <p className="text-gray-600 text-sm">Conversion Rate</p>
            <p className="text-indigo-600 text-xs mt-1">
              ৳{Math.round(stats.avgRevenuePerBooking || 0).toLocaleString()} avg per booking
            </p>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6">Performance Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="p-4 bg-green-50 rounded-xl mb-3">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
              </div>
              <h4 className="text-2xl font-bold text-gray-800">{stats.paidBookings || 0}</h4>
              <p className="text-sm text-gray-600">Successful Sales</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-orange-50 rounded-xl mb-3">
                <Clock className="w-8 h-8 text-orange-600 mx-auto" />
              </div>
              <h4 className="text-2xl font-bold text-gray-800">{stats.pendingBookings || 0}</h4>
              <p className="text-sm text-gray-600">Pending Requests</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-blue-50 rounded-xl mb-3">
                <Ticket className="w-8 h-8 text-blue-600 mx-auto" />
              </div>
              <h4 className="text-2xl font-bold text-gray-800">{stats.approvedTickets || 0}</h4>
              <p className="text-sm text-gray-600">Active Tickets</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-purple-50 rounded-xl mb-3">
                <Calendar className="w-8 h-8 text-purple-600 mx-auto" />
              </div>
              <h4 className="text-2xl font-bold text-gray-800">{stats.thisMonthBookings || 0}</h4>
              <p className="text-sm text-gray-600">This Month</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              to="/dashboard/vendor/add-ticket"
              className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-100"
            >
              <Plus className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-700">Add New Ticket</span>
            </Link>
            <Link
              to="/dashboard/vendor/bookings"
              className="flex items-center space-x-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors border border-orange-100"
            >
              <Eye className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-700">View Bookings</span>
            </Link>
            <Link
              to="/dashboard/vendor/my-tickets"
              className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors border border-green-100"
            >
              <Package className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-700">Manage Tickets</span>
            </Link>
            <Link
              to="/dashboard/vendor/transactions"
              className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors border border-purple-100"
            >
              <Receipt className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-700">Revenue Report</span>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Recent Bookings</h3>
              <Link
                to="/dashboard/vendor/bookings"
                className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
              >
                View All →
              </Link>
            </div>
            
            {recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No bookings yet</p>
                <Link
                  to="/dashboard/vendor/add-ticket"
                  className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Your First Ticket
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-800">{booking.userName}</p>
                      <p className="text-sm text-gray-600">{booking.ticketTitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">৳{booking.totalPrice?.toLocaleString()}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'paid' ? 'bg-green-100 text-green-800' :
                        booking.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Revenue */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Recent Revenue</h3>
              <Link
                to="/dashboard/vendor/transactions"
                className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
              >
                View All →
              </Link>
            </div>
            
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No revenue yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-800">{transaction.userName}</p>
                      <p className="text-sm text-gray-600">{transaction.ticketTitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">+৳{transaction.amount?.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default VendorDashboard;
