import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Countdown from '../../components/Countdown';
import Modal from '../../components/Modal';
import { FiMapPin, FiClock, FiDollarSign, FiPackage } from 'react-icons/fi';
import { MdFlightTakeoff, MdDirectionsBus, MdTrain, MdDirectionsBoat } from 'react-icons/md';

const TicketDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingQuantity, setBookingQuantity] = useState(1);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const response = await api.get(`/tickets/${id}`);
      setTicket(response.data.ticket);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      toast.error('Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }

    if (bookingQuantity > ticket.quantity) {
      toast.error('Not enough tickets available');
      return;
    }

    try {
      await api.post('/bookings', {
        ticketId: ticket._id,
        quantity: bookingQuantity,
        userName: user.displayName,
        userEmail: user.email,
        ticketTitle: ticket.title,
        totalPrice: ticket.pricePerUnit * bookingQuantity,
        vendorId: ticket.vendorId,
      });

      toast.success('Booking request sent successfully!');
      setIsModalOpen(false);
      navigate('/dashboard/my-bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    }
  };

  const getTransportIcon = (type) => {
    switch (type) {
      case 'plane':
        return <MdFlightTakeoff className="text-4xl" />;
      case 'bus':
        return <MdDirectionsBus className="text-4xl" />;
      case 'train':
        return <MdTrain className="text-4xl" />;
      case 'launch':
        return <MdDirectionsBoat className="text-4xl" />;
      default:
        return <MdFlightTakeoff className="text-4xl" />;
    }
  };

  const isExpired = () => {
    if (!ticket) return true;
    const departureDateTime = new Date(`${ticket.departureDate.split('T')[0]}T${ticket.departureTime}`);
    return new Date() > departureDateTime;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-400"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold">Ticket not found</h2>
      </div>
    );
  }

  const canBook = ticket.quantity > 0 && !isExpired();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Image & Info */}
        <div>
          <img
            src={ticket.imageUrl}
            alt={ticket.title}
            className="w-full h-[400px] object-cover rounded-3xl shadow-soft-lg mb-6"
          />

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              {getTransportIcon(ticket.transportType)}
              <span className="badge bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-lg">
                {ticket.transportType}
              </span>
            </div>

            <h1 className="text-3xl font-bold mb-6">{ticket.title}</h1>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-lg">
                <FiMapPin className="text-primary-500 text-2xl" />
                <div>
                  <span className="font-semibold">Route:</span>{' '}
                  <span className="text-gray-700 dark:text-gray-300">
                    {ticket.from} → {ticket.to}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-lg">
                <FiClock className="text-primary-500 text-2xl" />
                <div>
                  <span className="font-semibold">Departure:</span>{' '}
                  <span className="text-gray-700 dark:text-gray-300">
                    {new Date(ticket.departureDate).toLocaleDateString()} at {ticket.departureTime}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-lg">
                <FiDollarSign className="text-primary-500 text-2xl" />
                <div>
                  <span className="font-semibold">Price:</span>{' '}
                  <span className="text-3xl font-bold text-primary-500">
                    ${ticket.pricePerUnit}
                  </span>
                  <span className="text-gray-500"> per ticket</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-lg">
                <FiPackage className="text-primary-500 text-2xl" />
                <div>
                  <span className="font-semibold">Available:</span>{' '}
                  <span className={`font-bold ${ticket.quantity === 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {ticket.quantity} tickets
                  </span>
                </div>
              </div>
            </div>

            {/* Perks */}
            {ticket.perks && ticket.perks.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">Perks & Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {ticket.perks.map((perk, index) => (
                    <span
                      key={index}
                      className="badge bg-pastel-teal dark:bg-secondary-900 text-gray-700 dark:text-gray-300"
                    >
                      ✓ {perk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Vendor Info */}
            <div className="border-t border-gray-200 dark:border-dark-lighter pt-4">
              <h3 className="text-lg font-semibold mb-2">Vendor Information</h3>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Name:</span> {ticket.vendorName}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Email:</span> {ticket.vendorEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Countdown & Booking */}
        <div>
          <div className="card sticky top-24">
            <h2 className="text-2xl font-bold gradient-text mb-6 text-center">
              Booking Information
            </h2>

            {!isExpired() && (
              <div className="mb-8">
                <h3 className="text-center text-lg font-semibold mb-4">
                  Time Until Departure
                </h3>
                <Countdown
                  targetDate={ticket.departureDate.split('T')[0]}
                  targetTime={ticket.departureTime}
                />
              </div>
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!canBook}
              className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExpired()
                ? 'Departure Time Passed'
                : ticket.quantity === 0
                ? 'Sold Out'
                : 'Book Now'}
            </button>

            {!canBook && !isExpired() && ticket.quantity === 0 && (
              <p className="text-center text-red-500 mt-4">
                Sorry, this ticket is sold out!
              </p>
            )}

            {isExpired() && (
              <p className="text-center text-red-500 mt-4">
                This ticket is no longer available for booking.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Book Ticket">
        <form onSubmit={handleBookNow} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Number of Tickets</label>
            <input
              type="number"
              min="1"
              max={ticket.quantity}
              value={bookingQuantity}
              onChange={(e) => setBookingQuantity(parseInt(e.target.value))}
              className="input-field"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Maximum available: {ticket.quantity}
            </p>
          </div>

          <div className="bg-pastel-lavender dark:bg-dark-lighter p-4 rounded-2xl">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Price per ticket:</span>
              <span>${ticket.pricePerUnit}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Quantity:</span>
              <span>{bookingQuantity}</span>
            </div>
            <div className="border-t border-gray-300 dark:border-dark-lighter pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-2xl font-bold text-primary-500">
                  ${ticket.pricePerUnit * bookingQuantity}
                </span>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">
            Confirm Booking
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default TicketDetails;
