import { useEffect, useState } from "react";
import axios from "axios";
import TicketCard from "./TicketCard";

const AdvertisedTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/tickets/advertised`
        );
        const fetchedTickets = response.data.tickets || response.data || [];
        // // console.log('📢 Advertised Tickets fetched:', fetchedTickets.length);
        setTickets(fetchedTickets);
      } catch (error) {
        console.error("Error fetching advertised tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <span className="loading loading-spinner loading-lg text-[#b35a44]"></span>
      </div>
    );
  }

  if (tickets.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-16 bg-white dark:bg-slate-800">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] dark:text-white mb-4">
          Featured Deals
        </h2>
        <p className="text-[#334155] dark:text-slate-300 max-w-2xl mx-auto">
          Don't miss out on these specially selected travel deals handpicked by
          our team
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <TicketCard key={ticket._id} ticket={ticket} />
        ))}
      </div>
    </section>
  );
};

export default AdvertisedTickets;

