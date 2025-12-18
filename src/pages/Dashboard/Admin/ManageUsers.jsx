import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FaUserShield, FaStore, FaExclamationTriangle } from "react-icons/fa";

const ManageUsers = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/all`,
        { headers: { 'x-user-id': userId } }
      );
      return response.data.users || [];
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      const userId = localStorage.getItem("userId");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/role`,
        { userId: id, role },
        { headers: { 'x-user-id': userId } }
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(`User role updated to ${variables.role}!`);
      queryClient.invalidateQueries(["adminUsers"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update role");
    },
  });

  const markFraudMutation = useMutation({
    mutationFn: async (id) => {
      const userId = localStorage.getItem("userId");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/fraud`,
        { userId: id },
        { headers: { 'x-user-id': userId } }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Vendor marked as fraud successfully!");
      queryClient.invalidateQueries(["adminUsers"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to mark as fraud");
    },
  });

  const handleMakeAdmin = async (id, name) => {
    const result = await Swal.fire({
      title: "Make Admin?",
      text: `Make ${name} an administrator?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, make admin",
    });

    if (result.isConfirmed) {
      updateRoleMutation.mutate({ id, role: "admin" });
    }
  };

  const handleMakeVendor = async (id, name) => {
    const result = await Swal.fire({
      title: "Make Vendor?",
      text: `Make ${name} a vendor?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#C2643C",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Yes, make vendor",
    });

    if (result.isConfirmed) {
      updateRoleMutation.mutate({ id, role: "vendor" });
    }
  };

  const handleMarkFraud = async (id, name) => {
    const result = await Swal.fire({
      title: "Mark as Fraud?",
      text: `This will hide all tickets from ${name} and prevent them from adding new ones.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Yes, mark as fraud",
      dangerMode: true,
    });

    if (result.isConfirmed) {
      markFraudMutation.mutate(id);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return "bg-clay-100 text-clay-800 dark:bg-clay-900/50 dark:text-clay-300 ring-1 ring-clay-300 dark:ring-clay-700";
      case "vendor":
        return "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 ring-1 ring-slate-300 dark:ring-slate-600";
      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-clay-500"></span>
      </div>
    );
  }

  return (
    <div className=" overflow-hidden">
      <Helmet>
        <title>Manage Users - TicketBari</title>
      </Helmet>

      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-slate-800 dark:text-slate-100">
        Manage Users
      </h1>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 w-full">
        <div className="bg-admin-gradient text-white rounded-xl shadow-slate p-4 md:p-6 border border-slate-700/20">
          <p className="text-xs md:text-sm text-slate-200 mb-1 md:mb-2">
            Total Users
          </p>
          <p className="text-2xl md:text-4xl font-bold text-clay-300">
            {users.filter((u) => u.role === "user").length}
          </p>
        </div>
        <div className="bg-admin-gradient text-white rounded-xl shadow-slate p-4 md:p-6 border border-slate-700/20">
          <p className="text-xs md:text-sm text-slate-200 mb-1 md:mb-2">
            Total Vendors
          </p>
          <p className="text-2xl md:text-4xl font-bold text-clay-300">
            {users.filter((u) => u.role === "vendor").length}
          </p>
        </div>
        <div className="bg-admin-gradient text-white rounded-xl shadow-slate p-4 md:p-6 border border-slate-700/20">
          <p className="text-xs md:text-sm text-slate-200 mb-1 md:mb-2">
            Total Admins
          </p>
          <p className="text-2xl md:text-4xl font-bold text-clay-300">
            {users.filter((u) => u.role === "admin").length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-slate overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="">
          <table className="md:w-full w-fit min-w-[700px] overflow-x-auto">
            <thead className="bg-slate-100 dark:bg-slate-700/50">
              <tr>
                <th className="p-2 md:p-4 text-left text-slate-700 dark:text-slate-200 font-semibold text-xs md:text-base whitespace-nowrap">
                  User
                </th>
                <th className="p-2 md:p-4 text-left text-slate-700 dark:text-slate-200 font-semibold text-xs md:text-base whitespace-nowrap">
                  Email
                </th>
                <th className="p-2 md:p-4 text-left text-slate-700 dark:text-slate-200 font-semibold text-xs md:text-base whitespace-nowrap">
                  Role
                </th>
                <th className="p-2 md:p-4 text-left text-slate-700 dark:text-slate-200 font-semibold text-xs md:text-base whitespace-nowrap">
                  Status
                </th>
                <th className="p-2 md:p-4 text-center text-slate-700 dark:text-slate-200 font-semibold text-xs md:text-base whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <td className="p-2 md:p-4">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <img
                        src={
                          user.photoURL || "https://i.ibb.co/2Pz4LgR/user.png"
                        }
                        alt={user.name}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full flex-shrink-0 ring-2 ring-slate-200 dark:ring-slate-700"
                      />
                      <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm md:text-base truncate max-w-[120px] md:max-w-none">
                        {user.name}
                      </p>
                    </div>
                  </td>
                  <td className="p-2 md:p-4">
                    <p className="text-slate-600 dark:text-slate-300 text-xs md:text-base truncate max-w-[150px] md:max-w-none">
                      {user.email}
                    </p>
                  </td>
                  <td className="p-2 md:p-4">
                    <span
                      className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getRoleBadge(
                        user.role
                      )}`}
                    >
                      {user.role || "user"}
                    </span>
                  </td>
                  <td className="p-2 md:p-4">
                    {user.isFraud ? (
                      <span className="px-2 md:px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-semibold whitespace-nowrap">
                        Fraud
                      </span>
                    ) : (
                      <span className="px-2 md:px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold whitespace-nowrap ring-1 ring-green-300 dark:ring-green-700">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="p-2 md:p-4">
                    {user.role !== "admin" && (
                      <div className="flex justify-center space-x-1 md:space-x-2 flex-wrap gap-1">
                        <button
                          onClick={() => handleMakeAdmin(user._id, user.name)}
                          disabled={updateRoleMutation.isPending}
                          className="flex items-center space-x-1 px-2 md:px-3 py-1.5 md:py-2 bg-clay-600 text-white rounded-lg hover:bg-clay-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm whitespace-nowrap"
                        >
                          <FaUserShield className="text-xs md:text-base" />
                          <span>Admin</span>
                        </button>
                        <button
                          onClick={() => handleMakeVendor(user._id, user.name)}
                          disabled={updateRoleMutation.isPending}
                          className="flex items-center space-x-1 px-2 md:px-3 py-1.5 md:py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm whitespace-nowrap"
                        >
                          <FaStore className="text-xs md:text-base" />
                          <span>Vendor</span>
                        </button>
                        {user.role === "vendor" && !user.isFraud && (
                          <button
                            onClick={() => handleMarkFraud(user._id, user.name)}
                            disabled={markFraudMutation.isPending}
                            className="flex items-center space-x-1 px-2 md:px-3 py-1.5 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm whitespace-nowrap"
                          >
                            <FaExclamationTriangle className="text-xs md:text-base" />
                            <span>Fraud</span>
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
