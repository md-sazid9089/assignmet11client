import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaEnvelope, FaUser, FaShieldAlt, FaCrown } from "react-icons/fa";
import { AuthContext } from "../../../providers/AuthProvider";

const AdminProfile = () => {
  const { user } = useContext(AuthContext);

  const { data: userData, isLoading } = useQuery({
    queryKey: ["adminProfile", user?.email],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${user.email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    enabled: !!user?.email,
  });

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
        <title>Admin Profile - Uraan</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Admin Profile
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-[linear-gradient(159deg,#377CBD_0%,#09335B_50%,#09335B_100%)] h-32"></div>

        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-12 mb-6">
            <img
              src={user?.photoURL || "https://i.ibb.co/2Pz4LgR/user.png"}
              alt={user?.displayName}
              className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
            />
            <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center justify-center md:justify-start">
                {user?.displayName}
                <FaShieldAlt className="ml-2 text-yellow-500" />
              </h2>
              <span className="inline-block mt-2 px-4 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm font-semibold">
                Administrator
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <FaUser className="text-2xl text-[#1FA0D6]" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Full Name
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 ml-9">
                {user?.displayName}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <FaEnvelope className="text-2xl text-[#1FA0D6]" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Email Address
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 ml-9">
                {user?.email}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <FaShieldAlt className="text-2xl text-[#1FA0D6]" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Account Type
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 ml-9 flex items-center">
                {userData?.role || "Admin"}
                <FaCrown className="ml-2 text-yellow-500" />
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <FaShieldAlt className="text-2xl text-[#1FA0D6]" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Access Level
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 ml-9">
                <span className="text-green-500 font-semibold">
                  Full Access
                </span>
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
              <FaShieldAlt className="mr-2 text-[#1FA0D6]" />
              Administrator Privileges
            </h3>
            <ul className="grid md:grid-cols-2 gap-3">
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-[#1FA0D6] rounded-full mr-3"></span>
                Manage all tickets and bookings
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-[#1FA0D6] rounded-full mr-3"></span>
                Control user roles and permissions
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-[#1FA0D6] rounded-full mr-3"></span>
                Approve or reject vendor tickets
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-[#1FA0D6] rounded-full mr-3"></span>
                Mark vendors as fraud
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-[#1FA0D6] rounded-full mr-3"></span>
                Manage featured advertisements
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 bg-[#1FA0D6] rounded-full mr-3"></span>
                Access all system analytics
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
