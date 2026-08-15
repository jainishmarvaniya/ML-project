import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { compareModels, getModelRecommendation, predictClosePrice } from '../services/api';
import { useApp } from '../context/AppContext';
import {
  BarChart2, RefreshCw, Zap, Trophy, TrendingUp, Activity,
  Cpu, Clock, Star, ChevronDown, Check, AlertTriangle,
  Target, Brain, Sparkles, ArrowRight
} from 'lucide-react';
import { fadeIn, staggerContainer } from '../animations/variants';

/* ─────────────────────────────────────────────
   Small helper components
───────────────────────────────────────────── */

const InputField = ({ label, name, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">{label}</label>
    <input
      type="number"
      name={name}
      value={value}
      onChange={onChange}
      className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none w-full transition-colors placeholder-slate-600"
    />
  </div>
);

const MetricTile = ({ label, value, color = 'text-cyan-400' }) => (
  <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-700/50 space-y-1">
    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{label}</p>
    <p className={`text-lg font-black font-mono ${color}`}>{value}</p>
  </div>
);

const FitBadge = ({ fit }) => {
  const map = {
    'Good Fit':     { bg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300', icon: <Check className="w-3.5 h-3.5" /> },
    'Overfitting':  { bg: 'bg-red-500/20 border-red-500/40 text-red-300',             icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    'Underfitting': { bg: 'bg-orange-500/20 border-orange-500/40 text-orange-300',    icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  };
  const style = map[fit] ?? map['Good Fit'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${style.bg}`}>
      {style.icon}{fit}
    </span>
  );
};

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */

export const ModelsArena = () => {
  const { addToast } = useApp();

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading]         = useState(false);
  const [activeModel, setActiveModel] = useState(null);

  // Recommendation state
  const [recInputs, setRecInputs] = useState({
    open: '3950', high: '3980', low: '3920', close: '3960', volume: '1500000',
  });
  const [recLoading, setRecLoading]           = useState(false);
  const [recommendation, setRecommendation]   = useState(null);

  // Prediction state
  const [selectedModel, setSelectedModel] = useState(null);
  const [predLoading, setPredLoading]     = useState(false);
  const [predResult, setPredResult]       = useState(null);

  const predSectionRef = useRef(null);
  const leaderboardRef = useRef(null);

  /* ── Leaderboard ── */
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

  /* ── Recommendation ── */
  const handleRecInputChange = (e) => {
    setRecInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGetRecommendation = async () => {
    const { open, high, low, close, volume } = recInputs;
    if (!open || !high || !low || !close || !volume) {
      addToast('Please fill all input fields', 'error');
      return;
    }
    try {
      setRecLoading(true);
      setRecommendation(null);
      const data = await getModelRecommendation({
        Open:   parseFloat(open),
        High:   parseFloat(high),
        Low:    parseFloat(low),
        Close:  parseFloat(close),
        Volume: parseFloat(volume),
      });
      setRecommendation(data);
    } catch (err) {
      addToast('Failed to get recommendation', 'error');
    } finally {
      setRecLoading(false);
    }
  };

  /* ── Use recommended ── */
  const handleUseRecommended = () => {
    setSelectedModel(recommendation.recommended_model);
    setPredResult(null);
    setTimeout(() => predSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  /* ── Select model from leaderboard ── */
  const handleSelectModel = (modelName) => {
    setSelectedModel(modelName);
    setPredResult(null);
    setTimeout(() => predSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  /* ── Predict ── */
  const handlePredict = async () => {
    try {
      setPredLoading(true);
      setPredResult(null);
      const data = await predictClosePrice({
        model:  selectedModel,
        Open:   parseFloat(recInputs.open),
        High:   parseFloat(recInputs.high),
        Low:    parseFloat(recInputs.low),
        Close:  parseFloat(recInputs.close),
        Volume: parseFloat(recInputs.volume),
      });
      setPredResult(data);
    } catch (err) {
      addToast('Prediction failed', 'error');
    } finally {
      setPredLoading(false);
    }
  };

  const isRecommended = (name) =>
    recommendation && recommendation.recommended_model === name;

  /* ── Render ── */
  return (
    <div className="space-y-16 py-6 max-w-7xl mx-auto px-4 relative min-h-screen">

      {/* Background Orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-40 right-20 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[60%] left-1/2 w-80 h-80 bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* ══════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════ */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="text-center space-y-4"
      >
        <motion.div
          variants={fadeIn}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-card text-xs font-mono text-indigo-300 border border-indigo-500/30"
        >
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span>The Ultimate Algorithm Showdown</span>
        </motion.div>

        <motion.h1
          variants={fadeIn}
          className="text-4xl md:text-5xl font-extrabold text-white tracking-tight"
        >
          AI Models{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Arena
          </span>
        </motion.h1>

        <motion.p variants={fadeIn} className="text-slate-400 max-w-2xl mx-auto">
          Watch 13 state-of-the-art regression models battle it out in real-time. Get an
          AI-powered recommendation for your data, then predict the next-day close price
          instantly.
        </motion.p>
      </motion.div>

      {/* ══════════════════════════════════════════
          SECTION A — AI RECOMMENDATION PANEL
      ══════════════════════════════════════════ */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        {/* Section heading */}
        <motion.div variants={fadeIn} className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <Brain className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Recommendation Engine</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter today's market data — our engine picks the best model for you
            </p>
          </div>
        </motion.div>

        {/* Input form */}
        <motion.div variants={fadeIn}>
          <GlassCard className="border border-slate-700/60">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <InputField label="Open"   name="open"   value={recInputs.open}   onChange={handleRecInputChange} />
              <InputField label="High"   name="high"   value={recInputs.high}   onChange={handleRecInputChange} />
              <InputField label="Low"    name="low"    value={recInputs.low}    onChange={handleRecInputChange} />
              <InputField label="Close"  name="close"  value={recInputs.close}  onChange={handleRecInputChange} />
              <InputField label="Volume" name="volume" value={recInputs.volume} onChange={handleRecInputChange} />
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleGetRecommendation}
                disabled={recLoading}
                className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 transition-all shadow-lg shadow-yellow-500/30 flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {recLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Analyzing models…</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Get AI Recommendation</span>
                  </>
                )}
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Loading state */}
        <AnimatePresence>
          {recLoading && (
            <motion.div
              key="rec-loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-10 space-y-4"
            >
              <div className="relative">
                <Brain className="w-14 h-14 text-yellow-500/60 animate-pulse" />
                <div className="absolute inset-0 border-t-2 border-yellow-400 rounded-full animate-spin" />
              </div>
              <p className="text-sm font-medium text-slate-300 animate-pulse">
                Analyzing 13 models with cross-validation…
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recommendation result card */}
        <AnimatePresence>
          {!recLoading && recommendation && (
            <motion.div
              key="rec-result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <div className="relative rounded-2xl border border-yellow-500/50 bg-gradient-to-br from-yellow-500/5 to-transparent p-6 shadow-2xl shadow-yellow-500/20 overflow-hidden">
                {/* Glow */}
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

                {/* Heading */}
                <div className="flex items-center gap-2 mb-5">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold text-yellow-300 uppercase tracking-widest">
                    AI Recommended Model
                  </span>
                </div>

                {/* Model name */}
                <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mb-1">
                  {recommendation.recommended_model}
                </p>

                {/* Reason */}
                {recommendation.reason && (
                  <p className="text-slate-400 text-sm mb-6 max-w-2xl">{recommendation.reason}</p>
                )}

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {recommendation.expected_accuracy != null && (
                    <MetricTile
                      label="Expected Accuracy"
                      value={`${(recommendation.expected_accuracy * 100).toFixed(2)}%`}
                      color="text-emerald-400"
                    />
                  )}
                  {recommendation.confidence_score != null && (
                    <MetricTile
                      label="Confidence Score"
                      value={`${(recommendation.confidence_score * 100).toFixed(1)}%`}
                      color="text-yellow-400"
                    />
                  )}
                  {recommendation.cv_score != null && (
                    <MetricTile
                      label="CV Score (R²)"
                      value={recommendation.cv_score.toFixed(4)}
                      color="text-cyan-400"
                    />
                  )}
                  {recommendation.rank != null && (
                    <MetricTile
                      label="Arena Rank"
                      value={`#${recommendation.rank}`}
                      color="text-indigo-400"
                    />
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleUseRecommended}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 transition-colors text-black font-bold text-sm shadow-lg shadow-yellow-500/30"
                  >
                    <Check className="w-4 h-4" />
                    Use Recommended Model
                  </button>
                  <button
                    onClick={() => leaderboardRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-600 hover:border-slate-400 transition-colors text-slate-300 font-semibold text-sm"
                  >
                    <ChevronDown className="w-4 h-4" />
                    Choose Another Model
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* ══════════════════════════════════════════
          SECTION B — ARENA LEADERBOARD
      ══════════════════════════════════════════ */}
      <section ref={leaderboardRef} className="space-y-6">
        {/* Section heading + Run Arena button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
              <Trophy className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Arena Leaderboard</h2>
              <p className="text-xs text-slate-500 mt-0.5">Ranked by R² Score · Click a card to predict</p>
            </div>
          </div>

          <button
            onClick={fetchLeaderboard}
            disabled={loading}
            className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed self-start sm:self-auto"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Training Models…</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Run Arena Match</span>
              </>
            )}
          </button>
        </div>

        {/* Loading skeleton */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="lb-loading"
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
                Simulating parallel training of 13 models…
              </p>
            </motion.div>
          )}

          {!loading && leaderboard && (
            <motion.div
              key="leaderboard"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {leaderboard.map((item, index) => {
                const rec = isRecommended(item.Model_Name);
                return (
                  <motion.div
                    key={item.Model_Name}
                    variants={fadeIn}
                    whileHover={{ y: -8, scale: 1.02 }}
                    onHoverStart={() => setActiveModel(item.Model_Name)}
                    onHoverEnd={() => setActiveModel(null)}
                    onClick={() => handleSelectModel(item.Model_Name)}
                    className="cursor-pointer"
                  >
                    <GlassCard
                      tilt={true}
                      className={`h-full border transition-all duration-300 relative overflow-hidden ${
                        rec
                          ? 'border-yellow-500/70 shadow-2xl shadow-yellow-500/20'
                          : index === 0
                          ? 'border-yellow-500/50 shadow-2xl shadow-yellow-500/10'
                          : index < 3
                          ? 'border-indigo-500/30'
                          : 'border-slate-800'
                      } ${selectedModel === item.Model_Name ? 'ring-2 ring-cyan-500/60' : ''}`}
                    >
                      {/* ⭐ RECOMMENDED badge */}
                      {rec && (
                        <div className="absolute top-3 left-3 z-20">
                          <motion.span
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-400/50 text-yellow-300 text-[10px] font-bold uppercase tracking-wider"
                          >
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            Recommended
                          </motion.span>
                        </div>
                      )}

                      {/* Rank badge (top-right) */}
                      <div className={`absolute top-0 right-0 w-16 h-16 flex items-start justify-end p-3 ${
                        index === 0 ? 'bg-gradient-to-bl from-yellow-500/20 to-transparent' : ''
                      }`}>
                        <span className={`text-xl font-black italic ${
                          index === 0 ? 'text-yellow-400'
                          : index === 1 ? 'text-slate-300'
                          : index === 2 ? 'text-orange-400'
                          : 'text-slate-600'
                        }`}>
                          #{item.Rank}
                        </span>
                      </div>

                      <div className={`space-y-4 z-10 relative ${rec ? 'pt-7' : ''}`}>
                        <h3 className={`text-xl font-bold truncate pr-10 ${
                          index === 0 ? 'text-yellow-300' : 'text-white'
                        }`}>
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
                      {/* Recommended pulse glow overlay */}
                      {rec && (
                        <div className="absolute inset-0 rounded-2xl border-2 border-yellow-400/30 animate-pulse pointer-events-none" />
                      )}
                    </GlassCard>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ══════════════════════════════════════════
          SECTION C — PREDICTION PANEL
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedModel && (
          <motion.section
            key="pred-panel"
            ref={predSectionRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 180, damping: 20 }}
            className="space-y-6"
          >
            {/* Section heading */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <Target className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Prediction Panel</h2>
                <p className="text-xs text-slate-500 mt-0.5">Using your market inputs to forecast next-day close</p>
              </div>
            </div>

            <GlassCard className="border border-cyan-500/20 space-y-6">
              {/* Selected model banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Selected Model</p>
                    <p className="text-lg font-bold text-cyan-300">{selectedModel}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedModel(null); setPredResult(null); }}
                  className="text-xs text-slate-400 hover:text-white border border-slate-600 hover:border-slate-400 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Change Model
                </button>
              </div>

              {/* Inputs (pre-filled from recommendation form) */}
              <div>
                <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-semibold">Market Inputs</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <InputField label="Open"   name="open"   value={recInputs.open}   onChange={handleRecInputChange} />
                  <InputField label="High"   name="high"   value={recInputs.high}   onChange={handleRecInputChange} />
                  <InputField label="Low"    name="low"    value={recInputs.low}    onChange={handleRecInputChange} />
                  <InputField label="Close"  name="close"  value={recInputs.close}  onChange={handleRecInputChange} />
                  <InputField label="Volume" name="volume" value={recInputs.volume} onChange={handleRecInputChange} />
                </div>
              </div>

              {/* Predict button */}
              <div className="flex justify-center">
                <button
                  onClick={handlePredict}
                  disabled={predLoading}
                  className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:opacity-90 transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {predLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Predicting…</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-5 h-5" />
                      <span>Predict Next Day Close</span>
                    </>
                  )}
                </button>
              </div>

              {/* Prediction loading */}
              <AnimatePresence>
                {predLoading && (
                  <motion.div
                    key="pred-loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center py-8 gap-4"
                  >
                    <div className="relative">
                      <BarChart2 className="w-12 h-12 text-cyan-500/60 animate-pulse" />
                      <div className="absolute inset-0 border-t-2 border-cyan-400 rounded-full animate-spin" />
                    </div>
                    <p className="text-sm text-slate-400 animate-pulse">Running inference…</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Prediction result */}
              <AnimatePresence>
                {!predLoading && predResult && (
                  <motion.div
                    key="pred-result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6 pt-2"
                  >
                    {/* Big prediction value */}
                    <div className="text-center py-6 rounded-2xl bg-gradient-to-b from-cyan-500/10 to-transparent border border-cyan-500/20">
                      <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-2">
                        Predicted Next Day Close
                      </p>
                      <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-400 font-mono">
                        ₹{(predResult.predicted_close ?? predResult.Predicted_Close ?? 0).toFixed(2)}
                      </p>
                    </div>

                    {/* Timing row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
                        <Clock className="w-4 h-4 text-indigo-400" />
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Training Time</p>
                          <p className="text-sm font-mono text-white">
                            {(predResult.training_time ?? predResult.Training_Time ?? 0).toFixed(4)}s
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Testing Time</p>
                          <p className="text-sm font-mono text-white">
                            {(predResult.testing_time ?? predResult.Testing_Time ?? 0).toFixed(4)}s
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Metrics grid */}
                    {predResult.metrics && (
                      <div>
                        <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3">
                          Model Metrics
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <MetricTile label="MAE"  value={(predResult.metrics.MAE  ?? predResult.metrics.mae  ?? 0).toFixed(4)} color="text-orange-400" />
                          <MetricTile label="MSE"  value={(predResult.metrics.MSE  ?? predResult.metrics.mse  ?? 0).toFixed(4)} color="text-red-400" />
                          <MetricTile label="RMSE" value={(predResult.metrics.RMSE ?? predResult.metrics.rmse ?? 0).toFixed(4)} color="text-rose-400" />
                          <MetricTile label="RSS"  value={(predResult.metrics.RSS  ?? predResult.metrics.rss  ?? 0).toFixed(2)}  color="text-pink-400" />
                          <MetricTile label="MAPE" value={`${((predResult.metrics.MAPE ?? predResult.metrics.mape ?? 0) * 100).toFixed(3)}%`} color="text-yellow-400" />
                          <MetricTile label="R²"   value={(predResult.metrics.R2   ?? predResult.metrics.r2   ?? 0).toFixed(6)}  color="text-emerald-400" />
                          <MetricTile label="Adj R²" value={(predResult.metrics.Adjusted_R2 ?? predResult.metrics.adjusted_r2 ?? 0).toFixed(6)} color="text-teal-400" />
                          {(predResult.metrics.CV_Score ?? predResult.metrics.cv_score) != null && (
                            <MetricTile
                              label="CV Score"
                              value={(predResult.metrics.CV_Score ?? predResult.metrics.cv_score).toFixed(6)}
                              color="text-cyan-400"
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Train vs Test score */}
                    {(predResult.train_score != null || predResult.Train_Score != null) && (
                      <div className="grid grid-cols-2 gap-4">
                        <MetricTile
                          label="Train Score"
                          value={(predResult.train_score ?? predResult.Train_Score ?? 0).toFixed(6)}
                          color="text-indigo-400"
                        />
                        <MetricTile
                          label="Test Score"
                          value={(predResult.test_score ?? predResult.Test_Score ?? 0).toFixed(6)}
                          color="text-purple-400"
                        />
                      </div>
                    )}

                    {/* Fit badge */}
                    {(predResult.fit_status ?? predResult.Fit_Status) && (
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Model Fit:</span>
                        <FitBadge fit={predResult.fit_status ?? predResult.Fit_Status} />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};
