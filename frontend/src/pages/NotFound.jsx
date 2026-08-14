import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <GlassCard className="max-w-md w-full p-8 text-center space-y-6 border border-rose-500/30">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400"
        >
          <AlertCircle className="w-10 h-10" />
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold text-white tracking-tight font-mono">404</h1>
          <h2 className="text-xl font-bold text-slate-200">Page Not Found</h2>
          <p className="text-xs text-slate-400">
            The page or resource route you requested does not exist on this dashboard.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center justify-center space-x-2 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs hover:opacity-90 transition shadow-lg shadow-cyan-500/20"
        >
          <Home className="w-4 h-4" />
          <span>Return to Home Dashboard</span>
        </Link>
      </GlassCard>
    </div>
  );
};
