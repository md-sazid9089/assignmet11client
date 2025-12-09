import { useState, useEffect } from 'react';
import api from '../../../config/api';
import toast from 'react-hot-toast';

const ManageTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get('/tickets/admin/all');
      setTickets(response.data.tickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (ticketId, status) => {
    try {
      await api.put('/tickets/admin/status', { ticketId, status });
      toast.success(`Ticket ${status} successfully`);
      fetchTickets();
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Failed to update ticket');
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
      <h2 className="text-3xl font-bold gradient-text mb-6">Manage Tickets</h2>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-dark-lighter">
              <th className="text-left py-3 px-4 font-semibold">Image</th>
              <th className="text-left py-3 px-4 font-semibold">Title</th>
              <th className="text-left py-3 px-4 font-semibold">Route</th>
              <th className="text-left py-3 px-4 font-semibold">Type</th>
              <th className="text-left py-3 px-4 font-semibold">Vendor</th>
              <th className="text-left py-3 px-4 font-semibold">Price</th>
              <th className="text-left py-3 px-4 font-semibold">Status</th>
              <th className="text-left py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket._id}
                className="border-b border-gray-200 dark:border-dark-lighter hover:bg-gray-50 dark:hover:bg-dark-lighter"
              >
                <td className="py-3 px-4">
                  <img
                    src={ticket.imageUrl}
                    alt={ticket.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </td>
                <td className="py-3 px-4 font-semibold">{ticket.title}</td>
                <td className="py-3 px-4">
                  {ticket.from} → {ticket.to}
                </td>
                <td className="py-3 px-4">
                  <span className="badge bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
                    {ticket.transportType}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="font-semibold text-sm">{ticket.vendorName}</p>
                    <p className="text-xs text-gray-500">{ticket.vendorEmail}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-primary-500 font-bold">
                  ${ticket.pricePerUnit}
                </td>
                <td className="py-3 px-4">
                  <span className={`badge ${getStatusColor(ticket.verificationStatus)}`}>
                    {ticket.verificationStatus}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {ticket.verificationStatus === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(ticket._id, 'approved')}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-full text-sm transition-all"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(ticket._id, 'rejected')}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-full text-sm transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTickets;
