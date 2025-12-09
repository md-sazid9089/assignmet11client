import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiLock } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const { user, userRole, login, loginWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Helper function to redirect by role
  const redirectByRole = (role) => {
    console.log('🚀 Redirecting user with role:', role);
    if (role === 'admin') {
      navigate('/admin', { replace: true });
    } else if (role === 'vendor') {
      navigate('/dashboard/add-ticket', { replace: true });
    } else {
      navigate('/dashboard/profile', { replace: true });
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    console.log('👤 Login useEffect - user:', user?.email, 'role:', userRole);
    if (user && userRole) {
      redirectByRole(userRole);
    }
  }, [user, userRole, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // userRole will be updated in AuthContext, triggering useEffect redirect
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // userRole will be updated in AuthContext, triggering useEffect redirect
    } catch (error) {
      console.error(error);
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
