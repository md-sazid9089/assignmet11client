import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/api';
import { FiSearch, FiMapPin, FiDollarSign } from 'react-icons/fi';
import { MdFlightTakeoff, MdDirectionsBus, MdTrain, MdDirectionsBoat } from 'react-icons/md';

const AllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    transportType: 'all',
    sortBy: 'latest',
    page: 1,
  });

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.transportType !== 'all') params.append('transportType', filters.transportType);
      if (filters.sortBy !== 'latest') params.append('sortBy', filters.sortBy);
      params.append('page', filters.page);
      params.append('limit', 9);

      const response = await api.get(`/tickets/approved?${params.toString()}`);
      setTickets(response.data.tickets);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const getTransportIcon = (type) => {
    switch (type) {
      case 'plane':
        return <MdFlightTakeoff className="text-2xl" />;
      case 'bus':
        return <MdDirectionsBus className="text-2xl" />;
      case 'train':
        return <MdTrain className="text-2xl" />;
      case 'launch':
        return <MdDirectionsBoat className="text-2xl" />;
      default:
        return <MdFlightTakeoff className="text-2xl" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold gradient-text text-center mb-8">
        All Available Tickets
      </h1>

      {/* Filters */}
      <div className="card mb-8">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search by from or to location..."
              className="input-field pl-12"
            />
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Transport Type</label>
            <select
              value={filters.transportType}
              onChange={(e) => handleFilterChange('transportType', e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="bus">Bus</option>
              <option value="train">Train</option>
              <option value="launch">Launch</option>
              <option value="plane">Plane</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="input-field"
            >
              <option value="latest">Latest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-400"></div>
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            No tickets found. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="card hover:scale-105 transition-transform">
                <img
                  src={ticket.imageUrl}
                  alt={ticket.title}
                  className="w-full h-48 object-cover rounded-2xl mb-4"
                />
                <div className="flex items-center gap-2 mb-3">
                  {getTransportIcon(ticket.transportType)}
                  <span className="badge bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
                    {ticket.transportType}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{ticket.title}</h3>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                  <FiMapPin />
                  <span>{ticket.from} → {ticket.to}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                  <FiDollarSign />
                  <span className="text-2xl font-bold text-primary-500">${ticket.pricePerUnit}</span>
                </div>
                <div className="mb-3">
                  <span className="text-sm text-gray-500">
                    Available: {ticket.quantity} tickets
                  </span>
                </div>
                <div className="flex gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
                  <span>📅 {new Date(ticket.departureDate).toLocaleDateString()}</span>
                  <span>🕐 {ticket.departureTime}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {ticket.perks?.slice(0, 3).map((perk, index) => (
                    <span key={index} className="badge bg-pastel-teal dark:bg-secondary-900 text-gray-700 dark:text-gray-300 text-xs">
                      {perk}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/ticket/${ticket._id}`}
                  className="btn-primary w-full text-center"
                >
                  See Details
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                disabled={filters.page === 1}
                className="btn-secondary px-4 py-2 disabled:opacity-50"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {[...Array(pagination.pages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setFilters({ ...filters, page: index + 1 })}
                    className={`px-4 py-2 rounded-full font-semibold ${
                      filters.page === index + 1
                        ? 'bg-gradient-primary text-white'
                        : 'bg-gray-200 dark:bg-dark-lighter'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                disabled={filters.page === pagination.pages}
                className="btn-secondary px-4 py-2 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllTickets;
