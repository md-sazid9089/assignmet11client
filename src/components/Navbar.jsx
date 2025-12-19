import { useContext, useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { AuthContext } from "../providers/AuthProvider";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import gsap from "gsap";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const avatarRef = useRef(null);
  const navRef = useRef(null);
  const lastScrollY = useRef(0);
  const [isVisible, setIsVisible] = useState(true);

  const isHomePage = location.pathname === '/';

  // Headroom effect - Hide/Show navbar on scroll with modern animations
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Determine scroll direction and visibility
          if (currentScrollY > 100) {
            setIsScrolled(true);
            
            if (currentScrollY > lastScrollY.current && currentScrollY > 200) {
              // Scrolling down - hide navbar with fade and slide up
              setIsVisible(false);
              gsap.to(navRef.current, {
                y: -100,
                opacity: 0,
                duration: 0.4,
                ease: "power3.out",
                filter: "blur(4px)",
              });
            } else if (currentScrollY < lastScrollY.current) {
              // Scrolling up - show navbar with fade and slide down
              setIsVisible(true);
              gsap.to(navRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.5,
                ease: "power3.out",
                filter: "blur(0px)",
              });
            }
          } else {
            setIsScrolled(false);
            setIsVisible(true);
            gsap.to(navRef.current, {
              y: 0,
              opacity: 1,
              duration: 0.4,
              ease: "power2.out",
              filter: "blur(0px)",
            });
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${user.email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserRole(res.data.role || "user");
      } catch {
        setUserRole("user");
      }
    };

    fetchUserRole();
  }, [user]);

  const handleLogout = () => {
    logOut()
      .then(() => {
        toast.success("Logged out");
        setIsAvatarOpen(false);
        setIsMenuOpen(false);
      })
      .catch(() => toast.error("Logout failed"));
  };

  useEffect(() => {
    const handleOutside = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setIsAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const linkClass = ({ isActive }) =>
    `px-4 py-2 font-medium transition-all duration-300 ${
      isActive
        ? "text-[#b35a44] dark:text-[#d97757] font-semibold border-b-2 border-[#b35a44] dark:border-[#d97757]"
        : (isHomePage && !isScrolled)
          ? "text-white hover:text-[#d97757] drop-shadow-lg"
          : "text-slate-300 hover:text-[#d97757]"
    }`;

  const navLinks = (
    <>
      <NavLink to="/" className={linkClass}>
        Home
      </NavLink>
      {user && (
        <NavLink to="/all-ticket" className={linkClass}>
          All Tickets
        </NavLink>
      )}
      <NavLink to="/about" className={linkClass}>
        About
      </NavLink>
      <NavLink to="/contact" className={linkClass}>
        Contact
      </NavLink>
    </>
  );

  return (
    <nav 
      ref={navRef}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b ${
        isHomePage && !isScrolled
          ? 'bg-transparent border-transparent' 
          : 'bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-700 shadow-2xl shadow-slate-900/50'
      }`}
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img src={logo} alt="Uraan Logo" className="w-24 -mt-5 transition-transform group-hover:scale-105" />
            <span className={`text-2xl lg:text-3xl -mb-10 -ml-10 -mt-8 font-bold transition-all duration-300 ${
              (isHomePage && !isScrolled) ? 'text-white drop-shadow-lg' : 'text-[#b35a44] dark:text-[#d97757]'
            }`}>
              Uraan
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">{navLinks}</div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div ref={avatarRef} className="relative">
                <button 
                  onClick={() => setIsAvatarOpen(!isAvatarOpen)}
                  className="transition-transform hover:scale-105"
                >
                  <img
                    src={user.photoURL || "https://i.ibb.co/2Pz4LgR/user.png"}
                    className="w-10 h-10 rounded-full ring-2 ring-clay-500 dark:ring-clay-600 shadow-clay"
                  />
                </button>

                {isAvatarOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-slate-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 bg-slate-gradient border-b border-slate-700">
                      <p className="font-semibold text-white">
                        {user.displayName}
                      </p>
                      <p className="text-sm text-slate-300">
                        {user.email}
                      </p>
                      <span className="inline-block mt-2 px-3 py-1 text-xs bg-clay-500 text-white rounded-full capitalize shadow-clay">
                        {userRole}
                      </span>
                    </div>

                    <div className="p-2 space-y-1">
                      <Link
                        to={`/dashboard/${userRole}/profile`}
                        onClick={() => setIsAvatarOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 transition-colors"
                      >
                        <FaUser className="text-clay-500" /> Dashboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="cursor-pointer relative bg-white/10 py-2 rounded-full min-w-[8.5rem] min-h-[2.92rem] group max-w-full flex items-center justify-start hover:bg-[#d97757] transition-all duration-[3000ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] shadow-[inset_1px_2px_5px_#00000080]"
              >
                <div className="absolute flex px-1 py-0.5 justify-start items-center inset-0">
                  <div className="w-[0%] group-hover:w-full transition-all duration-[3500ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"></div>
                  <div className="rounded-full shrink-0 flex justify-center items-center shadow-[inset_1px_-1px_3px_0_black] h-full aspect-square bg-[#b35a44] transition-all duration-[3500ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:bg-black">
                    <div className="size-[0.8rem] text-black group-hover:text-white group-hover:-rotate-45 transition-all duration-[3500ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 16 16"
                        height="100%"
                        width="100%"
                      >
                        <path
                          fill="currentColor"
                          d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="pl-[3.4rem] pr-[1.1rem] group-hover:pl-[1.1rem] group-hover:pr-[3.4rem] transition-all duration-[3500ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:text-black text-white font-semibold">
                  Login
                </div>
              </Link>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`transition-all duration-300 ${
                (isHomePage && !isScrolled) ? 'text-white hover:text-[#d97757] drop-shadow-lg' : 'text-slate-300 hover:text-[#d97757]'
              }`}
            >
              {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-6 pt-4 space-y-4 bg-slate-900/98 backdrop-blur-xl">
            <div className="flex flex-col gap-2">{navLinks}</div>

            {user ? (
              <div className="pt-4 border-t border-slate-700 space-y-4">
                <div className="flex items-center gap-3 px-4">
                  <img
                    src={user.photoURL || "https://i.ibb.co/2Pz4LgR/user.png"}
                    className="w-12 h-12 rounded-full ring-2 ring-[#b35a44] shadow-clay"
                  />
                  <div>
                    <p className="font-semibold leading-tight text-white">
                      {user.displayName}
                    </p>
                    <p className="text-sm text-slate-300">
                      {user.email}
                    </p>
                    <span className="inline-block mt-1 px-3 py-0.5 text-xs bg-[#b35a44] text-white rounded-full capitalize">
                      {userRole}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    to={`/dashboard/${userRole}/profile`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg hover:bg-slate-800 text-white transition-colors"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="cursor-pointer relative bg-white/10 py-2 rounded-full min-w-[8.5rem] min-h-[2.92rem] group max-w-full flex items-center justify-start hover:bg-[#d97757] transition-all duration-[3000ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] shadow-[inset_1px_2px_5px_#00000080] mx-auto"
              >
                <div className="absolute flex px-1 py-0.5 justify-start items-center inset-0">
                  <div className="w-[0%] group-hover:w-full transition-all duration-[3500ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"></div>
                  <div className="rounded-full shrink-0 flex justify-center items-center shadow-[inset_1px_-1px_3px_0_black] h-full aspect-square bg-[#b35a44] transition-all duration-[3500ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:bg-black">
                    <div className="size-[0.8rem] text-black group-hover:text-white group-hover:-rotate-45 transition-all duration-[3500ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 16 16"
                        height="100%"
                        width="100%"
                      >
                        <path
                          fill="currentColor"
                          d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="pl-[3.4rem] pr-[1.1rem] group-hover:pl-[1.1rem] group-hover:pr-[3.4rem] transition-all duration-[3500ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:text-black text-white font-semibold">
                  Login
                </div>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
