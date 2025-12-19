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
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePaymentForm, { CheckoutForm } from '../../components/StripePaymentForm';
import { X } from 'lucide-react';

// Initialize Stripe - replace with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showStripePayment, setShowStripePayment] = useState(false);
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
    // Use Stripe payment instead of dummy payment modal
    setShowStripePayment(true);
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

  const handleStripePaymentSuccess = async (paymentIntent) => {
    setSubmitting(true);
    try {
      const userId = localStorage.getItem("userId");
      
      console.log('🎉 Stripe payment successful, creating booking...');
      console.log('💳 Payment Intent ID:', paymentIntent.id);

      // Create the booking with Stripe payment method
      const bookingData = {
        ...pendingBookingData,
        paymentMethod: 'Stripe',
        stripePaymentIntentId: paymentIntent.id,
        transactionId: paymentIntent.id
      };

      const bookingResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings`,
        bookingData,
        { headers: { 'x-user-id': userId } }
      );

      console.log('✅ Stripe booking created successfully:', bookingResponse.data);
      
      // Confirm booking and record transaction
      const confirmationData = {
        bookingId: bookingResponse.data.booking._id,
        paymentMethod: 'Stripe',
        stripePaymentIntentId: paymentIntent.id
      };

      const confirmResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings/confirm`,
        confirmationData,
        { headers: { 'x-user-id': userId } }
      );

      console.log('✅ Stripe booking confirmed:', confirmResponse.data);
      
      toast.success(`Payment successful! Booking ID: ${bookingResponse.data.booking?.bookingId}`, { duration: 5000 });
      
      setBookingQuantity(1);
      setPendingBookingData(null);
      setShowStripePayment(false);
      navigate("/dashboard/user/bookings");
      
    } catch (error) {
      console.error('❌ Stripe booking error:', error);
      toast.error(error.response?.data?.message || "Failed to complete booking after payment");
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
            {/* Modern Glassmorphic Boarding Pass */}
            <div className="relative bg-slate-900/40 backdrop-blur-xl border border-transparent bg-gradient-to-r from-[#b35a44]/20 via-transparent to-blue-500/20 p-[1px] rounded-3xl hover:scale-[1.02] transition-all duration-500 shadow-2xl">
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 h-full">
                <div className="flex flex-col lg:flex-row h-full">
                  
                  {/* Left Side - Main Ticket Info */}
                  <div className="flex-1 lg:pr-8">
                    {/* Transport Icon & Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${getTransportColor(ticket.transportType)} shadow-lg`}>
                          <div className="text-white text-4xl">
                            {getTransportIcon(ticket.transportType)}
                          </div>
                        </div>
                        <div>
                          <p className="text-slate-300 text-sm font-medium">TRANSPORT</p>
                          <p className="text-white text-xl font-bold uppercase tracking-wide">
                            {ticket.transportType}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-slate-800/50 backdrop-blur-sm rounded-full text-slate-300 text-xs font-mono border border-slate-600/30">
                        TICKET
                      </span>
                    </div>

                    {/* Title */}
                    <div className="mb-6">
                      <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                        {ticket.title}
                      </h1>
                    </div>

                    {/* Route Information */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <p className="text-slate-400 text-xs font-medium mb-1">FROM</p>
                          <p className="text-white text-xl lg:text-2xl font-bold">{ticket.from}</p>
                        </div>
                        <div className="flex-1 flex items-center justify-center px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#b35a44] shadow-lg shadow-[#b35a44]/50"></div>
                            <div className="flex-1 h-px bg-gradient-to-r from-[#b35a44] to-blue-500"></div>
                            <FaPlane className="text-slate-300 transform rotate-90" />
                            <div className="flex-1 h-px bg-gradient-to-r from-blue-500 to-[#b35a44]"></div>
                            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-slate-400 text-xs font-medium mb-1">TO</p>
                          <p className="text-white text-xl lg:text-2xl font-bold">{ticket.to}</p>
                        </div>
                      </div>
                    </div>

                    {/* Departure Information */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                        <p className="text-slate-400 text-xs font-medium mb-1">DEPARTURE</p>
                        <p className="text-white font-bold text-sm">
                          {(() => {
                            const departureDateTime = getDepartureDateTime();
                            if (!departureDateTime) return 'TBA';
                            return departureDateTime.toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"
                            }) + ' - ' + departureDateTime.toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false
                            });
                          })()}
                        </p>
                      </div>
                      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                        <p className="text-slate-400 text-xs font-medium mb-1">AVAILABLE</p>
                        <p className="text-white font-bold text-sm">
                          {ticket.quantity} Seats
                        </p>
                      </div>
                    </div>

                    {/* Amenities */}
                    {ticket.perks && ticket.perks.length > 0 && (
                      <div>
                        <p className="text-slate-400 text-xs font-medium mb-3">AMENITIES</p>
                        <div className="flex flex-wrap gap-2">
                          {ticket.perks.map((perk, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-full text-slate-300 text-xs font-medium"
                            >
                              {perk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Vertical Dashed Line (Perforation Effect) */}
                  <div className="hidden lg:block w-px mx-6">
                    <div className="h-full border-l-2 border-dashed border-slate-600/50"></div>
                  </div>
                  
                  {/* Mobile Horizontal Dashed Line */}
                  <div className="lg:hidden w-full my-6">
                    <div className="w-full border-t-2 border-dashed border-slate-600/50"></div>
                  </div>

                  {/* Right Side - Ticket Stub */}
                  <div className="lg:w-80">
                    <div className="text-center mb-6">
                      <p className="text-slate-400 text-xs font-medium mb-2">BOOKING ID</p>
                      <div className="bg-slate-800/40 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-600/30">
                        <p className="text-white font-mono text-lg font-bold tracking-wider">
                          UR-{ticket._id?.slice(-6).toUpperCase() || 'XXXXXX'}
                        </p>
                      </div>
                    </div>

                    <div className="text-center mb-8">
                      <p className="text-slate-400 text-xs font-medium mb-2">PRICE PER TICKET</p>
                      <div className="bg-gradient-to-r from-[#b35a44] to-blue-500 p-[1px] rounded-2xl">
                        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl px-6 py-4">
                          <p className="text-white text-2xl lg:text-3xl font-bold">
                            ৳{ticket.pricePerUnit?.toLocaleString() || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowModal(true)}
                      disabled={
                        !user ||
                        userRole === "admin" ||
                        userRole === "vendor" ||
                        isDepartureTimePassed() ||
                        ticket.quantity === 0
                      }
                      className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg ${
                        !user ||
                        userRole === "admin" ||
                        userRole === "vendor" ||
                        isDepartureTimePassed() ||
                        ticket.quantity === 0
                          ? "bg-slate-700/50 text-slate-500 cursor-not-allowed border border-slate-600/30"
                          : "bg-gradient-to-r from-[#b35a44] to-blue-500 text-white hover:shadow-xl hover:scale-105 shadow-[#b35a44]/20"
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
                        : "Confirm Booking"}
                    </button>

                    <div className="mt-4 text-center">
                      <p className="text-slate-500 text-xs">
                        Secure booking with Uraan
                      </p>
                    </div>
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
              <div className="bg-slate-900/40 backdrop-blur-xl border border-[#b35a44]/20 rounded-3xl shadow-2xl p-8 hover:scale-105 transition-all duration-300">
                <p className="text-center text-xl font-semibold mb-6 text-white flex items-center justify-center gap-2">
                  ⏰ Time Until Departure
                </p>
                {(() => {
                  const departureDateTime = getDepartureDateTime();
                  if (!departureDateTime) {
                    return (
                      <div className="text-center text-2xl font-semibold text-slate-300">
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
                            <div className="text-center text-2xl font-semibold text-white">
                              🚀 Departure Time Reached!
                            </div>
                          );
                        }
                        
                        // Ensure values are numbers and not NaN
                        const displayDays = isNaN(days) ? 0 : days;
                        const displayHours = isNaN(hours) ? 0 : hours;
                        const displayMinutes = isNaN(minutes) ? 0 : minutes;
                        const displaySeconds = isNaN(seconds) ? 0 : seconds;
                        
                        return (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-600/30 rounded-2xl p-4 text-center hover:bg-slate-700/50 transition-all">
                              <p className="text-3xl lg:text-4xl font-bold text-white drop-shadow-[0_0_8px_rgba(179,90,68,0.8)]">
                                {displayDays}
                              </p>
                              <p className="text-xs mt-2 font-medium text-slate-300">Days</p>
                            </div>
                            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-600/30 rounded-2xl p-4 text-center hover:bg-slate-700/50 transition-all">
                              <p className="text-3xl lg:text-4xl font-bold text-white drop-shadow-[0_0_8px_rgba(179,90,68,0.8)]">
                                {displayHours}
                              </p>
                              <p className="text-xs mt-2 font-medium text-slate-300">Hours</p>
                            </div>
                            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-600/30 rounded-2xl p-4 text-center hover:bg-slate-700/50 transition-all">
                              <p className="text-3xl lg:text-4xl font-bold text-white drop-shadow-[0_0_8px_rgba(179,90,68,0.8)]">
                                {displayMinutes}
                              </p>
                              <p className="text-xs mt-2 font-medium text-slate-300">Minutes</p>
                            </div>
                            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-600/30 rounded-2xl p-4 text-center hover:bg-slate-700/50 transition-all">
                              <p className="text-3xl lg:text-4xl font-bold text-white drop-shadow-[0_0_8px_rgba(179,90,68,0.8)]">
                                {displaySeconds}
                              </p>
                              <p className="text-xs mt-2 font-medium text-slate-300">Seconds</p>
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

      {/* Stripe Payment Modal */}
      {showStripePayment && pendingBookingData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f172a] rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-800 relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Complete Payment</h2>
              <button
                onClick={() => {
                  setShowStripePayment(false);
                  setShowModal(true);
                }}
                disabled={submitting}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Booking Summary */}
            <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
              <h3 className="font-semibold text-white mb-3">{pendingBookingData.ticketTitle}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Price per ticket:</span>
                  <span>৳{(pendingBookingData.totalPrice / pendingBookingData.quantity).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Quantity:</span>
                  <span>× {pendingBookingData.quantity}</span>
                </div>
                <div className="h-px bg-slate-600 my-2"></div>
                <div className="flex justify-between text-white font-bold">
                  <span>Total Amount:</span>
                  <span>৳{pendingBookingData.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Stripe Payment Form */}
            <Elements stripe={stripePromise}>
              <CheckoutForm
                amount={pendingBookingData.totalPrice}
                currency="BDT"
                bookingData={pendingBookingData}
                onSuccess={(result) => {
                  console.log('💳 Payment result:', result);
                  handleStripePaymentSuccess(result.paymentIntent);
                }}
                onCancel={() => {
                  setShowStripePayment(false);
                  setShowModal(true);
                }}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetails;
