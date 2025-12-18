import { useEffect, useRef } from "react";
import {
  FaCalendarAlt,
  FaSearch,
  FaClock,
  FaBell,
  FaChartLine,
  FaPlane,
} from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BookingTips = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 50,
          opacity: 0,
          duration: 0.6,
          delay: index * 0.1,
          ease: "power2.out",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const tips = [
    {
      icon: <FaCalendarAlt className="text-4xl text-[#d97757]" />,
      title: "Book in Advance",
      description:
        "Book your tickets 2-3 weeks in advance for the best prices. Early booking can save you up to 30% on popular routes.",
    },
    {
      icon: <FaClock className="text-4xl text-[#b35a44]" />,
      title: "Flexible Timing",
      description:
        "Travel during off-peak hours or weekdays for lower fares. Mid-week flights are often cheaper than weekend bookings.",
    },
    {
      icon: <FaSearch className="text-4xl text-[#d97757]" />,
      title: "Compare Prices",
      description:
        "Use our comparison tool to find the best deals across multiple transport providers and routes.",
    },
    {
      icon: <FaBell className="text-4xl text-[#b35a44]" />,
      title: "Set Price Alerts",
      description:
        "Enable notifications to get instant alerts when prices drop on your favorite routes.",
    },
    {
      icon: <FaChartLine className="text-4xl text-[#d97757]" />,
      title: "Watch Price Trends",
      description:
        "Monitor historical price data to identify the best booking windows and seasonal variations.",
    },
    {
      icon: <FaPlane className="text-4xl text-[#b35a44]" />,
      title: "Consider Alternatives",
      description:
        "Explore different transport types or nearby destinations for potentially better deals and experiences.",
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] dark:text-white mb-4">
            Tips for Booking Cheap Flights
          </h2>
          <p className="text-[#334155] dark:text-slate-300 max-w-2xl mx-auto">
            Save money on your next trip with these expert booking strategies
            and insider tips
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="relative overflow-hidden w-full h-80 rounded-3xl cursor-pointer bg-[#b35a44] group"
            >
              {/* Hover trigger */}
              <div className="z-10 absolute w-full h-full peer"></div>
              
              {/* Top left animated circle */}
              <div className="absolute peer-hover:-top-20 peer-hover:-left-16 peer-hover:w-[140%] peer-hover:h-[140%] -top-32 -left-16 w-32 h-44 rounded-full bg-[#d97757] transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]"></div>
              
              {/* Bottom right animated circle with content */}
              <div className="absolute flex text-sm text-center items-end justify-end peer-hover:right-0 peer-hover:rounded-b-none peer-hover:bottom-0 peer-hover:items-center peer-hover:justify-center peer-hover:w-full peer-hover:h-full -bottom-32 -right-16 w-36 h-44 rounded-full bg-[#d97757] transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] p-6">
                <p className="text-white dark:text-slate-900 leading-relaxed opacity-0 peer-hover:opacity-100 transition-opacity duration-500 delay-300">
                  {tip.description}
                </p>
              </div>
              
              {/* Default content (icon & title) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
                <div className="mb-4 transform transition-all duration-[1500ms] peer-hover:scale-110 peer-hover:-translate-y-2">
                  {tip.icon}
                </div>
                <h3 className="text-xl font-bold text-center uppercase tracking-wide">
                  {tip.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-[#0f172a] dark:bg-slate-800 border border-[#334155] rounded-2xl p-6 shadow-lg">
            <div className="text-left">
              <h3 className="text-xl font-bold text-white mb-2">
                Ready to Save on Your Next Trip?
              </h3>
              <p className="text-slate-300 text-sm">
                Start comparing prices and find the best deals today!
              </p>
            </div>
            <button className="whitespace-nowrap bg-[#b35a44] hover:bg-[#8e4636] text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg">
              Search Tickets
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingTips;
