import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../../providers/AuthProvider";
import { FaEnvelope, FaUser, FaIdBadge } from "react-icons/fa";

const VendorProfile = () => {
  const { user } = useContext(AuthContext);

  const { data: userData, isLoading } = useQuery({
    queryKey: ["vendorProfile", user?.email],
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
        <title>Vendor Profile - TicketBari</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Vendor Profile
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-[linear-gradient(159deg,#377CBD_0%,#09335B_50%,#09335B_100%)] h-32"></div>

        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 mb-6 ">
            <img
              src={user?.photoURL || "https://i.ibb.co/2Pz4LgR/user.png"}
              alt={user?.displayName}
              className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
            />
            <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                {user?.displayName}
              </h2>
              <span className="inline-block mt-2 px-4 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-semibold">
                Vendor Account
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <FaUser className="text-2xl text-primary" />
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
                <FaEnvelope className="text-2xl text-primary" />
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
                <FaIdBadge className="text-2xl text-primary" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Account Type
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 ml-9">
                {userData?.role || "Vendor"}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <FaIdBadge className="text-2xl text-primary" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Account Status
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 ml-9">
                {userData?.isFraud ? (
                  <span className="text-red-500 font-semibold">Restricted</span>
                ) : (
                  <span className="text-green-500 font-semibold">Active</span>
                )}
              </p>
            </div>
          </div>

          {userData?.isFraud && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-600 dark:text-red-400">
                Your account has been restricted. Please contact support for
                more information.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
