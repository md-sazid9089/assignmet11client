import { FaDAndDBeyond, FaHome } from "react-icons/fa";
import { Link, useRouteError } from "react-router";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-8">
          <div className="bg-red-100 dark:bg-red-900 p-6 rounded-full"></div>
        </div>

        <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">
          404
        </h1>

        <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Oops! Page Not Found
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          {error?.statusText ||
            error?.message ||
            "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            <FaHome className="w-5 h-5" />
            <span>Go to Homepage</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition font-semibold"
          >
            <span>Go Back</span>
          </button>
        </div>

        <div className="mt-12">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Error Code: {error?.status || "404"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
