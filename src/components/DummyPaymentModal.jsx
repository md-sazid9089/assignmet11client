import { FiX, FiCheckCircle } from 'react-icons/fi';

const DummyPaymentModal = ({ isOpen, onClose, onConfirm, booking }) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-white dark:bg-dark-card rounded-3xl shadow-soft-lg max-w-md w-full p-6 animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-dark-lighter rounded-full transition-colors"
        >
          <FiX className="text-xl text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="text-3xl text-white" />
          </div>
          <h3 className="text-2xl font-bold gradient-text mb-2">
            Confirm Payment
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This is a dummy payment. No real money will be charged.
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-pastel-pink dark:bg-dark-lighter rounded-2xl p-4 mb-6 space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Ticket
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white text-right">
              {booking.ticketId?.title || booking.ticketTitle || 'N/A'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Quantity
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {booking.quantity || booking.bookingQuantity || 1}
            </span>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-dark-lighter">
            <span className="text-base font-bold text-gray-900 dark:text-white">
              Total Amount
            </span>
            <span className="text-xl font-bold gradient-text">
              ${booking.totalPrice || 0}
            </span>
          </div>
        </div>

        {/* Info Message */}
        <div className="bg-primary-50 dark:bg-dark-lighter rounded-xl p-3 mb-6">
          <p className="text-xs text-center text-gray-700 dark:text-gray-300">
            💡 <strong>Demo Mode:</strong> This is a simulated payment for testing purposes. 
            Your booking will be marked as paid without any real transaction.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 rounded-full border-2 border-gray-300 dark:border-dark-lighter hover:bg-gray-50 dark:hover:bg-dark-lighter transition-all font-semibold text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 btn-primary"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DummyPaymentModal;
