import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { compareModels } from '../services/api';
import { useApp } from '../context/AppContext';
import { BarChart2, RefreshCw, Zap, Trophy, TrendingUp, Activity, Cpu, Clock } from 'lucide-react';
import { fadeIn, staggerContainer } from '../animations/variants';

export const ModelsArena = () => {
  const { addToast } = useApp();
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeModel, setActiveModel] = useState(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await compareModels();
      setLeaderboard(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to fetch models leaderboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="space-y-12 py-6 max-w-7xl mx-auto px-4 relative min-h-screen">
      {/* Background Orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-40 right-20 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Header */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="text-center space-y-4">
        <motion.div variants={fadeIn} className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-card text-xs font-mono text-indigo-300 border border-indigo-500/30">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span>The Ultimate Algorithm Showdown</span>
        </motion.div>
        <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          AI Models <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Arena</span>
        </motion.h1>
        <motion.p variants={fadeIn} className="text-slate-400 max-w-2xl mx-auto">
          Watch 13 state-of-the-art regression models battle it out in real-time. We train them instantly and rank them based on their predictive accuracy (R² Score) on the TCS dataset.
        </motion.p>
        <motion.div variants={fadeIn} className="pt-4">
          <button
            onClick={fetchLeaderboard}
            disabled={loading}
            className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/30 flex items-center justify-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Training Models...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Run Arena Match</span>
              </>
            )}
          </button>
        </motion.div>
      </motion.div>

      {/* Loading State */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center py-20 space-y-6"
          >
            <div className="relative">
              <Cpu className="w-16 h-16 text-indigo-500 animate-pulse" />
              <div className="absolute inset-0 border-t-2 border-cyan-400 rounded-full animate-spin" />
            </div>
            <p className="text-lg font-medium text-slate-300 animate-pulse">
              Simulating parallel training of 13 models...
            </p>
          </motion.div>
        )}

        {!loading && leaderboard && (
          <motion.div
            key="leaderboard"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10"
          >
            {leaderboard.map((item, index) => (
              <motion.div
                key={item.Model_Name}
                variants={fadeIn}
                whileHover={{ y: -10, scale: 1.02 }}
                onHoverStart={() => setActiveModel(item.Model_Name)}
                onHoverEnd={() => setActiveModel(null)}
              >
                <GlassCard
                  tilt={true}
                  className={`h-full border transition-all duration-300 relative overflow-hidden ${
                    index === 0 
                      ? 'border-yellow-500/50 shadow-2xl shadow-yellow-500/10' 
                      : index < 3 
                        ? 'border-indigo-500/30' 
                        : 'border-slate-800'
                  }`}
                >
                  {/* Rank Badge */}
                  <div className={`absolute top-0 right-0 w-16 h-16 flex items-start justify-end p-3 ${
                    index === 0 ? 'bg-gradient-to-bl from-yellow-500/20 to-transparent' : ''
                  }`}>
                    <span className={`text-xl font-black italic ${
                      index === 0 ? 'text-yellow-400' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-orange-400' : 'text-slate-600'
                    }`}>
                      #{item.Rank}
                    </span>
                  </div>

                  <div className="space-y-4 z-10 relative">
                    <h3 className={`text-xl font-bold truncate pr-10 ${index === 0 ? 'text-yellow-300' : 'text-white'}`}>
                      {item.Model_Name}
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">R² Score</span>
                        <div className="text-2xl font-black text-emerald-400 font-mono">
                          {(item.R2_Score * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">MAPE Error</span>
                        <div className="text-lg font-bold text-rose-400 font-mono">
                          {(item.MAPE * 100).toFixed(2)}%
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700/50 grid grid-cols-2 gap-2 text-xs text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Activity className="w-3.5 h-3.5 text-cyan-400" />
                        <span>RMSE: {item.RMSE.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Train: {item.Training_Time.toFixed(3)}s</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic background gradient for top 3 */}
                  {index < 3 && (
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
