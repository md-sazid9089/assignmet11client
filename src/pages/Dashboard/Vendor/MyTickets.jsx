import { useState, useEffect } from 'react';
import api from '../../../config/api';
import toast from 'react-hot-toast';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get('/tickets/vendor/my-tickets');
      setTickets(response.data.tickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ticketId, status) => {
    if (status === 'rejected') {
      toast.error('Cannot delete rejected tickets');
      return;
    }

    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await api.delete(`/tickets/${ticketId}`);
        toast.success('Ticket deleted successfully');
        fetchTickets();
      } catch (error) {
        console.error('Error deleting ticket:', error);
        toast.error('Failed to delete ticket');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
      case 'approved':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
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
      <h2 className="text-3xl font-bold gradient-text mb-6">My Added Tickets</h2>

      {tickets.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            You haven't added any tickets yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="card">
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
                  <span className="font-semibold">Type:</span> {ticket.transportType}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Price:</span> ${ticket.pricePerUnit}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Quantity:</span> {ticket.quantity}
                </p>
                <div>
                  <span className={`badge ${getStatusColor(ticket.verificationStatus)}`}>
                    {ticket.verificationStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  disabled={ticket.verificationStatus === 'rejected'}
                  className="btn-secondary flex-1 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiEdit className="inline mr-1" />
                  Update
                </button>
                <button
                  onClick={() => handleDelete(ticket._id, ticket.verificationStatus)}
                  disabled={ticket.verificationStatus === 'rejected'}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-1 text-sm"
                >
                  <FiTrash2 className="inline mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
