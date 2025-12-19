import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FaCreditCard, 
  FaLock, 
  FaSpinner, 
  FaTimes,
  FaCheckCircle,
  FaDownload
} from 'react-icons/fa';
import { CreditCard, Shield } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import TicketPDF from './TicketPDF';

// Initialize Stripe
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

// Debug Stripe key loading
if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
  console.error('❌ VITE_STRIPE_PUBLISHABLE_KEY is not set in environment variables');
} else {
  // // console.log('✅ Stripe publishable key loaded:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY.substring(0, 20) + '...');
}

// High-Visibility Slate & Clay theme styles for CardElement
const cardElementOptions = {
  style: {
    base: {
      fontSize: '18px',
      color: '#ffffff', // Pure white for maximum visibility
      backgroundColor: 'transparent',
      fontFamily: 'inherit',
      fontSmoothing: 'antialiased',
      fontWeight: '700',
      letterSpacing: '0.75px',
      lineHeight: '28px',
      '::placeholder': {
        color: '#94a3b8', // Brighter slate-400 for placeholders
        fontWeight: '500',
      },
      iconColor: '#b35a44',
      ':focus': {
        color: '#ffffff',
      },
      ':hover': {
        color: '#ffffff',
      },
    },
    invalid: {
      color: '#ffffff', // Pure white even when invalid
      iconColor: '#ef4444',
      fontWeight: '700',
    },
    complete: {
      color: '#ffffff', // Pure white when complete
      iconColor: '#10b981',
      fontWeight: '700',
    },
  },
  hidePostalCode: false,
  iconStyle: 'solid',
};

const CheckoutForm = ({ 
  amount, 
  currency = 'usd', 
  bookingData = null, 
  onSuccess, 
  onCancel 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState('');
  const [paymentData, setPaymentData] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const handleDownloadPDF = async () => {
    if (!paymentData || !paymentData.booking) {
      toast.error('Booking information not available');
      return;
    }

    setDownloadingPdf(true);
    try {
      const booking = paymentData.booking;
      
      // Generate PDF
      const pdfDocument = (
        <TicketPDF 
          booking={{
            _id: booking._id,
            from: booking.ticketId?.from || 'N/A',
            to: booking.ticketId?.to || 'N/A',
            busName: booking.ticketId?.busName || 'N/A',
            departureTime: booking.ticketId?.departureTime || 'N/A',
            arrivalTime: booking.ticketId?.arrivalTime || 'N/A',
            date: booking.travelDate,
            seatNumbers: booking.seatNumbers || [],
            price: booking.totalPrice,
            userName: booking.userId?.name || 'N/A',
            userEmail: booking.userId?.email || 'N/A',
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            transactionId: paymentData.transaction?._id || 'N/A',
          }}
        />
      );

      const blob = await pdf(pdfDocument).toBlob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket-${booking._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      const errorMsg = 'Stripe is not loaded yet. Please check your internet connection and try again.';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (processing || succeeded) return;

    setProcessing(true);
    setError('');

    try {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Step 1: Create Payment Intent
      // // console.log('🏦 Creating payment intent...');
      
      const paymentIntentResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/payments/create-intent`,
        {
          amount: amount,
          currency: currency,
          bookingId: bookingData?.bookingId || null,
        },
        {
          headers: { 
            'x-user-id': userId,
            'Content-Type': 'application/json'
          }
        }
      );

      const { clientSecret, paymentIntentId } = paymentIntentResponse.data;

      // Step 2: Confirm Card Payment
      // // console.log('💳 Confirming card payment...');
      const cardElement = elements.getElement(CardElement);
      
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: bookingData?.userName || 'Customer',
            email: bookingData?.userEmail || '',
          },
        },
      });

      if (result.error) {
        // Handle card errors
        console.error('❌ Payment failed:', result.error);
        setError(result.error.message);
        
        // Show specific error messages
        switch (result.error.code) {
          case 'card_declined':
            toast.error('Your card was declined. Please try another card or contact your bank.');
            break;
          case 'insufficient_funds':
            toast.error('Your card has insufficient funds. Please try another payment method.');
            break;
          case 'expired_card':
            toast.error('Your card has expired. Please use a different card.');
            break;
          case 'incorrect_cvc':
            toast.error('Your card security code is incorrect. Please check and try again.');
            break;
          default:
            toast.error(result.error.message || 'Payment failed. Please try again.');
        }
      } else {
        // Payment succeeded
        // // console.log('✅ Payment succeeded:', result.paymentIntent);
        setSucceeded(true);
        toast.success('Payment successful!');

        // Step 3: Confirm payment on backend and update booking/transaction
        try {
          const confirmResponse = await axios.post(
            `${import.meta.env.VITE_API_URL}/payments/confirm`,
            {
              paymentIntentId: result.paymentIntent.id,
              bookingId: bookingData?.bookingId || null,
              paymentMethod: 'Stripe',
            },
            {
              headers: { 
                'x-user-id': userId,
                'Content-Type': 'application/json'
              }
            }
          );

          // // console.log('📊 Payment confirmed on backend:', confirmResponse.data);

          // Store payment data for PDF generation
          setPaymentData({
            paymentIntent: result.paymentIntent,
            transaction: confirmResponse.data.transaction,
            booking: confirmResponse.data.booking,
          });

          // Call success callback
          if (onSuccess) {
            onSuccess({
              paymentIntent: result.paymentIntent,
              transaction: confirmResponse.data.transaction,
              booking: confirmResponse.data.booking,
            });
          }

        } catch (confirmError) {
          console.error('❌ Error confirming payment on backend:', confirmError);
          toast.error('Payment successful but failed to update records. Please contact support.');
        }
      }

    } catch (err) {
      console.error('❌ Payment error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Payment failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Input */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-3">
            <CreditCard className="w-4 h-4 text-[#b35a44]" />
            Card Details
          </label>
          
          <div className="relative">
            <div className="p-5 bg-slate-900/90 border border-slate-700/50 rounded-xl focus-within:border-[#b35a44] focus-within:ring-1 focus-within:ring-[#b35a44] transition-all duration-200 min-h-[56px] shadow-inner">
              <CardElement options={cardElementOptions} />
            </div>
            
            {/* Card Icons */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 pointer-events-none">
              <FaCreditCard className="text-slate-400 text-sm" />
            </div>
          </div>
        </div>

        {/* Amount Display */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-300 text-sm">Amount to pay:</span>
            <span className="text-xl font-bold text-white">
              {currency.toUpperCase() === 'BDT' ? '৳' : '$'}
              {amount.toLocaleString()}
            </span>
          </div>
          
          {bookingData && (
            <div className="mt-3 pt-3 border-t border-slate-700">
              <div className="text-sm text-slate-400">
                <p className="font-medium text-slate-200 mb-1">{bookingData.ticketTitle}</p>
                <p>Quantity: {bookingData.quantity} × {currency.toUpperCase() === 'BDT' ? '৳' : '$'}{(amount / bookingData.quantity).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-600 rounded-xl p-4 flex items-start space-x-3">
            <FaTimes className="text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-400 font-medium">Payment Error</p>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Success Display */}
        {succeeded && (
          <div className="bg-green-900/20 border border-green-600 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-4">
              <FaCheckCircle className="text-green-400 text-xl" />
              <div>
                <p className="text-green-400 font-medium">Payment Successful!</p>
                <p className="text-green-300 text-sm">Your payment has been processed successfully.</p>
              </div>
            </div>
            
            {/* Download PDF Button */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={downloadingPdf}
              className="w-full px-6 py-3 bg-[#b35a44] hover:bg-[#a04d39] text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {downloadingPdf ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <FaDownload />
                  <span>Download Ticket PDF</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={processing || succeeded}
            className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={!stripe || processing || succeeded}
            className="flex-1 px-6 py-3 bg-[#b35a44] hover:bg-[#a04d39] text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {processing ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : succeeded ? (
              <>
                <FaCheckCircle />
                <span>Paid</span>
              </>
            ) : (
              <>
                <FaLock />
                <span>Pay {currency.toUpperCase() === 'BDT' ? '৳' : '$'}{amount.toLocaleString()}</span>
              </>
            )}
          </button>
        </div>

        {/* Security Notice */}
        <div className="flex items-center justify-center space-x-2 text-slate-400 text-xs">
          <Shield className="w-4 h-4" />
          <span>Secured by Stripe • Your payment information is encrypted</span>
        </div>
      </form>
    </div>
  );
};

// Main StripePaymentForm Component
const StripePaymentForm = ({ 
  amount, 
  currency = 'usd', 
  bookingData = null, 
  isOpen = true, 
  onSuccess, 
  onCancel,
  title = 'Complete Payment'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative overflow-hidden">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#b35a44]/5 to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#b35a44] rounded-xl flex items-center justify-center">
                <FaCreditCard className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <p className="text-slate-400 text-sm">Enter your card details below</p>
              </div>
            </div>
            
            <button
              onClick={onCancel}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <FaTimes className="text-slate-400 hover:text-white" />
            </button>
          </div>

          {/* Stripe Elements Provider */}
          <Elements stripe={stripePromise}>
            <CheckoutForm
              amount={amount}
              currency={currency}
              bookingData={bookingData}
              onSuccess={onSuccess}
              onCancel={onCancel}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default StripePaymentForm;
export { CheckoutForm };
