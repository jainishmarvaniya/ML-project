import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Cpu, LayoutDashboard, LineChart, Award, Info, Menu, Moon, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar = ({ onOpenMobileMenu }) => {
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
    <header className="sticky top-4 z-40 px-4 sm:px-8 max-w-7xl mx-auto w-full">
      <div className="glass-card rounded-2xl border border-white/10 px-4 lg:px-6 py-3 flex items-center justify-between shadow-2xl backdrop-blur-xl bg-[#030712]/70">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white block leading-tight">
              TCS<span className="gradient-text ml-1">AI Stock</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative px-3.5 py-2 rounded-xl text-xs lg:text-sm font-medium transition-all flex items-center space-x-2 ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navGlow"
                        className="absolute inset-0 rounded-xl bg-cyan-500/10 border border-cyan-500/30 -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="hidden sm:inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl glass-card text-xs font-mono text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/10 transition"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-yellow-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-500" />
            )}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* Quick CTA */}
          <Link
            to="/prediction"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 hover:opacity-90 transition-opacity shadow-lg shadow-blue-600/25 active:scale-95"
          >
            Predict Now
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl glass-card text-slate-300 hover:text-white border border-slate-700/60"
            aria-label="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
