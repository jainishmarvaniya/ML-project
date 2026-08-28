import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Cpu, LayoutDashboard, LineChart, Award, Info, X, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { name: 'Home', path: '/', icon: TrendingUp },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Prediction', path: '/prediction', icon: Cpu },
    { name: 'Data Visualization', path: '/visualization', icon: LineChart },
    { name: 'Models Arena', path: '/arena', icon: Award },
    { name: 'About', path: '/about', icon: Info },
  ];

  const { theme, toggleTheme } = useApp();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-72 glass-card border-l border-slate-700/60 p-6 flex flex-col justify-between md:hidden bg-[#030712]/95"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <Link to="/" onClick={onClose} className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-base text-white">TCS AI Stock</span>
                </Link>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-6 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                            : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                        }`
                      }
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-slate-800 space-y-3">
              {/* Theme Toggle – visible in mobile drawer */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl glass-card text-sm font-mono border border-cyan-500/20 hover:bg-cyan-500/10 transition"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-yellow-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-500" />
                )}
                <span className="text-cyan-300">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>

              <Link
                to="/prediction"
                onClick={onClose}
                className="w-full flex items-center justify-center py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90"
              >
                Start Prediction
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
