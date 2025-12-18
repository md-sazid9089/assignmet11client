import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { 
  CreditCard, 
  Calendar, 
  Hash, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Receipt,
  Filter,
  Users,
  TrendingUp,
  Package
} from "lucide-react";
import toast from "react-hot-toast";

const VendorTransactionHistory = () => {
  const [filter, setFilter] = useState('all');

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['vendor-transactions'],
    queryFn: async () => {
      console.log('📊 Vendor fetching transaction history...');
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        throw new Error('Vendor not authenticated');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/transactions/vendor/my-transactions`,
        { 
          headers: { 
            'x-user-id': userId
          } 
        }
      );
      
      console.log('✅ Vendor transactions fetched:', response.data.transactions?.length || 0);
      return response.data.transactions || [];
    },
    onError: (error) => {
      console.error('❌ Error fetching vendor transactions:', error);
      toast.error('Failed to load transaction history');
    }
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Receipt className="w-4 h-4" />;
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'bKash':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'Nagad':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Visa':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Mastercard':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.status?.toLowerCase() === filter;
  });

  // Calculate revenue stats
  const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const successfulTransactions = transactions.filter(t => t.status === 'Success');
  const thisMonthTransactions = transactions.filter(t => 
    new Date(t.date).getMonth() === new Date().getMonth()
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-[#b35a44]"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6" style={{ backgroundColor: '#020617' }}>
      <Helmet>
        <title>Transaction History - Vendor Dashboard</title>
      </Helmet>

      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            My Ticket <span className="text-[#b35a44]">Revenue</span>
          </h1>
          <p className="text-slate-400">
            Track all payments received for your ticket sales
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Total Revenue',
              value: `৳${totalRevenue.toLocaleString()}`,
              icon: <DollarSign className="w-6 h-6" />,
              color: 'from-[#b35a44] to-orange-400'
            },
            {
              title: 'Total Sales',
              value: transactions.length,
              icon: <Receipt className="w-6 h-6" />,
              color: 'from-blue-500 to-cyan-400'
            },
            {
              title: 'Successful',
              value: successfulTransactions.length,
              icon: <CheckCircle className="w-6 h-6" />,
              color: 'from-green-500 to-emerald-400'
            },
            {
              title: 'This Month',
              value: thisMonthTransactions.length,
              icon: <Calendar className="w-6 h-6" />,
              color: 'from-purple-500 to-pink-400'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity`}></div>
              <div className="relative bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl text-white`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { key: 'all', label: 'All Sales', icon: <Filter className="w-4 h-4" /> },
            { key: 'success', label: 'Success', icon: <CheckCircle className="w-4 h-4" /> },
            { key: 'failed', label: 'Failed', icon: <XCircle className="w-4 h-4" /> },
            { key: 'pending', label: 'Pending', icon: <Clock className="w-4 h-4" /> }
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${
                filter === filterOption.key
                  ? 'bg-[#b35a44] text-white border-[#b35a44]'
                  : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              {filterOption.icon}
              <span>{filterOption.label}</span>
            </button>
          ))}
        </div>

        {/* Transactions Table */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#b35a44]/10 via-purple-500/10 to-cyan-400/10 rounded-3xl blur"></div>
          <div className="relative bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Sales Found</h3>
                <p className="text-slate-400">
                  {filter === 'all' ? 'No ticket sales yet. Start promoting your tickets!' : `No ${filter} sales found.`}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left p-6 text-slate-300 font-semibold">Date</th>
                      <th className="text-left p-6 text-slate-300 font-semibold">Transaction ID</th>
                      <th className="text-left p-6 text-slate-300 font-semibold">Customer</th>
                      <th className="text-left p-6 text-slate-300 font-semibold">Ticket</th>
                      <th className="text-left p-6 text-slate-300 font-semibold">Revenue</th>
                      <th className="text-left p-6 text-slate-300 font-semibold">Method</th>
                      <th className="text-left p-6 text-slate-300 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction, index) => (
                      <motion.tr
                        key={transaction._id}
                        className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <td className="p-6">
                          <div className="flex items-center space-x-3">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <div>
                              <p className="text-white font-medium">
                                {new Date(transaction.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                              <p className="text-slate-400 text-sm">
                                {new Date(transaction.date).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center space-x-2">
                            <Hash className="w-4 h-4 text-slate-400" />
                            <span className="text-white font-mono text-sm bg-slate-800/50 px-2 py-1 rounded border border-slate-700">
                              {transaction.transactionId}
                            </span>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center space-x-3">
                            <Users className="w-4 h-4 text-slate-400" />
                            <div>
                              <p className="text-white font-medium">{transaction.userName}</p>
                              <p className="text-slate-400 text-sm">{transaction.userEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center space-x-2">
                            <Package className="w-4 h-4 text-slate-400" />
                            <p className="text-white font-medium">{transaction.ticketTitle}</p>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-[#b35a44]" />
                            <span className="text-white font-bold text-lg">
                              ৳{transaction.amount?.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-xl border text-sm font-medium ${getPaymentMethodColor(transaction.paymentMethod)}`}>
                            <CreditCard className="w-4 h-4" />
                            <span>{transaction.paymentMethod}</span>
                          </span>
                        </td>
                        <td className="p-6">
                          <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-xl border text-sm font-medium ${getStatusColor(transaction.status)}`}>
                            {getStatusIcon(transaction.status)}
                            <span>{transaction.status}</span>
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>

        {/* Revenue Summary */}
        {filteredTransactions.length > 0 && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Revenue Summary</h3>
                  <p className="text-slate-400 text-sm">
                    Total earnings from {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-[#b35a44] mb-1">
                    ৳{filteredTransactions.reduce((sum, t) => sum + (t.amount || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-slate-400 text-sm">
                    Avg: ৳{Math.round(filteredTransactions.reduce((sum, t) => sum + (t.amount || 0), 0) / filteredTransactions.length).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default VendorTransactionHistory;