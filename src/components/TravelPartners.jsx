import { FaBus, FaTrain, FaShip, FaPlane } from "react-icons/fa";

const TravelPartners = () => {
  const stats = [
    { icon: FaBus, count: "150+", label: "Bus Partners", color: "blue" },
    { icon: FaTrain, count: "30+", label: "Train Routes", color: "purple" },
    { icon: FaShip, count: "25+", label: "Launch Services", color: "teal" },
    { icon: FaPlane, count: "15+", label: "Flight Routes", color: "orange" },
  ];

  return (
    <section className="py-16 bg-[#0f172a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Our Travel Network
          </h2>
          <p className="text-slate-300">
            Connected with the best transport services in Bangladesh
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="bg-[#1e293b] backdrop-blur-sm rounded-2xl p-8 hover:bg-[#334155] transition-all border border-[#334155]">
                  <Icon className="text-5xl text-[#d97757] mb-4 mx-auto" />
                  <div className="text-4xl font-bold text-white mb-2">
                    {stat.count}
                  </div>
                  <div className="text-slate-300 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 px-8 py-4 bg-[#1e293b] border border-[#334155] backdrop-blur-sm rounded-xl">
            <div className="text-white">
              <span className="text-2xl font-bold text-[#d97757]">50,000+</span>
              <p className="text-slate-300 text-sm">
                Happy Customers
              </p>
            </div>
            <div className="w-px h-12 bg-slate-600"></div>
            <div className="text-white">
              <span className="text-2xl font-bold text-[#d97757]">100%</span>
              <p className="text-slate-300 text-sm">
                Secure Payment
              </p>
            </div>
            <div className="w-px h-12 bg-slate-600"></div>
            <div className="text-white">
              <span className="text-2xl font-bold text-[#d97757]">24/7</span>
              <p className="text-slate-300 text-sm">
                Support
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelPartners;
