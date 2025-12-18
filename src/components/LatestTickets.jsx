import { useEffect, useState } from "react";
import axios from "axios";
import TicketCard from "./TicketCard";

const LatestTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/tickets/latest`
        );
        const fetchedTickets = response.data.tickets || response.data || [];
        console.log('🆕 Latest Tickets fetched:', fetchedTickets.length);
        setTickets(fetchedTickets);
      } catch (error) {
        console.error("Error fetching latest tickets:", error);
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

  return (
    <section className="container mx-auto px-4 py-16 bg-slate-50 dark:bg-slate-900 rounded-lg">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] dark:text-white mb-4">
          Latest Tickets
        </h2>
        <p className="text-[#334155] dark:text-slate-300 max-w-2xl mx-auto">
          Browse our newest ticket offerings for your next adventure
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tickets.map((ticket) => (
          <TicketCard key={ticket._id} ticket={ticket} />
        ))}
      </div>
    </section>
  );
};

export default LatestTickets;
