import {
  FaShieldAlt,
  FaClock,
  FaHeadset,
  FaMoneyBillWave,
} from "react-icons/fa";

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FaShieldAlt className="text-5xl text-[#b35a44]" />,
      title: "Secure & Safe",
      description:
        "100% secure payment system with encrypted transactions for your peace of mind",
    },
    {
      icon: <FaClock className="text-5xl text-[#d97757]" />,
      title: "24/7 Availability",
      description:
        "Book tickets anytime, anywhere with our always-available online platform",
    },
    {
      icon: <FaHeadset className="text-5xl text-[#b35a44]" />,
      title: "Customer Support",
      description:
        "Dedicated support team ready to assist you throughout your journey",
    },
    {
      icon: <FaMoneyBillWave className="text-5xl text-[#d97757]" />,
      title: "Best Prices",
      description:
        "Competitive pricing with exclusive deals and offers on all transport modes",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16 bg-slate-50 dark:bg-slate-900">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] dark:text-white mb-4">
          Why Choose Uraan?
        </h2>
        <p className="text-[#334155] dark:text-slate-300 max-w-2xl mx-auto">
          We provide the best online ticket booking experience with unmatched
          services
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-[#0f172a] dark:text-white mb-3">
              {feature.title}
            </h3>
            <p className="text-[#334155] dark:text-slate-300 text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
