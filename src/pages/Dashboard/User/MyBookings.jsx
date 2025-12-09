import { useState, useEffect } from 'react';
import api from '../../../config/api';
import toast from 'react-hot-toast';
import Countdown from '../../../components/Countdown';
import DummyPaymentModal from '../../../components/DummyPaymentModal';
import { FiDollarSign } from 'react-icons/fi';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = (booking) => {
    setSelectedBooking(booking);
    setIsPaymentModalOpen(true);
  };

  const handleDummyPayment = async (booking) => {
    try {
      const response = await api.post('/payments/dummy', {
        bookingId: booking._id,
        amount: booking.totalPrice,
      });

      // Update local state
      setBookings(prev =>
        prev.map(b =>
          b._id === booking._id
            ? { ...b, status: 'paid' }
            : b
        )
      );

      toast.success('Payment completed (dummy). Booking marked as paid! 🎉');
      setIsPaymentModalOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Dummy payment failed:', error);
      toast.error(error.response?.data?.message || 'Payment failed');
    }
  };

  const isExpired = (ticket) => {
    if (!ticket) return true;
    const departureDateTime = new Date(`${ticket.departureDate.split('T')[0]}T${ticket.departureTime}`);
    return new Date() > departureDateTime;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
      case 'accepted':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
      case 'paid':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-400"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold gradient-text mb-6">My Booked Tickets</h2>

      {bookings.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            You haven't booked any tickets yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="card">
              {booking.ticketId && (
                <>
                  <img
                    src={booking.ticketId.imageUrl}
                    alt={booking.ticketTitle}
                    className="w-full h-40 object-cover rounded-2xl mb-4"
                  />
                  <h3 className="text-xl font-bold mb-2">{booking.ticketTitle}</h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Route:</span>{' '}
                      {booking.ticketId.from} → {booking.ticketId.to}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Quantity:</span> {booking.quantity}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Total Price:</span>{' '}
                      <span className="text-primary-500 font-bold">${booking.totalPrice}</span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Departure:</span>{' '}
                      {new Date(booking.ticketId.departureDate).toLocaleDateString()} at{' '}
                      {booking.ticketId.departureTime}
                    </p>
                    <div>
                      <span className={`badge ${getStatusColor(booking.status)}`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {booking.status !== 'rejected' && !isExpired(booking.ticketId) && (
                    <div className="mb-4">
                      <Countdown
                        targetDate={booking.ticketId.departureDate.split('T')[0]}
                        targetTime={booking.ticketId.departureTime}
                      />
                    </div>
                  )}

                  {booking.status === 'accepted' && !isExpired(booking.ticketId) && (
                    <button
                      onClick={() => handlePayNow(booking)}
                      className="btn-primary w-full"
                    >
                      <FiDollarSign className="inline mr-2" />
                      Pay Now
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dummy Payment Modal */}
      {selectedBooking && (
        <DummyPaymentModal
          isOpen={isPaymentModalOpen}
          booking={selectedBooking}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedBooking(null);
          }}
          onConfirm={() => handleDummyPayment(selectedBooking)}
        />
      )}
    </div>
  );
};

export default MyBookings;
