import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { FaBullhorn, FaEyeSlash } from "react-icons/fa";

const AdvertiseTickets = () => {
  const queryClient = useQueryClient();

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["adminApprovedTickets"],
    queryFn: async () => {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/tickets/admin/all`,
        { headers: { 'x-user-id': userId } }
      );
      const allTickets = response.data.tickets || [];
      return allTickets.filter(
        (ticket) => ticket.verificationStatus === "approved"
      );
    },
  });

  const toggleAdvertiseMutation = useMutation({
    mutationFn: async ({ id, isAdvertised }) => {
      const userId = localStorage.getItem("userId");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/tickets/admin/advertise`,
        { ticketId: id, isAdvertised },
        { headers: { 'x-user-id': userId } }
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(
        variables.isAdvertised
          ? "Ticket advertised successfully!"
          : "Advertisement removed!"
      );
      queryClient.invalidateQueries(["adminApprovedTickets"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update advertisement"
      );
    },
  });

  const handleToggleAdvertise = (id, currentStatus) => {
    const advertisedCount = tickets.filter((t) => t.isAdvertised).length;

    if (!currentStatus && advertisedCount >= 6) {
      toast.error("Maximum 6 tickets can be advertised at a time");
      return;
    }

    toggleAdvertiseMutation.mutate({ id, isAdvertised: !currentStatus });
  };

  const advertisedTickets = tickets.filter((t) => t.isAdvertised);

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
        <title>Advertise Tickets - Uraan</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Advertise Tickets
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
          <p className="text-sm opacity-90 mb-2">Currently Advertised</p>
          <p className="text-4xl font-bold">{advertisedTickets.length} / 6</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
          <p className="text-sm opacity-90 mb-2">Approved Tickets</p>
          <p className="text-4xl font-bold">{tickets.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
          <p className="text-sm opacity-90 mb-2">Available Slots</p>
          <p className="text-4xl font-bold">{6 - advertisedTickets.length}</p>
        </div>
      </div>

      {advertisedTickets.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            Currently Advertised Tickets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advertisedTickets.map((ticket) => (
              <div
                key={ticket._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 border-green-500 flex flex-col"
              >
                <div className="relative">
                  <img
                    src={ticket.imageUrl}
                    alt={ticket.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <FaBullhorn />
                    <span>Featured</span>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold dark:text-white mb-2">
                    {ticket.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">
                    {ticket.from} → {ticket.to}
                  </p>
                  <button
                    onClick={() =>
                      handleToggleAdvertise(ticket._id, ticket.isAdvertised)
                    }
                    disabled={toggleAdvertiseMutation.isPending}
                    className="w-full flex justify-center items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 mt-auto"
                  >
                    <FaEyeSlash />
                    <span>Remove Advertisement</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        All Approved Tickets
      </h2>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="p-4 text-left dark:text-gray-300">Ticket</th>
                <th className="p-4 text-left dark:text-gray-300">Vendor</th>
                <th className="p-4 text-left dark:text-gray-300">Route</th>
                <th className="p-4 text-left dark:text-gray-300">Price</th>
                <th className="p-4 text-left dark:text-gray-300">Status</th>
                <th className="p-4 text-center dark:text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket._id}
                  className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                    ticket.isAdvertised
                      ? "bg-green-50 dark:bg-green-900/20"
                      : ""
                  }`}
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={ticket.imageUrl}
                        alt={ticket.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-semibold dark:text-white">
                          {ticket.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {ticket.transportType}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold dark:text-white">
                      {ticket.vendorName}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="dark:text-white">
                      {ticket.from} → {ticket.to}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-primary">৳{ticket.pricePerUnit}</p>
                  </td>
                  <td className="p-4">
                    {ticket.isAdvertised ? (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold flex items-center space-x-1 w-fit">
                        <FaBullhorn />
                        <span>Advertised</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                        Not Advertised
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ticket.isAdvertised || false}
                          onChange={() =>
                            handleToggleAdvertise(
                              ticket._id,
                              ticket.isAdvertised
                            )
                          }
                          disabled={
                            toggleAdvertiseMutation.isPending ||
                            (!ticket.isAdvertised &&
                              advertisedTickets.length >= 6)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {tickets.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            No approved tickets available
          </p>
        </div>
      )}
    </div>
  );
};

export default AdvertiseTickets;
