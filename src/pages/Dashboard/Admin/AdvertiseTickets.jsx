import { useState, useEffect } from 'react';
import api from '../../../config/api';
import toast from 'react-hot-toast';
import { FiStar } from 'react-icons/fi';

const AdvertiseTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get('/tickets/admin/all');
      // Filter only approved tickets
      const approvedTickets = response.data.tickets.filter(
        (ticket) => ticket.verificationStatus === 'approved'
      );
      setTickets(approvedTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdvertise = async (ticketId) => {
    try {
      await api.put('/tickets/admin/advertise', { ticketId });
      toast.success('Advertisement status updated');
      fetchTickets();
    } catch (error) {
      console.error('Error toggling advertise:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update advertisement');
      }
    }
  };

  const advertisedCount = tickets.filter((ticket) => ticket.isAdvertised).length;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-400"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold gradient-text">Advertise Tickets</h2>
        <div className="badge bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-lg">
          {advertisedCount} / 6 Advertised
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            No approved tickets available for advertisement.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className={`card ${
                ticket.isAdvertised ? 'ring-4 ring-primary-400 shadow-glow' : ''
              }`}
            >
              <img
                src={ticket.imageUrl}
                alt={ticket.title}
                className="w-full h-40 object-cover rounded-2xl mb-4"
              />
              <h3 className="text-xl font-bold mb-2">{ticket.title}</h3>
              <div className="space-y-2 mb-4">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Route:</span> {ticket.from} → {ticket.to}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Type:</span>{' '}
                  <span className="badge bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
                    {ticket.transportType}
                  </span>
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Price:</span>{' '}
                  <span className="text-primary-500 font-bold">${ticket.pricePerUnit}</span>
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Vendor:</span> {ticket.vendorName}
                </p>
              </div>

              <button
                onClick={() => handleToggleAdvertise(ticket._id)}
                className={`w-full py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${
                  ticket.isAdvertised
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    : 'bg-gradient-primary text-white hover:shadow-lg'
                }`}
              >
                <FiStar className={ticket.isAdvertised ? 'fill-white' : ''} />
                {ticket.isAdvertised ? 'Remove from Featured' : 'Add to Featured'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvertiseTickets;
