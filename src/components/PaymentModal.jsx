import { useState } from "react";
import { X, CreditCard, Smartphone, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const PaymentModal = ({ isOpen, onClose, bookingData, onPaymentSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [pin, setPin] = useState("");
  const [processing, setProcessing] = useState(false);

  const paymentMethods = [
    {
      id: "bkash",
      name: "bKash",
      type: "mobile",
      logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMTAiIGZpbGw9IiNFMjEzNkUiLz4KPHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeD0iMTAiIHk9IjEwIj4KPHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSI+Cjx0ZXh0IHg9IjQwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Ykthc2g8L3RleHQ+Cjwvc3ZnPgo8L3N2Zz4KPC9zdmc+",
      color: "#E2136E",
    },
    {
      id: "nagad",
      name: "Nagad",
      type: "mobile",
      logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMTAiIGZpbGw9IiNFRTQwMjMiLz4KPHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeD0iMTAiIHk9IjEwIj4KPHRleHQgeD0iNDAiIHk9IjQ1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5OYWdhZDwvdGV4dD4KPC9zdmc+Cjwvc3ZnPg==",
      color: "#EE4023",
    },
    {
      id: "visa",
      name: "Visa",
      type: "card",
      logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMTAiIGZpbGw9IiMxQTFGNzEiLz4KPHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeD0iMTAiIHk9IjEwIj4KPHRleHQgeD0iNDAiIHk9IjQ1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5WSVNBPC90ZXh0Pgo8L3N2Zz4KPC9zdmc+",
      color: "#1A1F71",
    },
    {
      id: "mastercard",
      name: "Mastercard",
      type: "card",
      logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMTAiIGZpbGw9IiNFQjAwMUIiLz4KPHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeD0iMTAiIHk9IjEwIj4KPGNpcmNsZSBjeD0iMjgiIGN5PSI0MCIgcj0iMTgiIGZpbGw9IiNGRkYiIG9wYWNpdHk9IjAuMyIvPgo8Y2lyY2xlIGN4PSI1MiIgY3k9IjQwIiByPSIxOCIgZmlsbD0iI0ZGRiIgb3BhY2l0eT0iMC4zIi8+CjwvZz4KPC9zdmc+",
      color: "#EB001B",
    },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (selectedMethod.type === "mobile" && !transactionId) {
      toast.error("Please enter transaction ID");
      return;
    }

    if (selectedMethod.type === "card" && !pin) {
      toast.error("Please enter card PIN");
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(async () => {
      try {
        console.log("💳 Processing payment with:", {
          method: selectedMethod.name,
          transactionId: transactionId || "N/A",
          pin: pin ? "****" : "N/A",
        });

        // Call the actual booking API
        const bookingResponse = await onPaymentSuccess({
          ...bookingData,
          paymentMethod: selectedMethod.name,
          transactionId: transactionId || `TXN-${Date.now()}`,
        });

        // Extract bookingId from response
        const bookingId = bookingResponse?.booking?.bookingId || 'N/A';
        
        toast.success(
          `Payment successful via ${selectedMethod.name}! Booking ID: ${bookingId}`,
          { duration: 5000 }
        );
        
        // Reset and close
        setSelectedMethod(null);
        setTransactionId("");
        setPin("");
        onClose();
      } catch (error) {
        console.error("❌ Payment error:", error);
        toast.error("Payment processing failed. Please try again.");
      } finally {
        setProcessing(false);
      }
    }, 2000); // 2 second delay for realism
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f172a] rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-800 relative overflow-hidden">
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-transparent pointer-events-none"></div>

        {/* Content */}
        <div className="relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-6 h-6 text-[#b35a44]" />
              <h2 className="text-2xl font-bold text-white">
                Select Payment Method
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={processing}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Booking Summary */}
          <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Booking Summary</p>
            <p className="text-white font-semibold text-lg">
              {bookingData.ticketTitle}
            </p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-slate-400 text-sm">
                Quantity: {bookingData.quantity}
              </span>
              <span className="text-[#b35a44] font-bold text-xl">
                ৳{bookingData.totalPrice}
              </span>
            </div>
          </div>

          {/* Payment Methods Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => {
                  setSelectedMethod(method);
                  setTransactionId("");
                  setPin("");
                }}
                disabled={processing}
                className={`p-4 rounded-xl border-2 transition-all duration-300 disabled:opacity-50 ${
                  selectedMethod?.id === method.id
                    ? "border-[#b35a44] bg-[#b35a44]/10 shadow-lg shadow-[#b35a44]/20"
                    : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div 
                    className="w-16 h-16 flex items-center justify-center rounded-lg text-white font-bold text-xs"
                    style={{ backgroundColor: method.color }}
                  >
                    {method.name}
                  </div>
                  <span className="text-white font-medium text-sm">
                    {method.name}
                  </span>
                  {selectedMethod?.id === method.id && (
                    <CheckCircle className="w-5 h-5 text-[#b35a44]" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Payment Details Input */}
          {selectedMethod && (
            <div className="mb-6 space-y-4 animate-fadeIn">
              {selectedMethod.type === "mobile" ? (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-[#b35a44]" />
                    <span>Enter Transaction ID</span>
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g., TXN123456789"
                    disabled={processing}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#b35a44] focus:ring-1 focus:ring-[#b35a44] transition-all disabled:opacity-50"
                  />
                  <p className="text-slate-500 text-xs mt-1">
                    Complete payment on {selectedMethod.name} app and enter the
                    transaction ID here
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-[#b35a44]" />
                    <span>Enter Card PIN</span>
                  </label>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="****"
                    maxLength="4"
                    disabled={processing}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#b35a44] focus:ring-1 focus:ring-[#b35a44] transition-all disabled:opacity-50"
                  />
                  <p className="text-slate-500 text-xs mt-1">
                    Enter your 4-digit card PIN for {selectedMethod.name}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={processing}
              className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={processing || !selectedMethod}
              className="flex-1 px-6 py-3 bg-[#b35a44] hover:bg-[#a04d39] text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Pay Now</span>
                </>
              )}
            </button>
          </div>

          {/* Security Notice */}
          <p className="text-slate-500 text-xs text-center mt-4">
            🔒 Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
