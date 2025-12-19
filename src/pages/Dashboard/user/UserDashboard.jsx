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
  User,
  History
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router';

const UserDashboard = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['user-dashboard'],
    queryFn: async () => {
      // // console.log('📊 User fetching dashboard data...');
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Fetch user's bookings and transactions
      const [bookingsResponse, transactionsResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/bookings/user`, {
          headers: { 'x-user-id': userId }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/transactions/my-transactions`, {
          headers: { 'x-user-id': userId }
        })
      ]);

      const bookings = bookingsResponse.data.bookings || [];
      const transactions = transactionsResponse.data.transactions || [];

      // Calculate statistics
      const totalBookings = bookings.length;
      const paidBookings = bookings.filter(b => b.status === 'paid');
      const pendingBookings = bookings.filter(b => b.status === 'pending');
      const acceptedBookings = bookings.filter(b => b.status === 'accepted');
      
      const totalSpent = transactions
        .filter(t => t.status === 'Success')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      
      const thisMonthBookings = bookings.filter(b => 
        new Date(b.createdAt).getMonth() === new Date().getMonth()
      );

      const thisMonthSpent = transactions
        .filter(t => t.status === 'Success' && new Date(t.date).getMonth() === new Date().getMonth())
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      // // console.log('✅ User dashboard data calculated');

      return {
        bookings,
        transactions,
        stats: {
          totalBookings,
          totalSpent,
          paidBookings: paidBookings.length,
          pendingBookings: pendingBookings.length,
          acceptedBookings: acceptedBookings.length,
          thisMonthBookings: thisMonthBookings.length,
          thisMonthSpent,
          avgBookingValue: paidBookings.length > 0 ? totalSpent / paidBookings.length : 0
        }
      };
    },
    onError: (error) => {
      console.error('❌ Error fetching user dashboard:', error);
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
        <title>My Dashboard - Uraan</title>
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
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">
            Here's your booking activity and travel summary
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Bookings */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Ticket className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {stats.totalBookings || 0}
            </h3>
            <p className="text-gray-600 text-sm">Total Bookings</p>
            <p className="text-blue-600 text-xs mt-1">
              {stats.paidBookings} completed
            </p>
          </motion.div>

          {/* Total Spent */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              ৳{stats.totalSpent?.toLocaleString() || 0}
            </h3>
            <p className="text-gray-600 text-sm">Total Spent</p>
            <p className="text-green-600 text-xs mt-1">
              ৳{Math.round(stats.avgBookingValue || 0).toLocaleString()} avg per booking
            </p>
          </motion.div>

          {/* Pending Bookings */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {stats.pendingBookings || 0}
            </h3>
            <p className="text-gray-600 text-sm">Pending Bookings</p>
            <p className="text-orange-600 text-xs mt-1">
              Awaiting vendor approval
            </p>
          </motion.div>

          {/* This Month */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {stats.thisMonthBookings || 0}
            </h3>
            <p className="text-gray-600 text-sm">This Month</p>
            <p className="text-purple-600 text-xs mt-1">
              ৳{stats.thisMonthSpent?.toLocaleString() || 0} spent
            </p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/all-ticket"
              className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-100"
            >
              <Package className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-700">Browse Tickets</span>
            </Link>
            <Link
              to="/dashboard/user/bookings"
              className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors border border-green-100"
            >
              <Ticket className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-700">My Bookings</span>
            </Link>
            <Link
              to="/dashboard/user/transactions"
              className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors border border-purple-100"
            >
              <History className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-700">Transaction History</span>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Recent Bookings</h3>
              <Link
                to="/dashboard/user/bookings"
                className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
              >
                View All →
              </Link>
            </div>
            
            {recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No bookings yet</p>
                <Link
                  to="/all-ticket"
                  className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Your First Ticket
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking, index) => (
                  <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-800">{booking.ticketTitle}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
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

          {/* Recent Transactions */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Recent Transactions</h3>
              <Link
                to="/dashboard/user/transactions"
                className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
              >
                View All →
              </Link>
            </div>
            
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-800">{transaction.ticketTitle}</p>
                      <p className="text-sm text-gray-600">{transaction.transactionId}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">৳{transaction.amount?.toLocaleString()}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        transaction.status === 'Success' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status}
                      </span>
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

export default UserDashboard;
