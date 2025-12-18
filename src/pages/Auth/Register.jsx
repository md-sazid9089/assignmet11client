import { Link, useNavigate } from "react-router";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import logo from "../../assets/logo.png";
const Register = () => {
  const { createUser, googleSignIn, updateUserProfile } =
    useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await createUser(data.email, data.password);

      await updateUserProfile(data.name, data.photoURL);

      await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
        name: data.name,
        email: data.email,
        photoURL: data.photoURL,
      });

      const tokenResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/jwt`,
        { email: result.user.email }
      );
      localStorage.setItem("token", tokenResponse.data.token);

      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await googleSignIn();

      await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
      });

      const tokenResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/jwt`,
        { email: result.user.email }
      );
      localStorage.setItem("token", tokenResponse.data.token);

      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Google sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 lg:px-8 ">
          <div className="flex items-center h-20">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Uraan Logo" className="w-24 -mt-5" />
              <span className="text-2xl lg:text-3xl -mb-10 -ml-10 -mt-8 font-bold text-[#476F97] dark:text-[#5a9bd5] bg-clip-text">
                Uraan
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <div className=" flex items-center justify-center  py-12 px-4">
        <div className="max-w-md w-full my-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
            Create Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Photo URL
              </label>
              <input
                type="url"
                {...register("photoURL", { required: "Photo URL is required" })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter photo URL"
              />
              {errors.photoURL && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.photoURL.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full  text-white py-3 rounded-lg  bg-[#09335b] hover:bg-[linear-gradient(159deg,#377CBD_0%,#09335B_50%,#09335B_100%)] transition font-semibold disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400">
              OR
            </span>
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition font-semibold"
          >
            <FaGoogle />
            <span>Continue with Google</span>
          </button>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#09335b] font-semibold hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
