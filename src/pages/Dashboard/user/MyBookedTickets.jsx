import { useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Countdown from "react-countdown";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import { FaDownload, FaCreditCard, FaTimes, FaTrash } from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";
import TicketPDF from "../../../components/TicketPDF";
import { AuthContext } from "../../../providers/AuthProvider";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_your_key"
);

const CheckoutForm = ({ booking, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        toast.error(error.message);
        setProcessing(false);
        return;
      }

      const userId = localStorage.getItem("userId");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/payments`,
        {
          bookingId: booking._id,
          paymentDetails: {
            transactionId: paymentMethod.id,
            paymentMethodId: paymentMethod.id,
          },
        },
        { headers: { 'x-user-id': userId } }
      );

      toast.success("Payment successful!");
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Card Details
        </label>
        <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">
            Ticket Price:
          </span>
          <span className="font-semibold dark:text-white">
            ৳{booking.totalPrice / (booking.quantity || booking.bookingQuantity || 1)}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">Quantity:</span>
          <span className="font-semibold dark:text-white">
            {booking.quantity || booking.bookingQuantity}
          </span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
          <span className="dark:text-white">Total Amount:</span>
          <span className="text-primary">৳{booking.totalPrice}</span>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaCreditCard />
          <span>{processing ? "Processing..." : "Pay Now"}</span>
        </button>
      </div>
    </form>
  );
};

const MyBookedTickets = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelBooking, setCancelBooking] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["userBookings"],
    queryFn: async () => {
      // // console.log('🎫 Fetching user bookings...');
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        console.error('❌ No userId found in localStorage');
        throw new Error('User not authenticated');
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings/my-bookings`,
        { headers: { 'x-user-id': userId } }
      );
      
      // // console.log('📦 Bookings response:', response.data);
      // // console.log('✅ Found bookings:', response.data.bookings?.length || 0);
      
      // Backend returns { success: true, bookings: [...] }
      return response.data.bookings || [];
    },
  });

  // Cancel ticket function
  const handleCancelTicket = async () => {
    if (!cancelBooking) return;

    setCancelling(true);
    try {
      const userId = localStorage.getItem('userId');
      
      // // console.log('🗑️ Cancelling booking:', cancelBooking.bookingId || cancelBooking._id);
      
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/bookings/${cancelBooking._id}`,
        { headers: { 'x-user-id': userId } }
      );

      toast.success(`Booking ${cancelBooking.bookingId || 'ticket'} cancelled successfully!`);
      
      // Refresh the bookings list
      queryClient.invalidateQueries(['userBookings']);
      
      // Close modal and reset state
      setShowCancelModal(false);
      setCancelBooking(null);
    } catch (error) {
      console.error('❌ Error cancelling booking:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const downloadPDF = (booking) => {
    const doc = new jsPDF();

    // Header with company branding
    doc.setFillColor(9, 51, 91);
    doc.rect(0, 0, 210, 40, "F");

    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, "bold");
    doc.text("TicketBari", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text("Your Journey, Our Priority", 105, 30, { align: "center" });

    // Ticket title section
    doc.setFillColor(31, 160, 214);
    doc.rect(0, 45, 210, 15, "F");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, "bold");
    doc.text("E-TICKET", 105, 55, { align: "center" });

    // Ticket details box
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(15, 70, 180, 100);

    // Booking ID
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.setFont(undefined, "normal");
    doc.text("Booking ID:", 20, 80);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "bold");
    doc.text(booking.bookingId || booking._id, 60, 80);

    // Journey details
    doc.setFontSize(14);
    doc.setTextColor(9, 51, 91);
    doc.setFont(undefined, "bold");
    doc.text(booking.ticketId?.from || booking.ticketDetails?.fromLocation || "N/A", 20, 100);

    doc.setFontSize(12);
    doc.setTextColor(128, 128, 128);
    doc.text("→", 105, 100, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(9, 51, 91);
    doc.text(booking.ticketId?.to || booking.ticketDetails?.toLocation || "N/A", 190, 100, { align: "right" });

    // Transport type
    doc.setFontSize(10);
    doc.setTextColor(31, 160, 214);
    doc.setFont(undefined, "normal");
    doc.text(booking.ticketTitle, 20, 110);

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 115, 190, 115);

    // Passenger & ticket info
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "bold");
    doc.text("Passenger Name:", 20, 125);
    doc.setFont(undefined, "normal");
    doc.text(booking.userName, 65, 125);

    doc.setFont(undefined, "bold");
    doc.text("Number of Seats:", 20, 135);
    doc.setFont(undefined, "normal");
    doc.text(String(booking.quantity || booking.bookingQuantity || 0), 65, 135);

    doc.setFont(undefined, "bold");
    doc.text("Departure Date:", 20, 145);
    doc.setFont(undefined, "normal");
    const departureDate = new Date(booking.ticketId?.departureDate || booking.ticketDetails?.departureDateTime || Date.now());
    doc.text(
      departureDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      65,
      145
    );

    doc.setFont(undefined, "bold");
    doc.text("Departure Time:", 20, 155);
    doc.setFont(undefined, "normal");
    doc.text(
      departureDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      65,
      155
    );

    // Price box
    doc.setFillColor(240, 248, 255);
    doc.rect(15, 175, 180, 25, "F");
    doc.setDrawColor(31, 160, 214);
    doc.setLineWidth(1);
    doc.rect(15, 175, 180, 25);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "bold");
    doc.text("Total Fare:", 20, 188);

    doc.setFontSize(18);
    doc.setTextColor(9, 51, 91);
    doc.text(`৳${booking.totalPrice}`, 190, 190, { align: "right" });

    // Status badge
    const statusY = 210;
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");

    if (booking.status === "paid") {
      doc.setFillColor(34, 197, 94);
      doc.roundedRect(15, statusY, 30, 8, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.text("PAID", 17, statusY + 6);
    }

    // Footer
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 225, 195, 225);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, "normal");
    doc.text(
      "Please arrive at the departure point 15 minutes before departure time.",
      105,
      235,
      { align: "center" }
    );
    doc.text(
      "For any queries, contact: support@ticketbari.com | 0164516880",
      105,
      242,
      { align: "center" }
    );
    doc.text(
      "This is a computer-generated ticket and does not require a signature.",
      105,
      249,
      { align: "center" }
    );

    // Barcode placeholder
    doc.setFontSize(8);
    doc.text("Scan at boarding:", 105, 260, { align: "center" });
    doc.setFillColor(0, 0, 0);
    for (let i = 0; i < 40; i++) {
      const height = Math.random() > 0.5 ? 8 : 4;
      doc.rect(60 + i * 2.5, 265, 2, height, "F");
    }

    doc.save(`TicketBari-${booking._id}.pdf`);
    toast.success("Ticket downloaded successfully!");
  };

  const handlePaymentSuccess = () => {
    setPaymentBooking(null);
    queryClient.invalidateQueries(["userBookings"]);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Paid":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      // Legacy support for old status values
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "paid":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
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
    <div>
      <Helmet>
        <title>My Bookings - Uraan</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        My Booked Tickets
      </h1>

      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            You haven't booked any tickets yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={booking.ticketId?.imageUrl || booking.ticketDetails?.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                alt={booking.ticketTitle}
                className="w-full h-48 object-cover"
              />

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {booking.ticketTitle}
                  </h3>
                  {booking.bookingId && (
                    <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      {booking.bookingId}
                    </span>
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {booking.ticketId?.from || booking.ticketDetails?.fromLocation || 'N/A'} →{" "}
                  {booking.ticketId?.to || booking.ticketDetails?.toLocation || 'N/A'}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Quantity:
                    </span>
                    <span className="font-semibold dark:text-white">
                      {booking.quantity || booking.bookingQuantity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Total Price:
                    </span>
                    <span className="font-bold text-primary text-xl">
                      ৳{booking.totalPrice}
                    </span>
                  </div>
                </div>

                {booking.status !== "rejected" &&
                  booking.ticketId?.departureDate &&
                  new Date(booking.ticketId.departureDate) >
                    new Date() && (
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
                      <p className="text-sm text-center mb-2">
                        Time until departure:
                      </p>
                      <Countdown
                        date={new Date(booking.ticketId.departureDate)}
                        renderer={({ days, hours, minutes }) => (
                          <div className="text-center text-lg font-bold">
                            {days}d {hours}h {minutes}m
                          </div>
                        )}
                      />
                    </div>
                  )}

                {/* Status Badge and Action Buttons */}
                <div className="space-y-3">
                  {/* Status Badge */}
                  <div className="flex justify-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(booking.status)}`}
                    >
                      {booking.status || 'Pending'}
                    </span>
                  </div>

                  {/* Status Messages */}
                  {booking.status === 'Pending' && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                      <div className="flex items-center justify-center space-x-2 text-yellow-700 dark:text-yellow-300">
                        <div className="animate-pulse">⏳</div>
                        <span className="text-sm font-medium">Waiting for Admin Approval</span>
                      </div>
                    </div>
                  )}

                  {booking.status === 'Approved' && (
                    <div className="space-y-2">
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                        <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-300">
                          <span className="text-lg">✅</span>
                          <span className="text-sm font-medium">Booking Approved!</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setPaymentBooking(booking)}
                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 rounded-lg hover:from-green-600 hover:to-blue-600 transition font-semibold text-sm shadow-lg"
                      >
                        <FaCreditCard />
                        <span>Pay Now</span>
                      </button>
                    </div>
                  )}

                  {booking.status === 'Paid' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <div className="flex items-center justify-center space-x-2 text-blue-700 dark:text-blue-300">
                        <span className="text-lg">🎫</span>
                        <span className="text-sm font-medium">Payment Complete!</span>
                      </div>
                    </div>
                  )}

                  {booking.status === 'Cancelled' && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <div className="flex items-center justify-center space-x-2 text-red-700 dark:text-red-300">
                        <span className="text-lg">❌</span>
                        <span className="text-sm font-medium">Booking Rejected</span>
                      </div>
                    </div>
                  )}

                  {/* Always show Download PDF and Cancel buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <PDFDownloadLink
                      document={<TicketPDF booking={booking} />}
                      fileName={`uraan-ticket-${booking.bookingId || booking._id}.pdf`}
                      className="flex items-center justify-center space-x-2 bg-[#0f172a] text-white py-3 rounded-lg hover:bg-slate-700 transition font-semibold text-sm"
                    >
                      {({ loading }) => (
                        <>
                          <FaDownload className={loading ? 'animate-spin' : ''} />
                          <span>{loading ? 'Generating...' : 'Download PDF'}</span>
                        </>
                      )}
                    </PDFDownloadLink>
                    
                    <button
                      onClick={() => {
                        setCancelBooking(booking);
                        setShowCancelModal(true);
                      }}
                      className="flex items-center justify-center space-x-2 border-2 border-[#b35a44] text-[#b35a44] py-3 rounded-lg hover:bg-[#b35a44] hover:text-white transition font-semibold text-sm"
                    >
                      <FaTrash />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Modal */}
      {paymentBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Complete Payment
            </h3>

            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={paymentBooking.ticketId?.imageUrl || paymentBooking.ticketDetails?.image || 'https://via.placeholder.com/80x80?text=No+Image'}
                  alt={paymentBooking.ticketTitle}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <p className="font-semibold dark:text-white">
                    {paymentBooking.ticketTitle}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {paymentBooking.ticketId?.from || paymentBooking.ticketDetails?.fromLocation || 'N/A'} →{" "}
                    {paymentBooking.ticketId?.to || paymentBooking.ticketDetails?.toLocation || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <Elements stripe={stripePromise}>
              <CheckoutForm
                booking={paymentBooking}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setPaymentBooking(null)}
              />
            </Elements>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && cancelBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Cancel Booking
              </h3>
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
              >
                <FaTimes className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                  ⚠️ Warning: This action cannot be undone
                </p>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to cancel this booking?
              </p>
              
              <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                <p className="font-semibold text-gray-800 dark:text-white mb-1">
                  {cancelBooking.ticketTitle}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {cancelBooking.ticketId?.from || 'N/A'} → {cancelBooking.ticketId?.to || 'N/A'}
                </p>
                <p className="text-sm font-mono text-blue-600 dark:text-blue-400">
                  Booking ID: {cancelBooking.bookingId || cancelBooking._id?.slice(-8)}
                </p>
                <p className="text-lg font-bold text-[#b35a44] mt-2">
                  ৳{cancelBooking.totalPrice}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelTicket}
                disabled={cancelling}
                className="flex-1 px-6 py-3 bg-[#b35a44] hover:bg-[#a04d39] text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {cancelling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <>
                    <FaTrash />
                    <span>Cancel Booking</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Cancel Confirmation Modal */}
      {showCancelModal && cancelBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Cancel Booking
              </h3>
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
              >
                <FaTimes className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                  ⚠️ Warning: This action cannot be undone
                </p>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to cancel this booking?
              </p>
              
              <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                <p className="font-semibold text-gray-800 dark:text-white mb-1">
                  {cancelBooking.ticketTitle}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {cancelBooking.ticketId?.from || 'N/A'} → {cancelBooking.ticketId?.to || 'N/A'}
                </p>
                <p className="text-sm font-mono text-blue-600 dark:text-blue-400">
                  Booking ID: {cancelBooking.bookingId || cancelBooking._id?.slice(-8)}
                </p>
                <p className="text-lg font-bold text-[#b35a44] mt-2">
                  ৳{cancelBooking.totalPrice}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelTicket}
                disabled={cancelling}
                className="flex-1 px-6 py-3 bg-[#b35a44] hover:bg-[#a04d39] text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {cancelling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <>
                    <FaTrash />
                    <span>Cancel Booking</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}    </div>
  );
};

export default MyBookedTickets;

