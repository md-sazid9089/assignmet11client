import { useEffect, useRef, useState } from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const sectionRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(2);

  const testimonials = [
    {
      name: "Md. Rakib Hassan",
      role: "Business Traveler",
      image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop",
      rating: 5,
      comment:
        "Uraan has made my business travel from Dhaka to Chittagong so convenient! The booking process is seamless and their customer support is exceptional. Highly recommend for frequent travelers.",
    },
    {
      name: "Ayesha Begum",
      role: "Family Traveler",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      rating: 5,
      comment:
        "I regularly book tickets for my family trips to Sylhet and Cox's Bazar. Uraan always offers the best prices and reliable service. The mobile app is fantastic!",
    },
    {
      name: "Sazzad Ahmed",
      role: "University Student",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      rating: 4,
      comment:
        "As a student traveling between Dhaka and Rajshahi, Uraan saves me time and money. The student discounts and last-minute booking options are lifesavers!",
    },
    {
      name: "Nasrin Sultana",
      role: "Healthcare Professional",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
      rating: 5,
      comment:
        "Working in healthcare means unpredictable schedules. Uraan's flexible booking and cancellation policy has been a blessing. Truly the best platform in Bangladesh!",
    },
    {
      name: "Kamal Uddin",
      role: "Tour Operator",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      rating: 5,
      comment:
        "I've been using Uraan for all my tour groups visiting Sundarbans, Saint Martin, and Bandarban. Professional service, competitive rates, and always on time. Perfect for tour operators!",
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] dark:text-white mb-3">
            What Our Customers Say
          </h2>
          <p className="text-[#334155] dark:text-slate-300">
            Trusted by thousands of travelers across Bangladesh
          </p>
        </div>

        {/* Interactive Avatar Stack */}
        <div className="flex items-center justify-center mb-12 group/stack">
          {testimonials.map((testimonial, index) => (
            <figure
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`flex items-center justify-center relative rounded-full object-cover border-2 border-[#b35a44] dark:border-[#d97757] cursor-pointer overflow-hidden bg-white dark:bg-slate-800 shadow-[#0000001f_0_1px_3px,#0000003d_0_0_1px] transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                ${index === 0 ? 'size-20 z-[6] order-3' : ''}
                ${index === 1 ? 'size-14 z-[4] order-2 -ml-3' : ''}
                ${index === 2 ? 'size-14 z-[4] order-4 -ml-3' : ''}
                ${index === 3 ? 'size-10 z-[3] order-1 -ml-3' : ''}
                ${index === 4 ? 'size-10 z-[3] order-5 -ml-3' : ''}
                ${selectedIndex === index ? 'scale-110 z-[50] ring-4 ring-[#b35a44] dark:ring-[#d97757]' : ''}
                hover:scale-110 hover:z-[50] hover:ring-4 hover:ring-[#b35a44] dark:hover:ring-[#d97757]
                group-hover/stack:scale-95
                hover:!scale-110
              `}
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-full h-full object-cover transition-transform duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            </figure>
          ))}
        </div>

        {/* Selected Testimonial Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
            {/* Quote Icon */}
            <FaQuoteLeft className="text-5xl text-[#b35a44] dark:text-[#d97757] mb-6 opacity-50 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]" />

            {/* Rating */}
            <div className="flex gap-2 mb-6 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-2xl transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    i < testimonials[selectedIndex].rating
                      ? "text-yellow-400"
                      : "text-slate-300 dark:text-slate-600"
                  }`}
                />
              ))}
            </div>

            {/* Comment */}
            <p className="text-[#334155] dark:text-slate-300 text-lg mb-8 italic leading-relaxed transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
              "{testimonials[selectedIndex].comment}"
            </p>

            {/* User Info */}
            <div className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-700 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
              <img
                src={testimonials[selectedIndex].image}
                alt={testimonials[selectedIndex].name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#b35a44] dark:border-[#d97757] transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
              <div className="transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
                <h4 className="font-bold text-[#0f172a] dark:text-white text-lg transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
                  {testimonials[selectedIndex].name}
                </h4>
                <p className="text-[#334155] dark:text-slate-400 text-sm transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
                  {testimonials[selectedIndex].role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
