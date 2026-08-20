import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      path: '/income',
      label: 'Income',
      icon: TrendingUp,
    },
    {
      path: '/expense',
      label: 'Expense',
      icon: TrendingDown,
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-700 bg-clip-text text-transparent">
            Menu
          </span>
          <button onClick={() => setMobileOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed top-16 bottom-0 left-0 z-30 bg-white border-r border-gray-100 transition-all duration-300 shadow-sm ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Toggle Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 text-gray-500 hover:text-teal-600 hover:border-teal-300 shadow-sm transition-all"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <nav className="p-4 space-y-2 flex-1 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3 rounded-xl font-medium transition-all ${
                    collapsed ? 'justify-center px-0' : 'px-4'
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
                  }`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
