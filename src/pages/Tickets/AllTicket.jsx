import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useSearchParams } from "react-router";

import { FaSearch } from "react-icons/fa";
import TicketCard from "../../components/TicketCard";

const AllTickets = () => {
  const [searchParams] = useSearchParams();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Initialize from URL so the first fetch uses the intended filters.
  const [fromLocation, setFromLocation] = useState(
    () => searchParams.get("from") || ""
  );
  const [toLocation, setToLocation] = useState(
    () => searchParams.get("to") || ""
  );
  const [transportType, setTransportType] = useState(
    () => searchParams.get("transportType") || ""
  );
  const [sortBy, setSortBy] = useState("");

  const requestSeqRef = useRef(0);

  useEffect(() => {
    const nextFrom = searchParams.get("from") || "";
    const nextTo = searchParams.get("to") || "";
    const nextTransport = searchParams.get("transportType") || "";

    setFromLocation(nextFrom);
    setToLocation(nextTo);
    setTransportType(nextTransport);
    setCurrentPage(1);
  }, [searchParams]);

  const fetchTickets = useCallback(async () => {
    const requestSeq = ++requestSeqRef.current;
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 9,
      };

      // Add search param if from or to location is provided
      if (fromLocation || toLocation) {
        params.search = fromLocation || toLocation;
      }

      // Add transport type filter (convert to lowercase to match backend enum)
      if (transportType) {
        params.transportType = transportType.toLowerCase();
      }

      // Add sorting
      if (sortBy) {
        params.sortBy = sortBy;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/tickets/approved`,
        { params }
      );
      
      console.log('🎫 Tickets API Response:', {
        ticketsCount: response.data.tickets?.length || 0,
        totalPages: response.data.pagination?.pages,
        currentPage: response.data.pagination?.page,
        total: response.data.pagination?.total
      });
      
      // Prevent older/slower requests from overwriting newer results.
      if (requestSeq === requestSeqRef.current) {
        setTickets(response.data.tickets || []);
        setTotalPages(response.data.pagination?.pages || 1);
        console.log('✅ Tickets state updated with', response.data.tickets?.length || 0, 'tickets');
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      if (requestSeq === requestSeqRef.current) {
        setTickets([]);
      }
    } finally {
      if (requestSeq === requestSeqRef.current) {
        setLoading(false);
      }
    }
  }, [currentPage, fromLocation, toLocation, transportType, sortBy]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>All Tickets - Uraan</title>
      </Helmet>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
        All Available Tickets
      </h1>

      {/* Search and Filter Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {/* From Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From
            </label>
            <div className="relative">
              <input
                type="text"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                placeholder="Departure location..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* To Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To
            </label>
            <div className="relative">
              <input
                type="text"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                placeholder="Arrival location..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Transport Type
            </label>
            <select
              value={transportType}
              onChange={(e) => {
                setTransportType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1FA0D6] dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="Bus">Bus</option>
              <option value="Train">Train</option>
              <option value="Launch">Launch</option>
              <option value="Plane">Plane</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort by Price
            </label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1FA0D6] dark:bg-gray-700 dark:text-white"
            >
              <option value="">Default</option>
              <option value="priceLowToHigh">Low to High</option>
              <option value="priceHighToLow">High to Low</option>
            </select>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : tickets.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-[#09335b] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed  transition"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded-lg transition ${
                    currentPage === index + 1
                      ? "bg-[#09335b] text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-[#09335b] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed  transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            No tickets found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default AllTickets;
