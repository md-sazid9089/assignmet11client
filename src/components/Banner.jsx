import { useState, useEffect, useRef } from "react";
import {
  FaBus,
  FaTrain,
  FaShip,
  FaPlane,
  FaExchangeAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import { gsap } from "gsap";

const Banner = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("bus");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const cardRef = useRef(null);

  // Array of background images
  const backgroundImages = [
    "https://i.ibb.co.com/mpQhHQg/image.png",
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&q=80",
    "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1920&q=80",
    "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1920&q=80",
    "https://images.unsplash.com/photo-1558089687-51cf0ca02b25?w=1920&q=80",
  ];

  // Auto-cycle through images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          y: -50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      }

      if (cardRef.current) {
        gsap.from(cardRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const tabs = [
    { id: "bus", label: "Bus", icon: <FaBus /> },
    { id: "train", label: "Train", icon: <FaTrain /> },
    { id: "launch", label: "Launch", icon: <FaShip /> },
    { id: "flight", label: "Flight", icon: <FaPlane /> },
  ];

  const toTransportTypeParam = (tabId) => {
    switch ((tabId || "").toLowerCase()) {
      case "bus":
        return "Bus";
      case "train":
        return "Train";
      case "launch":
        return "Launch";
      case "flight":
      case "plane":
        return "Plane";
      default:
        return "";
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const searchParams = new URLSearchParams();

    const transportType = toTransportTypeParam(activeTab);
    if (transportType) {
      searchParams.append("transportType", transportType);
    }

    const fromTrimmed = from.trim();
    const toTrimmed = to.trim();

    if (fromTrimmed) {
      searchParams.append("from", fromTrimmed);
    }

    if (toTrimmed) {
      searchParams.append("to", toTrimmed);
    }

    navigate(`/all-ticket?${searchParams.toString()}`);
  };

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
      style={{
        backgroundImage: `url("${backgroundImages[currentImageIndex]}")`,
      }}
    >
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-black/60"></div>

      <div className="relative container mx-auto px-4 pt-32 pb-12 md:pt-40 md:pb-16 lg:pt-48 lg:pb-20">
        <div ref={titleRef} className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            Book Your Journey
          </h1>
          <p className="text-base md:text-lg text-white/90">
            Travel anywhere, anytime with ease
          </p>
        </div>

        <div ref={cardRef} className="max-w-5xl mx-auto">
          <div className="bg-white/95 dark:bg-slate-800 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700">
            <div className="flex border-b border-slate-200 dark:border-slate-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm md:text-base font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "text-[#b35a44] bg-[#b35a44]/5 border-b-3 border-[#b35a44] dark:border-[#d97757]"
                      : "text-[#334155] dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSearch} className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-[#334155] dark:text-slate-300 mb-2">
                    FROM
                  </label>
                  <input
                    type="text"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="Select a city"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-[#0f172a] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-[#b35a44] focus:border-[#b35a44] transition-all"
                  />
                </div>

                <div className="hidden lg:flex items-end justify-center pb-3">
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="p-3 rounded-full bg-[#b35a44]/20 text-[#b35a44] dark:text-[#d97757] hover:bg-[#b35a44]/30 dark:hover:bg-slate-600 transition-all duration-300 hover:scale-110"
                  >
                    <FaExchangeAlt className="text-xl" />
                  </button>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-[#334155] dark:text-slate-300 mb-2">
                    TO
                  </label>
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Select a city"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-[#0f172a] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-[#b35a44] focus:border-[#b35a44] transition-all"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-[#334155] dark:text-slate-300 mb-2">
                    DEPARTURE DATE
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-[#0f172a] dark:text-white focus:ring-2 focus:ring-[#b35a44] focus:border-[#b35a44] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#b35a44] hover:bg-[#8e4636] text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Image Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                currentImageIndex === index
                  ? "w-8 h-2 bg-[#b35a44]"
                  : "w-2 h-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
