import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCheckCircle, FaTimesCircle, FaEye, FaClock, FaCheck, FaTimes } from "react-icons/fa";
import { useState } from "react";

const ManageTickets = () => {
  const queryClient = useQueryClient();
  const [viewBooking, setViewBooking] = useState(null);

  // Fetch all bookings instead of tickets
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["adminBookings"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings/admin/all`,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      return response.data.bookings || [];
    },
  });

  // Booking status update mutation for admin approval/rejection
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/bookings/status/${id}`,
        { status },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(
        `Booking ${
          variables.status === "Approved" ? "approved" : "cancelled"
        } successfully!`
      );
      queryClient.invalidateQueries(["adminBookings"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update booking status");
    },
  });

  const handleApprove = (id) => {
    statusMutation.mutate({ id, status: "Approved" });
  };

  const handleCancel = (id) => {
    statusMutation.mutate({ id, status: "Cancelled" });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Paid":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <FaCheck className="w-4 h-4" />;
      case "Cancelled":
        return <FaTimes className="w-4 h-4" />;
      case "Paid":
        return <FaCheckCircle className="w-4 h-4" />;
      case "Pending":
        return <FaClock className="w-4 h-4" />;
      default:
        return <FaClock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className=" ">
      <Helmet>
        <title>Manage Bookings - Uraan</title>
      </Helmet>

      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-800 dark:text-white">
        Manage Bookings
      </h1>

      {/* Booking Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">
            {bookings.filter(b => b.status === 'Pending').length}
          </p>
        </div>
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 dark:text-green-200">Approved</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-300">
            {bookings.filter(b => b.status === 'Approved').length}
          </p>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200">Paid</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
            {bookings.filter(b => b.status === 'Paid').length}
          </p>
        </div>
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg">
          <h3 className="font-semibold text-red-800 dark:text-red-200">Cancelled</h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-300">
            {bookings.filter(b => b.status === 'Cancelled').length}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl ">
        {/* Scrollable table wrapper */}
        <div className="overflow-x-auto">
          <table className="">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-2 md:px-4 py-2 text-left dark:text-gray-300 text-xs md:text-base whitespace-nowrap">
                  Booking ID
                </th>
                <th className="px-2 md:px-4 py-2 text-left dark:text-gray-300 text-xs md:text-base whitespace-nowrap">
                  Customer
                </th>
                <th className="px-2 md:px-4 py-2 text-left dark:text-gray-300 text-xs md:text-base whitespace-nowrap">
                  Ticket
                </th>
                <th className="px-2 md:px-4 py-2 text-left dark:text-gray-300 text-xs md:text-base whitespace-nowrap">
                  Route
                </th>
                <th className="px-2 md:px-4 py-2 text-left dark:text-gray-300 text-xs md:text-base whitespace-nowrap">
                  Quantity
                </th>
                <th className="px-2 md:px-4 py-2 text-left dark:text-gray-300 text-xs md:text-base whitespace-nowrap">
                  Total Price
                </th>
                <th className="px-2 md:px-4 py-2 text-left dark:text-gray-300 text-xs md:text-base whitespace-nowrap">
                  Status
                </th>
                <th className="px-2 md:px-4 py-2 text-center dark:text-gray-300 text-xs md:text-base whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    {/* Booking ID */}
                    <td className="px-2 md:px-4 py-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(booking.status)}
                        <div>
                          <p className="font-mono font-semibold dark:text-white text-xs md:text-sm">
                            {booking.bookingId}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    {/* Customer */}
                    <td className="px-2 md:px-4 py-2">
                      <div className="min-w-0">
                        <p className="font-semibold dark:text-white text-xs md:text-base truncate max-w-[120px] md:max-w-[180px]">
                          {booking.userName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px] md:max-w-[180px]">
                          {booking.userEmail}
                        </p>
                      </div>
                    </td>

                    {/* Ticket */}
                    <td className="px-2 md:px-4 py-2">
                      <p className="font-semibold dark:text-white text-xs md:text-base truncate max-w-[120px] md:max-w-[200px]">
                        {booking.ticketTitle}
                      </p>
                    </td>

                    {/* Route */}
                    <td className="px-2 md:px-4 py-2 text-xs md:text-base dark:text-white whitespace-nowrap">
                      {booking.ticketRoute || 'N/A'}
                    </td>

                    {/* Quantity */}
                    <td className="px-2 md:px-4 py-2 text-xs md:text-base dark:text-white text-center">
                      {booking.quantity}
                    </td>

                    {/* Total Price */}
                    <td className="px-2 md:px-4 py-2 font-bold text-primary text-xs md:text-base whitespace-nowrap">
                      ৳{booking.totalPrice}
                    </td>

                    {/* Status */}
                    <td className="px-2 md:px-4 py-2">
                      <span
                        className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1 ${getStatusBadge(
                          booking.status
                        )}`}
                      >
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-2 md:px-4 py-2">
                      <div className="flex justify-center space-x-1 md:space-x-2">
                        <button
                          onClick={() => setViewBooking(booking)}
                          className="p-1.5 md:p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                          title="View Details"
                        >
                          <FaEye className="text-xs md:text-base" />
                        </button>
                        
                        {booking.status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(booking._id)}
                              disabled={statusMutation.isPending}
                              className="p-1.5 md:p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Approve Booking"
                            >
                              <FaCheckCircle className="text-xs md:text-base" />
                            </button>
                            <button
                              onClick={() => handleCancel(booking._id)}
                              disabled={statusMutation.isPending}
                              className="p-1.5 md:p-2 bg-[#b35a44] hover:bg-[#9a4d3a] text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Cancel Booking"
                            >
                              <FaTimesCircle className="text-xs md:text-base" />
                            </button>
                          </>
                        )}

                        {booking.status === "Approved" && (
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                            Awaiting Payment
                          </span>
                        )}

                        {booking.status === "Paid" && (
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            Payment Complete
                          </span>
                        )}

                        {booking.status === "Cancelled" && (
                          <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                            Booking Cancelled
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {viewBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                Booking Details
              </h3>
              <button
                onClick={() => setViewBooking(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex justify-center">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusBadge(
                    viewBooking.status
                  )}`}
                >
                  {getStatusIcon(viewBooking.status)}
                  {viewBooking.status}
                </span>
              </div>

              {/* Booking Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Booking ID
                  </p>
                  <p className="font-mono font-semibold dark:text-white text-lg">
                    {viewBooking.bookingId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Booking Date
                  </p>
                  <p className="font-semibold dark:text-white">
                    {new Date(viewBooking.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Customer Name
                  </p>
                  <p className="font-semibold dark:text-white">
                    {viewBooking.userName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Customer Email
                  </p>
                  <p className="font-semibold dark:text-white">
                    {viewBooking.userEmail}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Ticket
                  </p>
                  <p className="font-semibold dark:text-white">
                    {viewBooking.ticketTitle}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Route
                  </p>
                  <p className="font-semibold dark:text-white">
                    {viewBooking.ticketRoute || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Quantity
                  </p>
                  <p className="font-semibold dark:text-white text-lg">
                    {viewBooking.quantity}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Price
                  </p>
                  <p className="font-bold text-primary text-xl">
                    ৳{viewBooking.totalPrice}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              {viewBooking.status === 'Pending' && (
                <div className="flex justify-center space-x-4 pt-4 border-t dark:border-gray-700">
                  <button
                    onClick={() => {
                      handleApprove(viewBooking._id);
                      setViewBooking(null);
                    }}
                    disabled={statusMutation.isPending}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Approve Booking
                  </button>
                  <button
                    onClick={() => {
                      handleCancel(viewBooking._id);
                      setViewBooking(null);
                    }}
                    disabled={statusMutation.isPending}
                    className="px-6 py-2 bg-[#b35a44] hover:bg-[#9a4d3a] text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTickets;
