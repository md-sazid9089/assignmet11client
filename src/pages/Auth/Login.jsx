import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiLock, FiGithub } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../config/api';
import logo from '../../assets/logo.png';

const ADMIN_EMAIL = 'sazid98@gmail.com';
const VENDOR_EMAIL = 'abrar98@gmail.com';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const { user, userRole, login, loginWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({ google: false, github: false });
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Helper function to redirect by role with email-specific checks
  const redirectByRole = (currentEmail, role) => {
    console.log('🚀 Redirecting user with email:', currentEmail, 'role:', role);
    
    // Force admin routing for specific email (opens in NEW tab)
    if (currentEmail === ADMIN_EMAIL) {
      console.log('🔐 Admin email detected, opening admin dashboard in new tab');
      const adminWindow = window.open('/dashboard/admin/dashboard', '_blank');
      if (adminWindow) {
        console.log('✅ Admin dashboard opened in new tab');
        toast.success('Admin Dashboard opened in new tab!', { duration: 4000 });
        navigate('/', { replace: true });
      } else {
        console.warn('⚠️ Popup blocked, redirecting in same window');
        toast.error('Please allow popups for this site. Redirecting in same window...');
        navigate('/dashboard/admin/dashboard', { replace: true });
      }
      return;
    }
    
    // Force vendor routing for specific email (same tab)
    if (currentEmail === VENDOR_EMAIL || role === 'vendor') {
      console.log('🏪 Vendor email/role detected, redirecting to vendor dashboard in same tab');
      toast.success('Welcome Vendor!', { duration: 3000 });
      navigate('/dashboard/vendor/profile', { replace: true });
      return;
    }
    
    // Standard role-based routing for other users
    if (role === 'admin') {
      const adminWindow = window.open('/dashboard/admin/dashboard', '_blank');
      if (adminWindow) {
        console.log('✅ Admin dashboard opened in new tab');
        toast.success('Admin Dashboard opened in new tab!', { duration: 4000 });
        navigate('/', { replace: true });
      } else {
        console.warn('⚠️ Popup blocked, redirecting in same window');
        toast.error('Please allow popups for this site. Redirecting in same window...');
        navigate('/dashboard/admin/dashboard', { replace: true });
      }
    } else {
      console.log('👤 User role detected, redirecting to user dashboard');
      navigate('/dashboard/user/profile', { replace: true });
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    console.log('👤 Login useEffect - user:', user?.email, 'role:', userRole);
    if (user && userRole) {
      redirectByRole(user.email, userRole);
    }
  }, [user, userRole, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('🔄 Starting login process for:', email);
    
    try {
      // Step 1: Firebase Authentication
      const firebaseResult = await login(email, password);
      console.log('✅ Firebase login successful for:', email);
      
      // Step 2: Get user role from backend
      const response = await api.post('/users/generate-token', { 
        email: firebaseResult.user.email 
      });
      
      const { user: backendUser, token } = response.data;
      console.log('✅ Backend authentication successful:', backendUser);
      
      // Step 3: Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('userId', backendUser._id);
      localStorage.setItem('userRole', backendUser.role);
      
      // Step 4: Show redirecting state
      setIsLoading(false);
      setIsRedirecting(true);
      
      // Step 5: Role-based redirection with smooth transition
      const redirectDelay = 1000; // 1 second smooth transition
      
      setTimeout(() => {
        switch (backendUser.role) {
          case 'admin':
            console.log('🔐 Redirecting to admin dashboard');
            toast.success('Welcome Admin!', { duration: 3000 });
            navigate('/dashboard/admin/dashboard', { replace: true });
            break;
          case 'vendor':
            console.log('🏪 Redirecting to vendor dashboard');
            toast.success('Welcome Vendor!', { duration: 3000 });
            navigate('/dashboard/vendor/profile', { replace: true });
            break;
          default:
            console.log('👤 Redirecting to home page');
            toast.success('Welcome back!', { duration: 3000 });
            navigate('/', { replace: true });
            break;
        }
        setIsRedirecting(false);
      }, redirectDelay);
      
    } catch (error) {
      console.error('❌ Login error:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      // Detailed error messages
      if (error.response?.status === 500) {
        toast.error('Server error: Please check backend logs', { duration: 5000 });
      } else if (error.response?.status === 404) {
        toast.error('User not found. Please register first.');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password');
      } else if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email');
      } else {
        toast.error(error.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
      setIsRedirecting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSocialLoading({ ...socialLoading, google: true });
    console.log('🔄 Starting Google login process');
    
    try {
      // Step 1: Firebase Google Authentication
      const result = await loginWithGoogle();
      console.log('✅ Google login successful:', result?.user?.email);
      
      // Step 2: Get user role from backend
      const response = await api.post('/users/generate-token', { 
        email: result.user.email 
      });
      
      const { user: backendUser, token } = response.data;
      console.log('✅ Backend Google authentication successful:', backendUser);
      
      // Step 3: Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('userId', backendUser._id);
      localStorage.setItem('userRole', backendUser.role);
      
      // Step 4: Show redirecting state
      setSocialLoading({ ...socialLoading, google: false });
      setIsRedirecting(true);
      
      // Step 5: Role-based redirection with smooth transition
      const redirectDelay = 1000;
      
      setTimeout(() => {
        switch (backendUser.role) {
          case 'admin':
            console.log('🔐 Google: Redirecting to admin dashboard');
            toast.success('Welcome Admin!', { duration: 3000 });
            navigate('/dashboard/admin/dashboard', { replace: true });
            break;
          case 'vendor':
            console.log('🏪 Google: Redirecting to vendor dashboard');
            toast.success('Welcome Vendor!', { duration: 3000 });
            navigate('/dashboard/vendor/profile', { replace: true });
            break;
          default:
            console.log('👤 Google: Redirecting to home page');
            toast.success('Welcome back!', { duration: 3000 });
            navigate('/', { replace: true });
            break;
        }
        setIsRedirecting(false);
      }, redirectDelay);
      
    } catch (error) {
      console.error('❌ Google login error:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.status === 500) {
        toast.error('Server error: Please check backend logs', { duration: 5000 });
      } else if (error.response?.status === 404) {
        toast.error('User not found. Please register first.');
      } else {
        toast.error(error.message || 'Google login failed');
      }
    } finally {
      setSocialLoading({ ...socialLoading, google: false });
      setIsRedirecting(false);
    }
  };

  const handleGithubLogin = async () => {
    setSocialLoading({ ...socialLoading, github: true });
    
    try {
      // For now, show a coming soon message since GitHub auth needs additional setup
      toast.success('GitHub login coming soon! Use Google or email for now.', { duration: 3000 });
    } catch (error) {
      console.error('❌ GitHub login error:', error);
      toast.error(error.message || 'GitHub login failed');
    } finally {
      setSocialLoading({ ...socialLoading, github: false });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(resetEmail);
      setShowForgot(false);
      setResetEmail('');
    } catch (error) {
      console.error(error);
    }
  };

  if (showForgot) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          <div className="bg-slate-950/40 backdrop-blur-2xl rounded-3xl p-8 border border-transparent bg-gradient-to-r from-cyan-500/20 via-transparent to-[#b35a44]/20 bg-clip-border shadow-2xl">
            <div className="bg-slate-950/60 rounded-2xl p-6 -m-1">
              <h2 className="text-3xl font-bold text-white text-center mb-2">
                Reset Password
              </h2>
              <p className="text-slate-400 text-center mb-6">
                Enter your email to reset your password
              </p>
              
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 transition-colors group-focus-within:text-[#b35a44]" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-[#b35a44] focus:ring-2 focus:ring-[#b35a44]/20 transition-all"
                    placeholder="your@email.com"
                    required
                  />
                  <label className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none transition-all duration-300 group-focus-within:-translate-y-8 group-focus-within:text-xs group-focus-within:text-[#b35a44] group-focus-within:bg-slate-900 group-focus-within:px-2 group-focus-within:rounded">
                    Email Address
                  </label>
                </div>

                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-[#b35a44] hover:bg-[#a04b36] text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#b35a44]/25"
                >
                  Send Reset Link
                </motion.button>

                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="w-full text-center text-slate-400 hover:text-white font-semibold transition-colors"
                >
                  Back to Login
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Side - Branding Area (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Transport Background with Blur */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2969&q=80')`
          }}
        />
        <div className="absolute inset-0 backdrop-blur-sm bg-slate-950/50" />
        
        {/* Branding Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <motion.div 
              className="w-24 h-24 mx-auto mb-8"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <img src={logo} alt="Uraan" className="w-full h-full object-contain filter brightness-0 invert drop-shadow-lg" />
            </motion.div>
            <motion.h1 
              className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white via-slate-200 to-white bg-clip-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Uraan
            </motion.h1>
            <motion.p 
              className="text-xl text-slate-300 max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Your gateway to seamless travel experiences across Bangladesh
            </motion.p>
            <motion.div 
              className="flex items-center justify-center space-x-4 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.div 
                className="w-3 h-3 bg-[#b35a44] rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              <motion.div 
                className="w-3 h-3 bg-cyan-400 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
              <motion.div 
                className="w-3 h-3 bg-[#b35a44] rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
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
                  Welcome Back
                </h2>
                <p className="text-slate-400">
                  Sign in to continue your journey
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Input with Floating Label */}
                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 transition-colors group-focus-within:text-[#b35a44]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white placeholder-transparent focus:outline-none focus:border-[#b35a44] focus:ring-2 focus:ring-[#b35a44]/20 transition-all peer"
                    placeholder="your@email.com"
                    required
                  />
                  <label className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none transition-all duration-300 peer-focus:-translate-y-8 peer-focus:text-xs peer-focus:text-[#b35a44] peer-focus:bg-slate-900 peer-focus:px-2 peer-focus:rounded peer-[:not(:placeholder-shown)]:-translate-y-8 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400 peer-[:not(:placeholder-shown)]:bg-slate-900 peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:rounded">
                    Email Address
                  </label>
                </div>

                {/* Password Input with Floating Label */}
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 transition-colors group-focus-within:text-[#b35a44]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white placeholder-transparent focus:outline-none focus:border-[#b35a44] focus:ring-2 focus:ring-[#b35a44]/20 transition-all peer"
                    placeholder="••••••••"
                    required
                  />
                  <label className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none transition-all duration-300 peer-focus:-translate-y-8 peer-focus:text-xs peer-focus:text-[#b35a44] peer-focus:bg-slate-900 peer-focus:px-2 peer-focus:rounded peer-[:not(:placeholder-shown)]:-translate-y-8 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400 peer-[:not(:placeholder-shown)]:bg-slate-900 peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:rounded">
                    Password
                  </label>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-sm text-slate-400 hover:text-[#b35a44] font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login Button with Clay Background and Glow */}
                <motion.button 
                  type="submit" 
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="w-full py-4 bg-[#b35a44] hover:bg-[#a04b36] disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#b35a44]/25 flex items-center justify-center gap-2"
                >
                  {isLoading && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  )}
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </motion.button>
              </form>

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

              {/* Social Login Buttons */}
              <div className="space-y-4">
                <motion.button
                  onClick={handleGoogleLogin}
                  disabled={socialLoading.google}
                  whileHover={{ scale: socialLoading.google ? 1 : 1.02 }}
                  whileTap={{ scale: socialLoading.google ? 1 : 0.98 }}
                  className="w-full flex items-center justify-center gap-3 py-4 border border-slate-800 hover:border-slate-600 disabled:border-slate-700 disabled:cursor-not-allowed rounded-2xl text-white font-medium transition-all hover:bg-slate-900/30 disabled:bg-slate-900/20"
                >
                  {socialLoading.google ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full"
                    />
                  ) : (
                    <FcGoogle size={24} />
                  )}
                  {socialLoading.google ? 'Connecting...' : 'Continue with Google'}
                </motion.button>

                <motion.button
                  onClick={handleGithubLogin}
                  disabled={socialLoading.github}
                  whileHover={{ scale: socialLoading.github ? 1 : 1.02 }}
                  whileTap={{ scale: socialLoading.github ? 1 : 0.98 }}
                  className="w-full flex items-center justify-center gap-3 py-4 border border-slate-800 hover:border-slate-600 disabled:border-slate-700 disabled:cursor-not-allowed rounded-2xl text-white font-medium transition-all hover:bg-slate-900/30 disabled:bg-slate-900/20"
                >
                  {socialLoading.github ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full"
                    />
                  ) : (
                    <FiGithub size={24} />
                  )}
                  {socialLoading.github ? 'Connecting...' : 'Continue with GitHub'}
                </motion.button>
              </div>

              {/* Sign Up Link */}
              <p className="mt-8 text-center text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#b35a44] hover:text-[#a04b36] font-semibold transition-colors">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Redirecting Overlay */}
      {isRedirecting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-8 text-center shadow-2xl border border-slate-700"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-[#b35a44] border-t-transparent rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-white mb-2">Redirecting...</h3>
            <p className="text-slate-400">Taking you to your dashboard</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Login;
