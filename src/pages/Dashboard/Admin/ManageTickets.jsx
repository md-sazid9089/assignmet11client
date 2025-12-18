import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCheckCircle, FaTimesCircle, FaEye } from "react-icons/fa";
import { useState } from "react";

const ManageTickets = () => {
  const queryClient = useQueryClient();
  const [viewTicket, setViewTicket] = useState(null);

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["adminTickets"],
    queryFn: async () => {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/tickets/admin/all`,
        { headers: { 'x-user-id': userId } }
      );
      return response.data.tickets || [];
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async ({ id, verificationStatus }) => {
      const userId = localStorage.getItem("userId");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/tickets/admin/status`,
        { ticketId: id, status: verificationStatus },
        { headers: { 'x-user-id': userId } }
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(
        `Ticket ${
          variables.verificationStatus === "approved" ? "approved" : "rejected"
        } successfully!`
      );
      queryClient.invalidateQueries(["adminTickets"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update ticket");
    },
  });

  const handleApprove = (id) => {
    verifyMutation.mutate({ id, verificationStatus: "approved" });
  };

  const handleReject = (id) => {
    verifyMutation.mutate({ id, verificationStatus: "rejected" });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
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
        <title>Manage Tickets - Uraan</title>
      </Helmet>

      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-800 dark:text-white">
        Manage Tickets
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl ">
        {/* Scrollable table wrapper */}
        <div className="overflow-x-auto">
          <table className="">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-2 md:px-4 py-2 text-left dark:text-gray-300 text-xs md:text-base whitespace-nowrap">
                  Ticket
                </th>
                <th className="px-2 md:px-4 py-2 text-left dark:text-gray-300 text-xs md:text-base whitespace-nowrap">
                  Vendor
                </th>
                <th className="px-2 md:px-4 py-2 text-left dark:text-gray-300 text-xs md:text-base whitespace-nowrap">
                  Route
                </th>
                <th className="px-2 md:px-4 py-2 text-left dark:text-gray-300 text-xs md:text-base whitespace-nowrap">
                  Price
                </th>
                <th className="px-2 md:px-4 py-2 text-left dark:text-gray-300 text-xs md:text-base whitespace-nowrap">
                  Quantity
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
              {tickets.map((ticket) => (
                <tr
                  key={ticket._id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-2 md:px-4 py-2">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <img
                        src={ticket.imageUrl}
                        alt={ticket.title}
                        className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold dark:text-white text-xs md:text-base truncate max-w-[100px] md:max-w-[200px]">
                          {ticket.title}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                          {ticket.transportType}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 md:px-4 py-2">
                    <p className="font-semibold dark:text-white text-xs md:text-base truncate max-w-[100px] md:max-w-none">
                      {ticket.vendorName}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate max-w-[120px] md:max-w-none">
                      {ticket.vendorEmail}
                    </p>
                  </td>
                  <td className="px-2 md:px-4 py-2 text-xs md:text-base dark:text-white whitespace-nowrap">
                    {ticket.from} → {ticket.to}
                  </td>
                  <td className="px-2 md:px-4 py-2 font-bold text-primary text-xs md:text-base whitespace-nowrap">
                    ৳{ticket.pricePerUnit}
                  </td>
                  <td className="px-2 md:px-4 py-2 text-xs md:text-base dark:text-white">
                    {ticket.quantity}
                  </td>
                  <td className="px-2 md:px-4 py-2">
                    <span
                      className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusBadge(
                        ticket.verificationStatus
                      )}`}
                    >
                      {ticket.verificationStatus}
                    </span>
                  </td>
                  <td className="px-2 md:px-4 py-2">
                    <div className="flex justify-center space-x-1 md:space-x-2">
                      <button
                        onClick={() => setViewTicket(ticket)}
                        className="p-1.5 md:p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        title="View Details"
                      >
                        <FaEye className="text-xs md:text-base" />
                      </button>
                      {ticket.verificationStatus === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(ticket._id)}
                            disabled={verifyMutation.isPending}
                            className="p-1.5 md:p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                            title="Approve"
                          >
                            <FaCheckCircle className="text-xs md:text-base" />
                          </button>
                          <button
                            onClick={() => handleReject(ticket._id)}
                            disabled={verifyMutation.isPending}
                            className="p-1.5 md:p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                            title="Reject"
                          >
                            <FaTimesCircle className="text-xs md:text-base" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Modal */}
      {viewTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                Ticket Details
              </h3>
              <button
                onClick={() => setViewTicket(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>

            <img
              src={viewTicket.imageUrl}
              alt={viewTicket.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Title
                  </p>
                  <p className="font-semibold dark:text-white">
                    {viewTicket.title}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Transport Type
                  </p>
                  <p className="font-semibold dark:text-white">
                    {viewTicket.transportType}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    From
                  </p>
                  <p className="font-semibold dark:text-white">
                    {viewTicket.from}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">To</p>
                  <p className="font-semibold dark:text-white">
                    {viewTicket.to}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Price
                  </p>
                  <p className="font-bold text-primary text-xl">
                    ৳{viewTicket.pricePerUnit}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Quantity
                  </p>
                  <p className="font-semibold dark:text-white">
                    {viewTicket.quantity}
                  </p>
                </div>
              </div>

              {viewTicket.perks && viewTicket.perks.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Perks
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {viewTicket.perks.map((perk, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        {perk}
                      </span>
                    ))}
                  </div>
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
