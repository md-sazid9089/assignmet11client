import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const RequestedBookings = () => {
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["vendorBookings"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/vendor/bookings`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/vendor/bookings/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
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

  const handleAccept = (id) => {
    updateStatusMutation.mutate({ id, status: "accepted" });
  };

  const handleReject = (id) => {
    updateStatusMutation.mutate({ id, status: "rejected" });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>Booking Requests - Uraan</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Requested Bookings
      </h1>

      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            No booking requests yet
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="text-left p-4 dark:text-gray-300">User</th>
                  <th className="text-left p-4 dark:text-gray-300">Ticket</th>
                  <th className="text-left p-4 dark:text-gray-300">Quantity</th>
                  <th className="text-left p-4 dark:text-gray-300">
                    Total Price
                  </th>
                  <th className="text-left p-4 dark:text-gray-300">Status</th>
                  <th className="text-center p-4 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-semibold dark:text-white">
                          {booking.userName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {booking.userId}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={booking.ticketDetails.image}
                          alt={booking.ticketTitle}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-semibold dark:text-white">
                            {booking.ticketTitle}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {booking.ticketDetails.fromLocation} →{" "}
                            {booking.ticketDetails.toLocation}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-lg dark:text-white">
                        {booking.bookingQuantity}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-lg text-primary">
                        ৳{booking.totalPrice}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : booking.status === "accepted"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : booking.status === "rejected"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {booking.status === "pending" ? (
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleAccept(booking._id)}
                            disabled={updateStatusMutation.isPending}
                            className="flex items-center space-x-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                          >
                            <FaCheckCircle />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleReject(booking._id)}
                            disabled={updateStatusMutation.isPending}
                            className="flex items-center space-x-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                          >
                            <FaTimesCircle />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                          Already processed
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestedBookings;
