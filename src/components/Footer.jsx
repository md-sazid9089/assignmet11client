import { Link } from "react-router";
import { useState } from "react";
import logo from "../assets/logo.png";
import { Linkedin, Facebook, Instagram, Send } from "lucide-react";
import toast from "react-hot-toast";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    setSubscribing(true);
    
    // Simulate newsletter subscription
    setTimeout(() => {
      toast.success("Successfully subscribed to our newsletter!");
      setEmail("");
      setSubscribing(false);
    }, 1000);
  };

  return (
    <footer className="relative bg-[#020617] text-white border-t border-slate-800">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-transparent backdrop-blur-lg pointer-events-none"></div>
      
      <div className="relative container mx-auto px-4 pt-16 pb-8">
        {/* Main Footer Content - 4 Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Company Info & Branding */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center space-x-2 group">
              <img
                src={logo}
                alt="Uraan Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Uraan
              </span>
            </Link>
            
            <p className="text-slate-400 text-sm leading-relaxed">
              Your trusted travel companion for seamless bus, train, launch & flight ticket bookings across Bangladesh. Journey with confidence.
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-4 pt-2">
              <a
                href="https://github.com/md-sazid9089"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-[#b35a44] transition-all duration-300 group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-slate-400 group-hover:text-white transition" />
              </a>
              <a
                href="https://github.com/md-sazid9089"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-[#b35a44] transition-all duration-300 group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-slate-400 group-hover:text-white transition" />
              </a>
              <a
                href="https://github.com/md-sazid9089"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-[#b35a44] transition-all duration-300 group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-slate-400 group-hover:text-white transition" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-slate-400 hover:text-[#b35a44] transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#b35a44] mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/all-ticket" 
                  className="text-slate-400 hover:text-[#b35a44] transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#b35a44] mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  All Tickets
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-slate-400 hover:text-[#b35a44] transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#b35a44] mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-slate-400 hover:text-[#b35a44] transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#b35a44] mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard/user/profile" 
                  className="text-slate-400 hover:text-[#b35a44] transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#b35a44] mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Our Services</h3>
            <ul className="space-y-3">
              <li className="text-slate-400 text-sm flex items-start">
                <span className="w-1.5 h-1.5 bg-[#b35a44] rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                Bus Ticket Booking
              </li>
              <li className="text-slate-400 text-sm flex items-start">
                <span className="w-1.5 h-1.5 bg-[#b35a44] rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                Train Reservations
              </li>
              <li className="text-slate-400 text-sm flex items-start">
                <span className="w-1.5 h-1.5 bg-[#b35a44] rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                Launch Tickets
              </li>
              <li className="text-slate-400 text-sm flex items-start">
                <span className="w-1.5 h-1.5 bg-[#b35a44] rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                Flight Bookings
              </li>
              <li className="text-slate-400 text-sm flex items-start">
                <span className="w-1.5 h-1.5 bg-[#b35a44] rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                24/7 Customer Support
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
            <p className="text-slate-400 text-sm mb-4">
              Subscribe to our newsletter for exclusive deals and travel updates.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#b35a44] focus:ring-1 focus:ring-[#b35a44] transition-all duration-300"
                  disabled={subscribing}
                />
              </div>
              
              <button
                type="submit"
                disabled={subscribing}
                className="w-full px-4 py-3 bg-[#b35a44] hover:bg-[#a04d39] text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{subscribing ? "Subscribing..." : "Subscribe"}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>

            <p className="text-slate-500 text-xs mt-3">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Bottom Bar - Copyright & Links */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-slate-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Uraan. All rights reserved. Crafted with passion for travelers.
            </p>
            
            <div className="flex items-center space-x-6">
              <Link
                to="/privacy-policy"
                className="text-slate-400 hover:text-[#b35a44] text-sm transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <span className="text-slate-700">•</span>
              <Link
                to="/terms"
                className="text-slate-400 hover:text-[#b35a44] text-sm transition-colors duration-300"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
