import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, LogOut, ChevronDown, Wallet } from 'lucide-react';
import logoImg from '../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 md:px-8 max-w-7xl mx-auto">
        
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3">
          {logoImg ? (
            <img src={logoImg} alt="Track Expense" className="w-10 h-10 object-contain rounded-lg" />
          ) : (
            <div className="p-2 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl text-white">
              <Wallet className="w-6 h-6" />
            </div>
          )}
          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-700 bg-clip-text text-transparent">
            Track Expense
          </span>
        </Link>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
          >
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-cyan-500 text-white font-bold text-sm shadow-sm">
              {getInitials(user?.name)}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold text-gray-800 truncate max-w-[120px]">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate max-w-[140px]">
                {user?.email || ''}
              </p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>

              <div className="p-1">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-xl transition-colors font-medium"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium text-left mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
