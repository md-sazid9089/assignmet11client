import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../../../providers/AuthProvider";

const AddTicket = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const addTicketMutation = useMutation({
    mutationFn: async (ticketData) => {
      let userId = localStorage.getItem("userId");
      
      console.log('🔍 Checking localStorage:', {
        userId,
        allLocalStorage: { ...localStorage }
      });
      
      // If userId is not in localStorage, try to create/fetch it from backend
      if (!userId) {
        console.warn('⚠️ No userId in localStorage, attempting to fetch from backend...');
        
        if (!user) {
          throw new Error("Please log in to add tickets.");
        }
        
        try {
          console.log('📤 Fetching userId from backend for:', user.email);
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/users/create`,
            {
              name: user.displayName || user.email?.split('@')[0] || 'Vendor User',
              email: user.email,
              photoURL: user.photoURL || '',
              firebaseUid: user.uid,
            }
          );
          
          console.log('📥 Backend response:', response.data);
          
          if (response.data.success && response.data.user._id) {
            userId = response.data.user._id;
            localStorage.setItem("userId", userId);
            console.log('✅ UserId fetched and stored:', userId);
          } else {
            console.error('❌ Backend returned success but no user ID:', response.data);
            throw new Error("Failed to get user ID from backend");
          }
        } catch (backendError) {
          console.error('❌ Backend error details:', {
            message: backendError.message,
            response: backendError.response?.data,
            status: backendError.response?.status,
            statusText: backendError.response?.statusText
          });
          throw new Error(`Backend error: ${backendError.response?.data?.message || backendError.message}`);
        }
      }
      
      console.log('🔐 Sending request with userId:', userId);
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/tickets`,
        ticketData,
        { 
          headers: { 
            'x-user-id': userId,
            'Content-Type': 'application/json'
          } 
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Ticket added successfully! Waiting for admin approval.");
      queryClient.invalidateQueries(["vendorTickets"]);
      reset();
      setImageUrl("");
      navigate("/dashboard/vendor/my-tickets");
    },
    onError: (error) => {
      console.error('❌ Add Ticket Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.message.includes('log out and log back in')) {
        toast.error('Session expired. Please log out and log back in.', { duration: 5000 });
      } else {
        toast.error(error.response?.data?.message || error.message || "Failed to add ticket");
      }
    },
  });

  const onSubmit = async (data) => {
    console.log('📝 Form data received:', data);
    
    if (!data.imageUrl || !data.imageUrl.trim()) {
      toast.error("Please provide an image URL");
      console.error('❌ Image URL is missing:', data.imageUrl);
      return;
    }

    // Map frontend field names to backend field names
    const ticketData = {
      title: data.ticketTitle,
      from: data.fromLocation,
      to: data.toLocation,
      transportType: data.transportType.toLowerCase(), // Ensure lowercase
      pricePerUnit: parseFloat(data.price),
      quantity: parseInt(data.ticketQuantity),
      departureDate: data.departureDateTime.split('T')[0], // Extract date
      departureTime: data.departureDateTime.split('T')[1], // Extract time
      perks: data.perks ? data.perks.split(",").map((p) => p.trim()) : [],
      imageUrl: data.imageUrl, // Backend expects 'imageUrl' not 'image'
      vendorName: user.displayName || user.email?.split('@')[0] || 'Vendor',
      vendorEmail: user.email,
    };

    console.log('📤 Sending ticket data to backend:', ticketData);
    console.log('🖼️ ImageURL being sent:', ticketData.imageUrl);
    addTicketMutation.mutate(ticketData);
  };

  return (
    <div>
      <Helmet>
        <title>Add Ticket - Uraan</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Add New Ticket
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ticket Title *
            </label>
            <input
              type="text"
              {...register("ticketTitle", { required: "Title is required" })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Dhaka to Chittagong Express Bus"
            />
            {errors.ticketTitle && (
              <p className="text-red-500 text-sm mt-1">
                {errors.ticketTitle.message}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Location *
              </label>
              <input
                type="text"
                {...register("fromLocation", {
                  required: "From location is required",
                })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Dhaka"
              />
              {errors.fromLocation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fromLocation.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To Location *
              </label>
              <input
                type="text"
                {...register("toLocation", {
                  required: "To location is required",
                })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Chittagong"
              />
              {errors.toLocation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.toLocation.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Transport Type *
            </label>
            <select
              {...register("transportType", {
                required: "Transport type is required",
              })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Transport Type</option>
              <option value="bus">Bus</option>
              <option value="train">Train</option>
              <option value="launch">Launch</option>
              <option value="plane">Plane</option>
            </select>
            {errors.transportType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.transportType.message}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price (per unit) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 1, message: "Price must be at least 1" },
                })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                placeholder="500"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ticket Quantity *
              </label>
              <input
                type="number"
                {...register("ticketQuantity", {
                  required: "Quantity is required",
                  min: { value: 1, message: "Quantity must be at least 1" },
                })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                placeholder="50"
              />
              {errors.ticketQuantity && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.ticketQuantity.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Departure Date & Time *
            </label>
            <input
              type="datetime-local"
              {...register("departureDateTime", {
                required: "Departure date & time is required",
              })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
            />
            {errors.departureDateTime && (
              <p className="text-red-500 text-sm mt-1">
                {errors.departureDateTime.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Perks (comma separated)
            </label>
            <input
              type="text"
              {...register("perks")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              placeholder="AC, WiFi, Breakfast, Reclining Seats"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Example: AC, WiFi, Breakfast
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ticket Image URL *
            </label>
            <input
              type="url"
              {...register("imageUrl", {
                required: "Image URL is required",
                pattern: {
                  value: /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i,
                  message: "Please enter a valid image URL (jpg, jpeg, png, webp, or gif)"
                }
              })}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              placeholder="https://example.com/ticket-image.jpg"
            />
            {errors.imageUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.imageUrl.message}
              </p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Enter a direct link to the ticket image (must end with .jpg, .jpeg, .png, .webp, or .gif)
            </p>
            {imageUrl && imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i) && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Image Preview:</p>
                <img
                  src={imageUrl}
                  alt="Ticket Preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    toast.error('Failed to load image. Please check the URL.');
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Vendor Email
            </label>
            <input
              type="email"
              value={user?.email}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={addTicketMutation.isPending}
            className="w-full bg-[#b35a44] hover:bg-[#d97757] text-white py-4 rounded-lg text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {addTicketMutation.isPending ? "Adding Ticket..." : "Add Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTicket;
