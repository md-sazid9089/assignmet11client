import { Link } from "react-router";
import { motion } from "framer-motion";
import { Bus, Train, Ship, Plane, MapPin, ImageOff } from "lucide-react";
import { useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const TicketCard = ({ ticket, index = 0 }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  // GSAP ScrollTrigger animation
  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Set initial state
    gsap.set(card, {
      opacity: 0,
      y: 50,
    });

    // Create scroll-triggered animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play none none none",
        once: true, // Animation plays only once
      },
    });

    tl.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: index * 0.1, // Stagger effect based on card index
    });

    // Cleanup
    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
    };
  }, [index]);

  const getTransportIcon = (type) => {
    const iconClass = "w-5 h-5";
    switch (type?.toLowerCase()) {
      case "bus":
        return <Bus className={iconClass} />;
      case "train":
        return <Train className={iconClass} />;
      case "launch":
        return <Ship className={iconClass} />;
      case "plane":
        return <Plane className={iconClass} />;
      default:
        return <Bus className={iconClass} />;
    }
  };

  const getTransportColor = (type) => {
    switch (type?.toLowerCase()) {
      case "bus":
        return "from-blue-500 to-cyan-500";
      case "train":
        return "from-purple-500 to-pink-500";
      case "launch":
        return "from-teal-500 to-emerald-500";
      case "plane":
        return "from-orange-500 to-red-500";
      default:
        return "from-[#b35a44] to-cyan-500";
    }
  };

  return (
    <motion.div
      ref={cardRef}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Glassmorphic Container with Gradient Border */}
      <div className="relative bg-slate-900/40 backdrop-blur-md border border-transparent bg-gradient-to-r from-cyan-500/20 via-transparent to-[#b35a44]/20 p-[1px] rounded-2xl transition-all duration-500">
        <motion.div 
          className="bg-slate-900/60 backdrop-blur-xl rounded-2xl overflow-hidden h-full flex flex-col"
          animate={{
            boxShadow: isHovered 
              ? "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(179, 90, 68, 0.3)"
              : "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
          }}
        >
          {/* Image Section */}
          <div className="relative h-48 overflow-hidden">
            {!imageError && ticket.imageUrl ? (
              <motion.img
                src={ticket.imageUrl}
                alt={ticket.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                <ImageOff className="w-12 h-12 text-slate-600" />
              </div>
            )}
            
            {/* Transport Type Badge */}
            <motion.div 
              className="absolute top-4 right-4"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-[#b35a44]/20 backdrop-blur-sm border border-[#b35a44]/30 text-[#b35a44] px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                {getTransportIcon(ticket.transportType)}
                {ticket.transportType}
              </div>
            </motion.div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
          </div>

          {/* Content Section */}
          <div className="p-6 flex flex-col flex-grow">
            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 min-h-[3rem]">
              {ticket.title}
            </h3>

            {/* Route */}
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <p className="text-white font-bold text-lg">
                {ticket.from && ticket.to
                  ? `${ticket.from} → ${ticket.to}`
                  : "Route not specified"}
              </p>
            </div>

            {/* Price with Clay Glow */}
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-slate-400 text-sm mb-1">Price per ticket</p>
                <motion.p 
                  className="text-3xl font-bold text-white"
                  style={{
                    textShadow: isHovered 
                      ? "0 0 20px rgba(179, 90, 68, 0.8), 0 0 40px rgba(179, 90, 68, 0.4)"
                      : "0 0 10px rgba(179, 90, 68, 0.5)"
                  }}
                  animate={{
                    textShadow: isHovered 
                      ? "0 0 20px rgba(179, 90, 68, 0.8), 0 0 40px rgba(179, 90, 68, 0.4)"
                      : "0 0 10px rgba(179, 90, 68, 0.5)"
                  }}
                >
                  ৳{ticket.pricePerUnit?.toLocaleString() || 0}
                </motion.p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-sm">Available</p>
                <p className={`font-semibold ${ticket.quantity === 0 ? 'text-red-400' : 'text-white'}`}>
                  {ticket.quantity === 0 ? 'Sold Out' : ticket.quantity}
                </p>
              </div>
            </div>

            {/* Perks */}
            {ticket.perks && ticket.perks.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {ticket.perks.slice(0, 3).map((perk, index) => (
                    <span
                      key={index}
                      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-300 text-xs px-3 py-1 rounded-full"
                    >
                      {perk}
                    </span>
                  ))}
                  {ticket.perks.length > 3 && (
                    <span className="bg-slate-800/30 text-slate-400 text-xs px-3 py-1 rounded-full">
                      +{ticket.perks.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* See Details Button */}
            {ticket.quantity === 0 ? (
              <div className="mt-auto">
                <div className="w-full py-3 px-6 bg-red-900/30 text-red-400 rounded-xl border border-red-800/50 text-center font-semibold">
                  No Tickets Available
                </div>
              </div>
            ) : (
              <Link
                to={`/ticket/${ticket._id}`}
                className="mt-auto block"
              >
                <motion.div
                  className="w-full py-3 px-6 bg-slate-800 text-white rounded-xl border border-slate-700/50 text-center font-semibold transition-all duration-300 hover:border-transparent"
                  whileHover={{
                    background: "linear-gradient(135deg, #b35a44 0%, #d97757 100%)",
                    boxShadow: "0 8px 25px rgba(179, 90, 68, 0.4)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  See Details
                </motion.div>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TicketCard;
