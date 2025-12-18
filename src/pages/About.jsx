import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Users,
  Shield,
  Headphones,
  Target,
  Zap,
  Heart,
  Star,
  Award,
} from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Sarah Ahmed",
      role: "CEO & Founder",
      bio: "Visionary leader revolutionizing Bangladesh's travel industry",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Ahmed&size=150&background=b35a44&color=ffffff&format=svg",
    },
    {
      id: 2,
      name: "Rafiul Islam",
      role: "CTO", 
      bio: "Tech innovator building scalable travel solutions",
      avatar: "https://ui-avatars.com/api/?name=Rafiul+Islam&size=150&background=b35a44&color=ffffff&format=svg",
    },
    {
      id: 3,
      name: "Fatima Khan",
      role: "Head of Operations",
      bio: "Operations expert ensuring seamless user experiences",
      avatar: "https://ui-avatars.com/api/?name=Fatima+Khan&size=150&background=b35a44&color=ffffff&format=svg",
    },
    {
      id: 4,
      name: "Mohammad Ali",
      role: "Lead Designer",
      bio: "Design maestro crafting beautiful user interfaces",
      avatar: "https://ui-avatars.com/api/?name=Mohammad+Ali&size=150&background=b35a44&color=ffffff&format=svg",
    },
  ];

  const techStack = [
    { name: "React", icon: "⚛️" },
    { name: "Node.js", icon: "🚀" },
    { name: "MongoDB", icon: "🍃" },
    { name: "Tailwind", icon: "🎨" },
  ];

  return (
    <div className="min-h-screen bg-slate-950" style={{ backgroundColor: '#020617' }}>
      <Helmet>
        <title>About Us - Uraan</title>
      </Helmet>

      {/* Hero Header */}
      <motion.section 
        className="pt-32 pb-20 px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto text-center">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Redefining the Journey
            <br />
            <span className="text-[#b35a44]">Across Bangladesh</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            At Uraan, we're transforming how Bangladeshi travelers book their journeys. 
            Our cutting-edge platform combines speed, security, and simplicity to make 
            travel booking effortless - because every journey should begin with confidence.
          </motion.p>
        </div>
      </motion.section>

      {/* Interactive Bento Grid - Why Choose Us */}
      <motion.section 
        className="py-20 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-white text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why Choose <span className="text-[#b35a44]">Uraan</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto">
            {/* Card 1 - Large: Our Mission */}
            <motion.div
              className="md:col-span-7 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-8 hover:border-[#b35a44]/50 transition-all duration-500"
              style={{ boxShadow: '0 0 30px rgba(179, 90, 68, 0.1)' }}
              whileHover={{ 
                rotateY: 2, 
                rotateX: 2,
                boxShadow: '0 0 40px rgba(179, 90, 68, 0.2)'
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center mb-6">
                <Target className="w-8 h-8 text-[#b35a44] mr-4" />
                <h3 className="text-2xl font-bold text-white">Our Mission</h3>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed">
                We're on a mission to democratize travel across Bangladesh by creating 
                the most intuitive, secure, and comprehensive booking platform. Every 
                click, every booking, every journey matters to us. We believe technology 
                should bridge distances, not create barriers - making every destination 
                just one tap away.
              </p>
            </motion.div>

            {/* Card 2 - Small: Transport Partners */}
            <motion.div
              className="md:col-span-5 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-8 hover:border-[#b35a44]/50 transition-all duration-500"
              whileHover={{ 
                rotateY: -2, 
                rotateX: 2,
                scale: 1.02
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Users className="w-16 h-16 text-[#b35a44] mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-white mb-2">200+</h3>
                <p className="text-slate-400 text-lg font-medium">Transport Partners</p>
              </motion.div>
            </motion.div>

            {/* Card 3 - Small: Secure Payments */}
            <motion.div
              className="md:col-span-5 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-8 hover:border-[#b35a44]/50 transition-all duration-500"
              whileHover={{ 
                rotateY: 2, 
                rotateX: -2,
                scale: 1.02
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Shield className="w-16 h-16 text-[#b35a44] mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-white mb-2">100%</h3>
                <p className="text-slate-400 text-lg font-medium">Secure Payments</p>
              </motion.div>
            </motion.div>

            {/* Card 4 - Medium: 24/7 Support */}
            <motion.div
              className="md:col-span-7 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-8 hover:border-[#b35a44]/50 transition-all duration-500"
              whileHover={{ 
                rotateY: -2, 
                rotateX: -2
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-4">24/7 Support</h3>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    Round-the-clock assistance whenever you need it. 
                    Our dedicated support team is always ready to help.
                  </p>
                </div>
                <motion.div
                  whileHover={{ 
                    scale: 1.2,
                    filter: 'drop-shadow(0 0 20px rgba(179, 90, 68, 0.6))'
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Headphones className="w-20 h-20 text-[#b35a44]" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Meet the Team Section */}
      <motion.section 
        className="py-20 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-white text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Meet Our <span className="text-[#b35a44]">Team</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <motion.div
                  className="relative mb-6 mx-auto w-32 h-32"
                  whileHover={{ 
                    scale: 1.1,
                    filter: 'drop-shadow(0 0 30px rgba(179, 90, 68, 0.6))'
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover border-2 border-[#b35a44] shadow-lg"
                    style={{ boxShadow: '0 0 20px rgba(179, 90, 68, 0.4)' }}
                    onError={(e) => {
                      e.target.style.backgroundColor = '#b35a44';
                      e.target.style.color = 'white';
                      e.target.style.display = 'flex';
                      e.target.style.alignItems = 'center';
                      e.target.style.justifyContent = 'center';
                      e.target.innerHTML = member.name.split(' ').map(n => n[0]).join('');
                    }}
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#b35a44]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-[#b35a44] font-semibold mb-3">{member.role}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Our Story Section */}
      <motion.section 
        className="py-20 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.h2 
            className="text-4xl font-bold text-white text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our <span className="text-[#b35a44]">Story</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Story Card 1 */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#b35a44] via-purple-500 to-cyan-400 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-[#b35a44]/5 to-transparent rounded-3xl"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#b35a44] to-orange-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <span className="text-2xl font-bold text-white">🚀</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">The Beginning</h3>
                  <p className="text-slate-400 leading-relaxed">
                    In 2020, amid the challenges that changed how we travel, our founders Sarah Ahmed and Rafiul Islam 
                    recognized a critical gap in Bangladesh's transportation booking system. Travelers were frustrated 
                    with fragmented booking processes, unreliable information, and limited options.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Story Card 2 */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-[#b35a44] rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-3xl"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-[#b35a44] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <span className="text-2xl font-bold text-white">💡</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">The Vision</h3>
                  <p className="text-slate-400 leading-relaxed">
                    We envisioned a platform that would unite all transport modes—bus, train, launch, and flights—under 
                    one digital roof. Our mission was clear: make travel booking as simple as ordering food online, 
                    but with the reliability and security that travelers deserve.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Story Card 3 */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-[#b35a44] to-pink-400 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-3xl"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-[#b35a44] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <span className="text-2xl font-bold text-white">🌟</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">The Growth</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Today, Uraan serves over 50,000 travelers monthly, partnering with 200+ transport operators 
                    across Bangladesh. From a small team of dreamers, we've grown into a trusted platform that 
                    processes thousands of bookings daily with 99.9% uptime.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Story Card 4 */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#b35a44] via-yellow-400 to-green-400 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-3xl"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-[#b35a44] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <span className="text-2xl font-bold text-white">🚀</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">The Future</h3>
                  <p className="text-slate-400 leading-relaxed">
                    We're building tomorrow's travel experience today. With AI-powered recommendations, real-time 
                    tracking, and seamless multi-modal journeys, Uraan is set to become the ultimate travel companion 
                    for every Bangladeshi traveler.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
