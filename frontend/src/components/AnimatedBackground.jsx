import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export const AnimatedBackground = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Grid Mesh */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />

      {/* Floating Blob 1 – Blue */}
      <motion.div
        animate={{ x: [0, 50, -50, 0], y: [0, -60, 40, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl transition-colors duration-500"
        style={{ background: isDark ? 'rgba(37,99,235,0.22)' : 'rgba(37,99,235,0.10)' }}
      />

      {/* Floating Blob 2 – Purple */}
      <motion.div
        animate={{ x: [0, -40, 60, 0], y: [0, 50, -30, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full blur-3xl transition-colors duration-500"
        style={{ background: isDark ? 'rgba(124,58,237,0.18)' : 'rgba(124,58,237,0.08)' }}
      />

      {/* Floating Blob 3 – Cyan */}
      <motion.div
        animate={{ x: [0, 60, -40, 0], y: [0, -40, 50, 0], scale: [1, 1.15, 0.85, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full blur-3xl transition-colors duration-500"
        style={{ background: isDark ? 'rgba(6,182,212,0.15)' : 'rgba(6,182,212,0.08)' }}
      />

      {/* Vignette Overlay */}
      {isDark && (
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#030712]/50 to-[#030712]" />
      )}
    </div>
  );
};
