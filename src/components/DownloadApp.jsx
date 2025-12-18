import { useEffect, useRef } from "react";
import {
  FaApple,
  FaGooglePlay,
  FaMobileAlt,
  FaBell,
  FaTicketAlt,
} from "react-icons/fa";
import { gsap } from "gsap";

const DownloadApp = () => {
  const phoneRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    if (phoneRef.current) {
      gsap.to(phoneRef.current, {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }

    if (badgeRef.current) {
      gsap.to(badgeRef.current, {
        scale: 1.1,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }
  }, []);

  return (
    <section className="py-16 bg-white dark:bg-slate-800">
      <div className="container mx-auto px-4">
        <div className="bg-[#0f172a] rounded-3xl overflow-hidden border border-[#334155]">
          <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
            {/* Left Content */}
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Download Our Mobile App
              </h2>
              <p className="text-slate-300 mb-6 text-lg">
                Book tickets on the go! Get instant notifications and exclusive
                mobile-only deals.
              </p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-[#b35a44]/20 p-2 rounded-lg border border-[#b35a44]/30">
                    <FaTicketAlt className="text-xl text-[#d97757]" />
                  </div>
                  <span>Quick & easy booking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-[#b35a44]/20 p-2 rounded-lg border border-[#b35a44]/30">
                    <FaBell className="text-xl text-[#d97757]" />
                  </div>
                  <span>Real-time notifications</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-[#b35a44]/20 p-2 rounded-lg border border-[#b35a44]/30">
                    <FaMobileAlt className="text-xl text-[#d97757]" />
                  </div>
                  <span>Mobile-exclusive offers</span>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="flex flex-wrap gap-4">
                <button className="flex items-center gap-3 bg-white hover:bg-slate-100 text-[#0f172a] px-6 py-3 rounded-xl transition-all font-semibold">
                  <FaApple className="text-3xl" />
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-lg font-bold">App Store</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 bg-white hover:bg-slate-100 text-[#0f172a] px-6 py-3 rounded-xl transition-all font-semibold">
                  <FaGooglePlay className="text-3xl" />
                  <div className="text-left">
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-lg font-bold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div
                  ref={phoneRef}
                  className="w-64 h-[500px] bg-[#1e293b] border-4 border-[#334155] backdrop-blur-sm rounded-3xl flex items-center justify-center"
                >
                  <div className="text-center text-white p-8">
                    <FaMobileAlt className="text-8xl mb-4 mx-auto opacity-50 text-[#d97757]" />
                    <p className="text-sm opacity-75">App Preview</p>
                  </div>
                </div>
                {/* Floating badges */}
                <div
                  ref={badgeRef}
                  className="absolute -top-4 -right-4 bg-[#b35a44] text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg"
                >
                  Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadApp;
