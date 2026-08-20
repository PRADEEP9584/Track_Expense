import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import logoImg from '../assets/logo.png';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-8 text-center text-white">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 shadow-inner">
            <img src={logoImg} alt="Track Expense" className="w-10 h-10 object-contain" />
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-teal-100 text-sm mt-1">Sign in to manage your finances</p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>

          <div className="pt-4 text-center text-sm text-gray-600 border-t border-gray-100">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-teal-600 hover:underline">
              Create an account
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Login;
