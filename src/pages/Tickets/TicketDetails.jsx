import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import api from "../../config/api";
import Countdown from "react-countdown";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../../providers/AuthProvider";

import {
  FaBus,
  FaTrain,
  FaShip,
  FaPlane,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaChair,
  FaStar,
  FaUserTie,
  FaEnvelope,
  FaTimes,
} from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import toast from "react-hot-toast";
import PaymentModal from "../../components/PaymentModal";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingQuantity, setBookingQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [pendingBookingData, setPendingBookingData] = useState(null);

  useEffect(() => {
    fetchTicket();
    fetchUserRole();
  }, [id]);

  const fetchUserRole = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${user.email}`,
        {
          headers: {
            'x-user-id': userId,
          },
        }
      );
      setUserRole(response.data.role || "user");
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole("user");
    }
  };

  const fetchTicket = async () => {
    try {
      console.log('🎫 Fetching ticket details for ID:', id);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/tickets/${id}`
      );
      console.log('📦 Ticket Details Response:', response.data);
      
      // Backend returns { success: true, ticket: {...} }
      setTicket(response.data.ticket || response.data);
      console.log('✅ Ticket loaded successfully');
    } catch (error) {
      console.error("❌ Error fetching ticket:", error);
      console.error("Error details:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to load ticket details");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!user) {
      toast.error("Please login to book tickets");
      navigate("/login");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User session not found. Please login again.");
      navigate("/login");
      return;
    }

    if (userRole === "admin") {
      toast.error("Admin cannot book tickets!");
      return;
    }

    if (userRole === "vendor") {
      toast.error("Vendor cannot book tickets!");
      return;
    }

    if (bookingQuantity < 1 || bookingQuantity > ticket.quantity) {
      toast.error(`Please enter a valid quantity (1-${ticket.quantity})`);
      return;
    }

    // Prepare booking data and show payment modal
    const totalPrice = ticket.pricePerUnit * bookingQuantity;
    const bookingData = {
      ticketId: ticket._id,
      ticketTitle: ticket.title,
      quantity: bookingQuantity,
      totalPrice,
      userName: user?.displayName || user?.name || "Anonymous",
      userEmail: user?.email,
      vendorId: ticket.vendorId,
    };

    setPendingBookingData(bookingData);
    setShowModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentData) => {
    setSubmitting(true);
    try {
      const userId = localStorage.getItem("userId");

      console.log('📝 Creating booking with payment data:', paymentData);

      // Step 1: Create the booking
      const bookingResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings`,
        paymentData,
        { headers: { 'x-user-id': userId } }
      );

      console.log('✅ Booking created successfully:', bookingResponse.data);
      console.log('🎫 Booking ID:', bookingResponse.data.booking?.bookingId);

      // Step 2: Confirm the booking and create transaction record
      const confirmationData = {
        bookingId: bookingResponse.data.booking._id,
        paymentMethod: paymentData.paymentMethod
      };

      console.log('💳 Confirming booking payment:', confirmationData);

      const confirmResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings/confirm`,
        confirmationData,
        { headers: { 'x-user-id': userId } }
      );

      console.log('✅ Booking confirmed and transaction recorded:', confirmResponse.data);
      
      setBookingQuantity(1);
      setPendingBookingData(null);
      navigate("/dashboard/user/bookings");
      
      return bookingResponse.data; // Return response for PaymentModal to extract bookingId
    } catch (error) {
      console.error('❌ Booking error:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || "Failed to book ticket");
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const getTransportIcon = (type) => {
    const iconClass = "text-5xl";
    switch (type?.toLowerCase()) {
      case "bus":
        return <FaBus className={iconClass} />;
      case "train":
        return <FaTrain className={iconClass} />;
      case "launch":
        return <FaShip className={iconClass} />;
      case "plane":
        return <FaPlane className={iconClass} />;
      default:
        return <FaBus className={iconClass} />;
    }
  };

  const getTransportColor = (type) => {
    switch (type?.toLowerCase()) {
      case "bus":
        return "from-blue-500 to-cyan-500";
      case "train":
        return "from-purple-500 to-pink-500";
      case "launch":
        return "from-teal-500 to-emerald-500";
      case "plane":
        return "from-orange-500 to-red-500";
      default:
        return "from-blue-500 to-purple-600";
    }
  };

  // Create proper departure datetime from date and time fields
  const getDepartureDateTime = () => {
    if (!ticket?.departureDate || !ticket?.departureTime) return null;
    
    try {
      // Convert date to YYYY-MM-DD format if needed
      const dateStr = ticket.departureDate.split('T')[0];
      // Combine date and time
      const dateTimeStr = `${dateStr}T${ticket.departureTime}`;
      const departureDateTime = new Date(dateTimeStr);
      
      // Check if date is valid
      if (isNaN(departureDateTime.getTime())) {
        console.warn('Invalid departure datetime:', dateTimeStr);
        return null;
      }
      
      return departureDateTime;
    } catch (error) {
      console.error('Error parsing departure datetime:', error);
      return null;
    }
  };

  const isDepartureTimePassed = () => {
    const departureDateTime = getDepartureDateTime();
    if (!departureDateTime) return false;
    return departureDateTime < new Date();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Ticket not found
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 mt-20">
      <Helmet>
        <title>{ticket?.ticketTitle || "Ticket Details"} - Uraan</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 dark:text-gray-300 hover:scale-105"
        >
          <IoArrowBack />
          <span>Back</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500">
              <div className="relative">
                <img
                  src={ticket.imageUrl}
                  alt={ticket.title}
                  className="w-full h-96 object-cover"
                />
                <div
                  className={`absolute top-4 right-4 bg-gradient-to-r ${getTransportColor(
                    ticket.transportType
                  )} p-4 rounded-2xl shadow-2xl text-white backdrop-blur-sm bg-opacity-90`}
                >
                  {getTransportIcon(ticket.transportType)}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    {ticket.title}
                  </h1>
                  <div className="flex items-center gap-2 text-white/90">
                    <FaStar className="text-yellow-400" />
                    <span className="text-lg font-semibold">
                      {ticket.transportType}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                <FaMapMarkerAlt className="text-blue-500" />
                Journey Route
              </h2>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    From
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {ticket.from}
                  </p>
                </div>
                <div className="px-6">
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full relative">
                    <div className="absolute -right-2 -top-2 w-5 h-5 bg-purple-600 rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    To
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {ticket.to}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                <FaCalendarAlt className="text-purple-500" />
                Departure Details
              </h2>
              <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-2xl">
                <FaClock className="text-4xl text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Departure Time
                  </p>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    {(() => {
                      const departureDateTime = getDepartureDateTime();
                      if (!departureDateTime) return 'TBA';
                      
                      return departureDateTime.toLocaleString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long", 
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      );
                    })()}
                  </p>
                </div>
              </div>
            </div>

            {!isDepartureTimePassed() && (
              <div
                className={`bg-gradient-to-r ${getTransportColor(
                  ticket.transportType
                )} rounded-3xl shadow-2xl p-8 text-white hover:scale-105 transition-all duration-300`}
              >
                <p className="text-center text-xl font-semibold mb-4">
                  ⏰ Time Until Departure
                </p>
                {(() => {
                  const departureDateTime = getDepartureDateTime();
                  if (!departureDateTime) {
                    return (
                      <div className="text-center text-2xl font-semibold">
                        Departure time to be announced
                      </div>
                    );
                  }
                  
                  return (
                    <Countdown
                      date={departureDateTime}
                      renderer={({ days, hours, minutes, seconds, completed }) => {
                        if (completed) {
                          return (
                            <div className="text-center text-2xl font-semibold">
                              🚀 Departure Time Reached!
                            </div>
                          );
                        }
                        
                        return (
                          <div className="grid grid-cols-4 gap-4">
                            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center hover:bg-white/30 transition-all">
                              <p className="text-4xl lg:text-5xl font-bold">{days || 0}</p>
                              <p className="text-sm mt-2 font-medium">Days</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center hover:bg-white/30 transition-all">
                              <p className="text-4xl lg:text-5xl font-bold">
                                {hours || 0}
                              </p>
                              <p className="text-sm mt-2 font-medium">Hours</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center hover:bg-white/30 transition-all">
                              <p className="text-4xl lg:text-5xl font-bold">
                                {minutes || 0}
                              </p>
                              <p className="text-sm mt-2 font-medium">Minutes</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center hover:bg-white/30 transition-all">
                              <p className="text-4xl lg:text-5xl font-bold">
                                {seconds || 0}
                              </p>
                              <p className="text-sm mt-2 font-medium">Seconds</p>
                            </div>
                          </div>
                        );
                      }}
                    />
                  );
                })()}
              </div>
            )}

            {ticket.perks && ticket.perks.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                  Included Perks
                </h2>
                <div className="flex flex-wrap gap-3">
                  {ticket.perks.map((perk, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-800 dark:text-blue-200 px-5 py-3 rounded-xl text-sm font-semibold hover:scale-110 transition-all duration-300 shadow-md"
                    >
                      {perk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                <FaUserTie className="text-green-500" />
                Vendor Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 p-5 rounded-2xl">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                    <FaUserTie className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Vendor Name
                    </p>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">
                      {ticket.vendorName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 p-5 rounded-2xl">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white">
                    <FaEnvelope className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Contact Email
                    </p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      {ticket.vendorEmail}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Price per ticket
                      </p>
                    </div>
                    <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ৳{ticket.pricePerUnit}
                    </p>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <FaChair className="text-3xl text-blue-500" />
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Available Seats
                      </p>
                    </div>
                    <p className="text-4xl font-bold text-gray-800 dark:text-white">
                      {ticket.quantity}
                    </p>
                    {ticket.quantity < 10 &&
                      ticket.quantity > 0 && (
                        <p className="text-sm text-orange-500 mt-2 font-semibold">
                          ⚠️ Only {ticket.quantity} seats left!
                        </p>
                      )}
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>

                  <button
                    onClick={() => setShowModal(true)}
                    disabled={
                      isDepartureTimePassed() ||
                      ticket.quantity === 0 ||
                      userRole === "admin" ||
                      userRole === "vendor"
                    }
                    className={`w-full py-5 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                      isDepartureTimePassed() ||
                      ticket.quantity === 0 ||
                      userRole === "admin" ||
                      userRole === "vendor"
                        ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        : `bg-gradient-to-r ${getTransportColor(
                            ticket.transportType
                          )} text-white hover:shadow-2xl`
                    }`}
                  >
                    {userRole === "admin"
                      ? "🚫 Admin Cannot Book"
                      : userRole === "vendor"
                      ? "🚫 Vendor Cannot Book"
                      : isDepartureTimePassed()
                      ? "🚫 Departure Time Passed"
                      : ticket.quantity === 0
                      ? "Sold Out"
                      : "Book Now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
            >
              <FaTimes className="text-gray-500 dark:text-gray-400 text-lg" />
            </button>

            <h3 className="text-2xl font-bold text-[#09335b]   flex items-center gap-2 mb-4">
              Complete Booking
            </h3>

            <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Selected Ticket
              </p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">
                {ticket.title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {ticket.from} → {ticket.to}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Number of Tickets
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setBookingQuantity(Math.max(1, bookingQuantity - 1))
                  }
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={ticket.quantity}
                  value={bookingQuantity}
                  onChange={(e) =>
                    setBookingQuantity(
                      Math.min(
                        ticket.quantity,
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    )
                  }
                  className="flex-1 px-3 py-1 text-center border rounded-lg dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() =>
                    setBookingQuantity(
                      Math.min(ticket.quantity, bookingQuantity + 1)
                    )
                  }
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg font-bold"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                Max {ticket.quantity} tickets available
              </p>
            </div>

            <div className="mb-4 p-4 bg-[linear-gradient(159deg,#377CBD_0%,#09335B_50%,#09335B_100%)] text-white rounded-2xl shadow-inner">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/80">Price per ticket:</span>
                <span className="font-semibold">৳{ticket.pricePerUnit}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/80">Quantity:</span>
                <span className="font-semibold">× {bookingQuantity}</span>
              </div>
              <div className="h-px bg-white/30 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total Amount:</span>
                <span className="text-xl font-bold">
                  ৳{(ticket.pricePerUnit * bookingQuantity).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleBooking}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-[#09335b] text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && pendingBookingData && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setShowModal(true);
          }}
          bookingData={pendingBookingData}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default TicketDetails;
