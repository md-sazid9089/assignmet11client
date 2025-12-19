import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCheckCircle, FaTimesCircle, FaClock, FaUser, FaTicketAlt, FaFilter, FaSort } from "react-icons/fa";
import { useAuth } from "../../../hooks/useAuth";
import { useState } from "react";

const RequestedBookings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["vendorBookings"],
    queryFn: async () => {
      const userId = user?.uid;
      if (!userId) throw new Error("User not authenticated");
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings/vendor`,
        { headers: { 'x-user-id': userId } }
      );
      return response.data.bookings || [];
    },
    enabled: !!user?.uid,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ bookingId, status }) => {
      const userId = user?.uid;
      if (!userId) throw new Error("User not authenticated");
      
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/bookings/vendor/status`,
        { bookingId, status },
        { headers: { 'x-user-id': userId } }
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(
        `Booking ${
          variables.status === "accepted" ? "accepted" : "rejected"
        } successfully!`
      );
      queryClient.invalidateQueries(["vendorBookings"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update booking");
    },
  });

  const handleAccept = (bookingId) => {
    updateStatusMutation.mutate({ bookingId, status: "accepted" });
  };

  const handleReject = (bookingId) => {
    updateStatusMutation.mutate({ bookingId, status: "rejected" });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter(booking => statusFilter === "all" || booking.status === statusFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "price-high":
          return b.totalPrice - a.totalPrice;
        case "price-low":
          return a.totalPrice - b.totalPrice;
        default:
          return 0;
      }
    });

  // Calculate summary stats
  const pendingCount = bookings.filter(b => b.status === "pending").length;
  const acceptedCount = bookings.filter(b => b.status === "accepted").length;
  const rejectedCount = bookings.filter(b => b.status === "rejected").length;
  const paidCount = bookings.filter(b => b.status === "paid").length;
  const totalRevenue = bookings
    .filter(b => b.status === "paid")
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <div>
      <Helmet>
        <title>Booking Requests - Uraan</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          Requested Bookings
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Bookings</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{bookings.length}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-4 border border-yellow-200 dark:border-yellow-700">
            <h3 className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending</h3>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{pendingCount}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-700">
            <h3 className="text-sm font-medium text-green-600 dark:text-green-400">Accepted</h3>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{acceptedCount}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-700">
            <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400">Paid</h3>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{paidCount}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Revenue</h3>
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">৳{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Filter and Sort Controls */}
        {bookings.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500 dark:text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="paid">Paid</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <FaSort className="text-gray-500 dark:text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 border border-gray-200 dark:border-gray-700">
            <FaTicketAlt className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
              No booking requests yet
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              When users book your tickets, their requests will appear here for your approval.
            </p>
          </div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 border border-gray-200 dark:border-gray-700">
            <FaFilter className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
              No bookings match your filter
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              Try changing your filter criteria to see more results.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Booking Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    {/* Booking ID Badge */}
                    <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FaTicketAlt className="text-slate-600 dark:text-slate-400" />
                        <span className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {booking.bookingId}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                        booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : booking.status === "accepted"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : booking.status === "rejected"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      }`}
                    >
                      <FaClock className="w-3 h-3" />
                      {booking.status}
                    </span>
                  </div>

                  <div className="mt-4">
                    {/* Customer Info */}
                    <div className="flex items-center gap-2 mb-3">
                      <FaUser className="text-slate-500" />
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {booking.userName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {booking.userEmail}
                        </p>
                      </div>
                    </div>

                    {/* Ticket Details */}
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                        {booking.ticketTitle}
                      </h4>
                      {booking.ticketId && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">From:</span>
                            <p className="font-medium text-gray-700 dark:text-gray-300">
                              {booking.ticketId.from}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">To:</span>
                            <p className="font-medium text-gray-700 dark:text-gray-300">
                              {booking.ticketId.to}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Date:</span>
                            <p className="font-medium text-gray-700 dark:text-gray-300">
                              {new Date(booking.ticketId.departureDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Time:</span>
                            <p className="font-medium text-gray-700 dark:text-gray-300">
                              {booking.ticketId.departureTime}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Booking Details */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">Quantity:</span>
                        <p className="font-semibold text-lg text-gray-800 dark:text-white">
                          {booking.quantity} seats
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">Total Price:</span>
                        <p className="font-bold text-lg text-primary">
                          ৳{booking.totalPrice}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  {booking.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleAccept(booking._id)}
                        disabled={updateStatusMutation.isPending}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 font-medium"
                      >
                        <FaCheckCircle />
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(booking._id)}
                        disabled={updateStatusMutation.isPending}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 font-medium"
                      >
                        <FaTimesCircle />
                        Reject
                      </button>
                    </>
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-3">
                      <p className="font-medium">Already processed</p>
                      <p className="text-sm">
                        {new Date(booking.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestedBookings;
