import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
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
    console.log('🔄 Starting login process for:', email);
    
    try {
      const result = await login(email, password);
      console.log('✅ Login successful for:', email);
      console.log('📊 Login result:', result);
      
      // Force admin role check for specific email
      if (email === ADMIN_EMAIL) {
        console.log('🔐 Admin email login detected, forcing redirect');
        // Redirect will happen via useEffect when userRole updates
      }
      
      // Force vendor role check for specific email
      if (email === VENDOR_EMAIL) {
        console.log('🏪 Vendor email login detected, forcing redirect');
        // Redirect will happen via useEffect when userRole updates
      }
      
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
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password');
      } else if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email');
      } else {
        toast.error(error.message || 'Login failed');
      }
    }
  };

  const handleGoogleLogin = async () => {
    console.log('🔄 Starting Google login process');
    
    try {
      const result = await loginWithGoogle();
      console.log('✅ Google login successful for:', result?.user?.email);
      console.log('📊 Google login result:', result);
      
      // Force admin role check for specific email
      if (result?.user?.email === ADMIN_EMAIL) {
        console.log('🔐 Admin email Google login detected');
      }
      
      // Force vendor role check for specific email
      if (result?.user?.email === VENDOR_EMAIL) {
        console.log('🏪 Vendor email Google login detected');
      }
      
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
      } else {
        toast.error(error.message || 'Google login failed');
      }
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
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="card max-w-md w-full">
          <h2 className="text-3xl font-bold gradient-text text-center mb-6">
            Reset Password
          </h2>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="input-field pl-12"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full">
              Send Reset Link
            </button>

            <button
              type="button"
              onClick={() => setShowForgot(false)}
              className="w-full text-center text-primary-500 hover:text-primary-600 font-semibold"
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="card max-w-md w-full">
        <h2 className="text-3xl font-bold gradient-text text-center mb-6">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Login to access your account
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-12"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-12"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowForgot(true)}
            className="text-sm text-primary-500 hover:text-primary-600 font-semibold"
          >
            Forgot Password?
          </button>

          <button type="submit" className="btn-primary w-full">
            Login
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-dark-lighter"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-dark-card text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full border-2 border-gray-300 dark:border-dark-lighter hover:bg-gray-50 dark:hover:bg-dark-lighter transition-all font-semibold"
          >
            <FcGoogle size={24} />
            Google
          </button>
        </div>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-500 hover:text-primary-600 font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
