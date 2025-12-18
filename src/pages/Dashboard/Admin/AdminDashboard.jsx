import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuth from '../../../hooks/useAuth';
import {
  Users,
  Ticket,
  DollarSign,
  TrendingUp,
  Calendar,
  Edit,
  Trash2,
  Plus,
  X,
  Search,
  Filter,
  Download,
  RefreshCw,
} from 'lucide-react';

const AdminDashboard = () => {
  // Get user from auth context
  const { user } = useAuth();
  // Stats State
  const [stats, setStats] = useState({
    totalTickets: 0,
    totalRevenue: 0,
    activeUsers: 0,
    totalBookings: 0,
  });

  // Data State
  const [bookings, setBookings] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'tickets'

  // Form State for Create/Edit
  const [formData, setFormData] = useState({
    ticketTitle: '',
    price: '',
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    availableSeats: '',
    ticketType: 'bus',
  });

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch all data on component mount and set up auto-refresh
  useEffect(() => {
    fetchAllData();
    
    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      console.log('🔄 Auto-refreshing admin dashboard...');
      fetchAllData();
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      let userId = localStorage.getItem('userId');
      
      // If userId is missing, try to fetch it from backend
      if (!userId) {
        console.warn('⚠️ No userId found, attempting to fetch from backend...');
        try {
          const response = await axios.post(`${API_URL}/users/create`, {
            name: user?.displayName || 'Admin User',
            email: user?.email,
            photoURL: user?.photoURL,
            firebaseUid: user?.uid,
          });
          
          if (response.data.success && response.data.user._id) {
            userId = response.data.user._id;
            localStorage.setItem('userId', userId);
            console.log('✅ UserId fetched and stored:', userId);
            toast.success('Session restored!');
          } else {
            throw new Error('Failed to get userId from backend');
          }
        } catch (fetchError) {
          console.error('❌ Failed to fetch userId:', fetchError);
          toast.error('Please log out and log in again');
          return;
        }
      }
      
      console.log('🔄 Fetching all admin dashboard data...');
      await Promise.all([
        fetchStats(),
        fetchBookings(),
        fetchTickets(),
      ]);
      console.log('✅ All admin data fetched successfully');
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Stats
  const fetchStats = async () => {
    try {
      const userId = localStorage.getItem('userId');
      
      const [ticketsRes, bookingsRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/tickets/admin/all`, {
          headers: { 'x-user-id': userId }
        }),
        axios.get(`${API_URL}/bookings`, {
          headers: { 'x-user-id': userId }
        }),
        axios.get(`${API_URL}/users/all`, {
          headers: { 'x-user-id': userId }
        }),
      ]);

      console.log('📊 Admin Stats Data:');
      console.log('Tickets:', ticketsRes.data.tickets?.length || 0);
      console.log('Bookings:', bookingsRes.data.data?.length || 0);
      console.log('Users:', usersRes.data.users?.length || 0);

      const allUsers = usersRes.data.users || [];
      const vendors = allUsers.filter(user => user.role === 'vendor');
      
      console.log('Vendors:', vendors.length);
      
      const totalRevenue = bookingsRes.data.data?.reduce((sum, booking) => 
        sum + (booking.totalAmount || 0), 0
      ) || 0;

      setStats({
        totalTickets: ticketsRes.data.tickets?.length || 0,
        totalRevenue: totalRevenue,
        activeUsers: vendors.length,
        totalBookings: bookingsRes.data.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Fetch Bookings
  const fetchBookings = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`${API_URL}/bookings`, {
        headers: { 'x-user-id': userId }
      });
      const fetchedBookings = response.data.data || [];
      console.log('📋 Admin Dashboard - Bookings fetched:', fetchedBookings.length);
      setBookings(fetchedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Fetch Tickets
  const fetchTickets = async () => {
    try {
      const userId = localStorage.getItem('userId');
      console.log('🎫 Fetching admin tickets with userId:', userId);
      
      const response = await axios.get(`${API_URL}/tickets/admin/all`, {
        headers: { 'x-user-id': userId }
      });
      
      console.log('📦 Raw Admin Tickets Response:', response.data);
      console.log('✅ Success:', response.data.success);
      console.log('🎫 Tickets Array:', response.data.tickets);
      
      const fetchedTickets = response.data.tickets || [];
      console.log('🎫 Admin Dashboard - Tickets fetched:', fetchedTickets.length);
      
      if (fetchedTickets.length > 0) {
        console.log('📝 Sample ticket:', {
          id: fetchedTickets[0]._id,
          title: fetchedTickets[0].title,
          from: fetchedTickets[0].from,
          to: fetchedTickets[0].to,
          vendor: fetchedTickets[0].vendorEmail,
          status: fetchedTickets[0].verificationStatus
        });
      } else {
        console.warn('⚠️ No tickets returned from backend!');
      }
      
      setTickets(fetchedTickets);
      console.log('✅ Tickets state updated, count:', fetchedTickets.length);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  // Create New Ticket
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.post(
        `${API_URL}/tickets`,
        formData,
        {
          headers: { 'x-user-id': userId }
        }
      );

      if (response.data.success) {
        toast.success('Ticket created successfully!');
        setIsCreateModalOpen(false);
        resetForm();
        await fetchAllData(); // Refresh data
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error(error.response?.data?.message || 'Failed to create ticket');
    }
  };

  // Update Ticket
  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.put(
        `${API_URL}/tickets/${selectedItem._id}`,
        formData,
        {
          headers: { 'x-user-id': userId }
        }
      );

      if (response.data.success) {
        toast.success('Ticket updated successfully!');
        setIsEditModalOpen(false);
        setSelectedItem(null);
        resetForm();
        await fetchAllData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error(error.response?.data?.message || 'Failed to update ticket');
    }
  };

  // Delete Ticket/Booking
  const handleDelete = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const endpoint = activeTab === 'bookings' 
        ? `${API_URL}/bookings/${selectedItem._id}`
        : `${API_URL}/tickets/${selectedItem._id}`;

      const response = await axios.delete(endpoint, {
        headers: { 'x-user-id': userId }
      });

      if (response.data.success) {
        toast.success(`${activeTab === 'bookings' ? 'Booking' : 'Ticket'} deleted successfully!`);
        setIsDeleteModalOpen(false);
        setSelectedItem(null);
        await fetchAllData(); // Refresh data
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error(error.response?.data?.message || 'Failed to delete');
    }
  };

  // Open Edit Modal
  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      ticketTitle: item.title || '',
      price: item.pricePerUnit || '',
      origin: item.from || '',
      destination: item.to || '',
      departureTime: item.departureTime || '',
      arrivalTime: item.arrivalTime || '',
      availableSeats: item.quantity || '',
      ticketType: item.transportType || 'bus',
    });
    setIsEditModalOpen(true);
  };

  // Open Delete Modal
  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      ticketTitle: '',
      price: '',
      origin: '',
      destination: '',
      departureTime: '',
      arrivalTime: '',
      availableSeats: '',
      ticketType: 'bus',
    });
  };

  // Filter data based on search
  const filteredBookings = bookings.filter(booking =>
    booking.ticketTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTickets = tickets.filter(ticket =>
    ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.to?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#b35a44]"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Uraan</title>
      </Helmet>

      <div className="min-h-screen bg-[#0f172a] p-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-slate-300">
                Manage your ticket booking platform
              </p>
            </div>
            <button
              onClick={() => {
                console.log('🔄 Manual refresh triggered');
                fetchAllData();
                toast.success('Dashboard refreshed!');
              }}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Tickets */}
          <div className="bg-[#1e293b] rounded-2xl p-6 border border-slate-700 hover:shadow-2xl hover:shadow-[#b35a44]/20 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#b35a44]/20 rounded-xl group-hover:scale-110 transition-transform">
                <Ticket className="w-6 h-6 text-[#d97757]" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {loading ? (
                <span className="inline-block animate-pulse">--</span>
              ) : (
                stats.totalTickets
              )}
            </h3>
            <p className="text-slate-400 text-sm">Total Tickets</p>
          </div>

          {/* Total Revenue */}
          <div className="bg-[#1e293b] rounded-2xl p-6 border border-slate-700 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {loading ? (
                <span className="inline-block animate-pulse">--</span>
              ) : (
                `৳${stats.totalRevenue.toLocaleString()}`
              )}
            </h3>
            <p className="text-slate-400 text-sm">Total Revenue</p>
          </div>

          {/* Active Users */}
          <div className="bg-[#1e293b] rounded-2xl p-6 border border-slate-700 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {loading ? (
                <span className="inline-block animate-pulse">--</span>
              ) : (
                stats.activeUsers
              )}
            </h3>
            <p className="text-slate-400 text-sm">Active Users</p>
          </div>

          {/* Total Bookings */}
          <div className="bg-[#1e293b] rounded-2xl p-6 border border-slate-700 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {loading ? (
                <span className="inline-block animate-pulse">--</span>
              ) : (
                stats.totalBookings
              )}
            </h3>
            <p className="text-slate-400 text-sm">Total Bookings</p>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-[#1e293b] rounded-2xl border border-slate-700 overflow-hidden">
          {/* Table Header */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === 'bookings'
                      ? 'bg-[#b35a44] text-white shadow-lg shadow-[#b35a44]/30'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Bookings ({bookings.length})
                </button>
                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === 'tickets'
                      ? 'bg-[#b35a44] text-white shadow-lg shadow-[#b35a44]/30'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Tickets ({tickets.length})
                </button>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                {/* Search */}
                <div className="relative flex-1 md:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-64 pl-10 pr-4 py-2 bg-slate-700 border-0 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-[#b35a44] outline-none"
                  />
                </div>

                {/* Create Button */}
                {activeTab === 'tickets' && (
                  <button
                    onClick={() => {
                      resetForm();
                      setIsCreateModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#b35a44] hover:bg-[#d97757] text-white rounded-lg font-semibold transition-all shadow-lg shadow-[#b35a44]/30"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Create</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  {activeTab === 'bookings' ? (
                    <>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Booking ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">User</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Ticket</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Actions</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Ticket</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Route</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Seats</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {loading ? (
                  // Loading skeleton
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-slate-700 rounded w-1/4"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-slate-700 rounded-full w-16"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <div className="h-8 w-8 bg-slate-700 rounded-lg"></div>
                          <div className="h-8 w-8 bg-slate-700 rounded-lg"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : activeTab === 'bookings' ? (
                  filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-slate-800 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {booking._id?.slice(-8)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {booking.userName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {booking.ticketTitle || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-white">
                          ৳{booking.totalAmount?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                            booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {booking.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => openDeleteModal(booking)}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                        No bookings found
                      </td>
                    </tr>
                  )
                ) : (
                  filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                      <tr key={ticket._id} className="hover:bg-slate-800 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-white">
                          {ticket.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {ticket.from} → {ticket.to}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-white">
                          ৳{ticket.pricePerUnit?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {ticket.quantity}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-[#b35a44]/20 text-[#d97757] rounded-full text-xs font-semibold">
                            {ticket.transportType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(ticket)}
                              className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-blue-400" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(ticket)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                        No tickets found
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Modal */}
        {(isCreateModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1e293b] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
              <div className="p-6 border-b border-slate-700 flex justify-between items-center sticky top-0 bg-[#1e293b]">
                <h2 className="text-2xl font-bold text-white">
                  {isCreateModalOpen ? 'Create New Ticket' : 'Edit Ticket'}
                </h2>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-slate-300" />
                </button>
              </div>

              <form onSubmit={isCreateModalOpen ? handleCreateTicket : handleUpdateTicket} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Ticket Title *
                    </label>
                    <input
                      type="text"
                      value={formData.ticketTitle}
                      onChange={(e) => setFormData({ ...formData, ticketTitle: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-[#b35a44] focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Price (৳) *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-[#b35a44] focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Origin *
                    </label>
                    <input
                      type="text"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-[#b35a44] focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Destination *
                    </label>
                    <input
                      type="text"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-[#b35a44] focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Departure Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.departureTime}
                      onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-[#b35a44] focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Arrival Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.arrivalTime}
                      onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-[#b35a44] focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Available Seats *
                    </label>
                    <input
                      type="number"
                      value={formData.availableSeats}
                      onChange={(e) => setFormData({ ...formData, availableSeats: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-[#b35a44] focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Ticket Type *
                    </label>
                    <select
                      value={formData.ticketType}
                      onChange={(e) => setFormData({ ...formData, ticketType: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-[#b35a44] focus:border-transparent outline-none"
                      required
                    >
                      <option value="bus">Bus</option>
                      <option value="train">Train</option>
                      <option value="flight">Flight</option>
                      <option value="launch">Launch</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-[#b35a44] hover:bg-[#d97757] text-white rounded-lg font-semibold transition-all shadow-lg shadow-[#b35a44]/30"
                  >
                    {isCreateModalOpen ? 'Create Ticket' : 'Update Ticket'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setIsEditModalOpen(false);
                      resetForm();
                    }}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1e293b] rounded-2xl max-w-md w-full p-6 border border-slate-700 shadow-2xl">
              <div className="flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                Confirm Delete
              </h2>
              <p className="text-slate-300 text-center mb-6">
                Are you sure you want to delete this {activeTab === 'bookings' ? 'booking' : 'ticket'}? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-red-500/30"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedItem(null);
                  }}
                  className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
