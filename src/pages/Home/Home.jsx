import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { FiArrowRight, FiMapPin, FiClock, FiDollarSign } from 'react-icons/fi';
import { MdFlightTakeoff, MdDirectionsBus, MdTrain, MdDirectionsBoat } from 'react-icons/md';

const Home = () => {
  const [advertisedTickets, setAdvertisedTickets] = useState([]);
  const [latestTickets, setLatestTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const [advertisedRes, latestRes] = await Promise.all([
        api.get('/tickets/advertised'),
        api.get('/tickets/latest'),
      ]);

      setAdvertisedTickets(advertisedRes.data.tickets);
      setLatestTickets(latestRes.data.tickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
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
    <div>
      {/* Hero Banner */}
      <section className="bg-gradient-primary py-20 px-4">
        <div className="max-w-7xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Book Your Journey Easily
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Travel anywhere with bus, train, launch, or flight tickets
          </p>
          <Link to="/tickets" className="btn-secondary inline-flex items-center gap-2 bg-white text-primary-500 hover:bg-gray-100">
            Explore Tickets
            <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Advertisement Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold gradient-text text-center mb-12">
          Featured Tickets
        </h2>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advertisedTickets.map((ticket) => (
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
                  <span className="text-sm">per ticket</span>
                </div>
                <div className="mb-3">
                  <span className="text-sm text-gray-500">
                    Available: {ticket.quantity} tickets
                  </span>
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
        )}
      </section>

      {/* Latest Tickets Section */}
      <section className="bg-pastel-lavender dark:bg-dark-card py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold gradient-text text-center mb-12">
            Latest Tickets
          </h2>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-400"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestTickets.map((ticket) => (
                <div key={ticket._id} className="card hover:scale-105 transition-transform">
                  <img
                    src={ticket.imageUrl}
                    alt={ticket.title}
                    className="w-full h-40 object-cover rounded-2xl mb-4"
                  />
                  <h3 className="text-lg font-bold mb-2 line-clamp-1">{ticket.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <FiMapPin size={14} />
                    <span className="line-clamp-1">{ticket.from} → {ticket.to}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-primary-500">
                      ${ticket.pricePerUnit}
                    </span>
                    <span className="badge bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs">
                      {ticket.transportType}
                    </span>
                  </div>
                  <Link
                    to={`/ticket/${ticket._id}`}
                    className="btn-secondary w-full text-center text-sm py-2"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold gradient-text text-center mb-12">
          Popular Routes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['Dhaka → Chittagong', 'Dhaka → Sylhet', 'Dhaka → Cox\'s Bazar', 'Dhaka → Khulna'].map((route, index) => (
            <div key={index} className="card text-center hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">🚌</div>
              <h3 className="text-lg font-bold mb-2">{route}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Starting from $10
              </p>
              <Link to="/tickets" className="text-primary-500 font-semibold hover:text-primary-600">
                Browse Tickets →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gradient-primary py-16 px-4 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Choose TicketBari?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🎟️</div>
              <h3 className="text-2xl font-bold mb-3">Wide Selection</h3>
              <p className="opacity-90">
                Choose from thousands of tickets across all transport types
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-3">Secure Payments</h3>
              <p className="opacity-90">
                Pay safely with Stripe's industry-leading security
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-3">Instant Booking</h3>
              <p className="opacity-90">
                Book tickets instantly and get confirmed in seconds
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
