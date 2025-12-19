import { Link, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock, FiUser, FiShield, FiImage } from "react-icons/fi";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import api from "../../config/api";
import logo from "../../assets/logo.png";
const Register = () => {
  const { createUser, loginWithGoogle, updateUserProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('user');
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();
  
  const password = watch('password');

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create Firebase user
      const result = await createUser(data.email, data.password);
      // // console.log('✅ Firebase user created:', result.user.email);
      
      // Step 2: Update Firebase profile
      await updateUserProfile(data.name, data.photoURL || '');
      // // console.log('✅ Profile updated');
      
      // Step 3: Create backend user with selected role
      const backendResponse = await api.post('/users/create', {
        name: data.name,
        email: data.email,
        photoURL: data.photoURL || '',
        firebaseUid: result.user.uid,
        role: selectedRole
      });
      
      // // console.log('✅ Backend user created:', backendResponse.data.user);
      
      // Step 4: Generate token
      const tokenResponse = await api.post('/users/jwt', {
        email: result.user.email
      });
      
      // Step 5: Store user data
      localStorage.setItem('token', tokenResponse.data.token);
      localStorage.setItem('userId', tokenResponse.data.user._id);
      localStorage.setItem('userRole', tokenResponse.data.user.role);
      
      // Step 6: Success message and redirect
      toast.success(`Welcome to Uraan! Account created as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`);
      
      // Redirect all new users to home page
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      toast.error(error.response?.data?.message || error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      // Step 1: Google authentication
      const result = await loginWithGoogle();
      // // console.log('✅ Google registration:', result.user.email);
      
      // Step 2: Create backend user with selected role
      const backendResponse = await api.post('/users/create', {
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        firebaseUid: result.user.uid,
        role: selectedRole
      });
      
      // Step 3: Generate token
      const tokenResponse = await api.post('/users/generate-token', {
        email: result.user.email
      });
      
      // Step 4: Store user data
      localStorage.setItem('token', tokenResponse.data.token);
      localStorage.setItem('userId', tokenResponse.data.user._id);
      localStorage.setItem('userRole', tokenResponse.data.user.role);
      
      toast.success(`Welcome to Uraan! Registered as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`);
      
      // Redirect all new users to home page
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
      
    } catch (error) {
      console.error('❌ Google registration error:', error);
      toast.error(error.response?.data?.message || error.message || "Google registration failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Side - Branding Area (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Travel Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80')`
          }}
        />
        
        {/* Clay to Transparent Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#b35a44]/70 via-[#b35a44]/40 to-transparent" />
        <div className="absolute inset-0 bg-slate-950/30" />
        
        {/* Branding Content */}
        <div className="relative z-10 flex flex-col justify-center items-start text-left p-12 ml-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="w-20 h-20 mb-8">
              <img src={logo} alt="Uraan" className="w-full h-full object-contain filter brightness-0 invert drop-shadow-lg" />
            </div>
            
            <motion.h1 
              className="text-5xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Join the<br />
              <span className="text-6xl bg-gradient-to-r from-white via-slate-200 to-white bg-clip-text text-transparent">
                Uraan
              </span><br />
              Community
            </motion.h1>
            
            <motion.p 
              className="text-xl text-slate-200 max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Start your journey with thousands of travelers. Book tickets, explore destinations, and create memories that last a lifetime.
            </motion.p>
            
            <motion.div 
              className="flex items-center space-x-3 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-3 h-3 bg-white/60 rounded-full"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: index * 0.3,
                    ease: "easeInOut" 
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.7,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          className="w-full max-w-md"
        >
          {/* Glassmorphic Card with Gradient Border */}
          <div className="relative p-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-transparent to-[#b35a44]">
            <div className="bg-slate-950/40 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Create Account
                </h2>
                <p className="text-slate-400">
                  Join Uraan and start your travel journey
                </p>
              </div>

              <motion.form 
                onSubmit={handleSubmit(onSubmit)}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {/* Role Selection */}
                <motion.div variants={itemVariants} className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-200 mb-4">Select Account Type</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {/* User Role Card */}
                    <motion.button
                      type="button"
                      onClick={() => setSelectedRole('user')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        selectedRole === 'user'
                          ? 'border-[#b35a44] bg-[#b35a44]/10 shadow-[0_0_20px_rgba(179,90,68,0.3)]'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <FiUser className={`w-6 h-6 mx-auto mb-2 ${
                        selectedRole === 'user' ? 'text-[#b35a44]' : 'text-slate-400'
                      }`} />
                      <p className={`text-sm font-medium ${
                        selectedRole === 'user' ? 'text-white' : 'text-slate-400'
                      }`}>
                        Traveler
                      </p>
                    </motion.button>

                    {/* Vendor Role Card */}
                    <motion.button
                      type="button"
                      onClick={() => setSelectedRole('vendor')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        selectedRole === 'vendor'
                          ? 'border-[#b35a44] bg-[#b35a44]/10 shadow-[0_0_20px_rgba(179,90,68,0.3)]'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <FiShield className={`w-6 h-6 mx-auto mb-2 ${
                        selectedRole === 'vendor' ? 'text-[#b35a44]' : 'text-slate-400'
                      }`} />
                      <p className={`text-sm font-medium ${
                        selectedRole === 'vendor' ? 'text-white' : 'text-slate-400'
                      }`}>
                        Vendor
                      </p>
                    </motion.button>
                  </div>
                </motion.div>

                {/* Full Name Input */}
                <motion.div variants={itemVariants} className="relative group">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 transition-colors group-focus-within:text-[#b35a44]" />
                  <input
                    type="text"
                    {...register("name", { required: "Full name is required" })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/60 border border-slate-700 rounded-2xl text-slate-400 placeholder-transparent focus:outline-none focus:border-[#b35a44] focus:ring-2 focus:ring-[#b35a44]/20 transition-all peer"
                    placeholder="Full Name"
                  />
                  <label className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none transition-all duration-300 peer-focus:-translate-y-8 peer-focus:text-xs peer-focus:text-[#b35a44] peer-focus:bg-slate-900 peer-focus:px-2 peer-focus:rounded peer-[:not(:placeholder-shown)]:-translate-y-8 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400 peer-[:not(:placeholder-shown)]:bg-slate-900 peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:rounded">
                    Full Name
                  </label>
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                      <span>⚠</span> {errors.name.message}
                    </p>
                  )}
                </motion.div>

                {/* Email Input */}
                <motion.div variants={itemVariants} className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 transition-colors group-focus-within:text-[#b35a44]" />
                  <input
                    type="email"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/60 border border-slate-700 rounded-2xl text-slate-400 placeholder-transparent focus:outline-none focus:border-[#b35a44] focus:ring-2 focus:ring-[#b35a44]/20 transition-all peer"
                    placeholder="Email Address"
                  />
                  <label className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none transition-all duration-300 peer-focus:-translate-y-8 peer-focus:text-xs peer-focus:text-[#b35a44] peer-focus:bg-slate-900 peer-focus:px-2 peer-focus:rounded peer-[:not(:placeholder-shown)]:-translate-y-8 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400 peer-[:not(:placeholder-shown)]:bg-slate-900 peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:rounded">
                    Email Address
                  </label>
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                      <span>⚠</span> {errors.email.message}
                    </p>
                  )}
                </motion.div>

                {/* Profile Image URL Input */}
                <motion.div variants={itemVariants} className="relative group">
                  <FiImage className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 transition-colors group-focus-within:text-[#b35a44]" />
                  <input
                    type="url"
                    {...register("photoURL", { 
                      pattern: {
                        value: /^https?:\/\/.+/i,
                        message: "Please enter a valid URL"
                      }
                    })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/60 border border-slate-700 rounded-2xl text-slate-400 placeholder-transparent focus:outline-none focus:border-[#b35a44] focus:ring-2 focus:ring-[#b35a44]/20 transition-all peer"
                    placeholder="Profile Image URL"
                  />
                  <label className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none transition-all duration-300 peer-focus:-translate-y-8 peer-focus:text-xs peer-focus:text-[#b35a44] peer-focus:bg-slate-900 peer-focus:px-2 peer-focus:rounded peer-[:not(:placeholder-shown)]:-translate-y-8 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400 peer-[:not(:placeholder-shown)]:bg-slate-900 peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:rounded">
                    Profile Image URL (Optional)
                  </label>
                  {errors.photoURL && (
                    <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                      <span>⚠</span> {errors.photoURL.message}
                    </p>
                  )}
                </motion.div>

                {/* Password Input */}
                <motion.div variants={itemVariants} className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 transition-colors group-focus-within:text-[#b35a44]" />
                  <input
                    type="password"
                    {...register("password", { 
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                        message: "Password must contain uppercase, lowercase, and at least 6 characters"
                      }
                    })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/60 border border-slate-700 rounded-2xl text-slate-400 placeholder-transparent focus:outline-none focus:border-[#b35a44] focus:ring-2 focus:ring-[#b35a44]/20 transition-all peer"
                    placeholder="Password"
                  />
                  <label className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none transition-all duration-300 peer-focus:-translate-y-8 peer-focus:text-xs peer-focus:text-[#b35a44] peer-focus:bg-slate-900 peer-focus:px-2 peer-focus:rounded peer-[:not(:placeholder-shown)]:-translate-y-8 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400 peer-[:not(:placeholder-shown)]:bg-slate-900 peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:rounded">
                    Password
                  </label>
                  {errors.password && (
                    <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                      <span>⚠</span> {errors.password.message}
                    </p>
                  )}
                </motion.div>

                {/* Confirm Password Input */}
                <motion.div variants={itemVariants} className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 transition-colors group-focus-within:text-[#b35a44]" />
                  <input
                    type="password"
                    {...register("confirmPassword", { 
                      required: "Please confirm your password",
                      validate: (value) => value === password || "Passwords don't match"
                    })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/60 border border-slate-700 rounded-2xl text-slate-400 placeholder-transparent focus:outline-none focus:border-[#b35a44] focus:ring-2 focus:ring-[#b35a44]/20 transition-all peer"
                    placeholder="Confirm Password"
                  />
                  <label className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none transition-all duration-300 peer-focus:-translate-y-8 peer-focus:text-xs peer-focus:text-[#b35a44] peer-focus:bg-slate-900 peer-focus:px-2 peer-focus:rounded peer-[:not(:placeholder-shown)]:-translate-y-8 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400 peer-[:not(:placeholder-shown)]:bg-slate-900 peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:rounded">
                    Confirm Password
                  </label>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                      <span>⚠</span> {errors.confirmPassword.message}
                    </p>
                  )}
                </motion.div>

                {/* Register Button with Clay Background and Loading Spinner */}
                <motion.button 
                  variants={itemVariants}
                  type="submit" 
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full py-4 bg-[#b35a44] hover:bg-[#a04b36] disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#b35a44]/25 flex items-center justify-center gap-2"
                >
                  {loading && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  )}
                  {loading ? 'Creating Account...' : 'Create Account'}
                </motion.button>
              </motion.form>

              {/* Divider */}
              <div className="my-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-slate-950/40 text-slate-400">
                      Or continue with
                    </span>
                  </div>
                </div>
              </div>

              {/* Google Registration Button */}
              <motion.button
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: googleLoading ? 1 : 1.02 }}
                whileTap={{ scale: googleLoading ? 1 : 0.98 }}
                className="w-full flex items-center justify-center gap-3 py-4 border border-slate-800 hover:border-slate-600 disabled:border-slate-700 disabled:cursor-not-allowed rounded-2xl text-white font-medium transition-all hover:bg-slate-900/30 disabled:bg-slate-900/20"
              >
                {googleLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full"
                  />
                ) : (
                  <FcGoogle size={24} />
                )}
                {googleLoading ? 'Creating Account...' : 'Continue with Google'}
              </motion.button>

              {/* Login Link */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 text-center text-slate-400"
              >
                Already have an account?{' '}
                <Link to="/login" className="text-[#b35a44] hover:text-[#a04b36] font-semibold transition-colors">
                  Login here
                </Link>
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;

