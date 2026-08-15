import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { PredictionCharts } from '../components/charts/PredictionCharts';
import { useApp } from '../context/AppContext';
import { predictClosePrice, getAvailableModels, compareModels } from '../services/api';
import { exportPredictionToCsv } from '../utils/exportCsv';
import { exportPredictionReportPdf } from '../utils/exportPdf';
import { formatCurrency, formatNumber } from '../utils/formatters';
import {
  Cpu,
  Sparkles,
  ArrowRight,
  Copy,
  Download,
  FileText,
  Clock,
  Trash2,
  Zap,
  TrendingUp,
  Check,
  RefreshCw,
  BarChart2,
  Activity,
  X
} from 'lucide-react';

export const Prediction = () => {
  const location = useLocation();
  const { history, addPredictionToHistory, clearHistory, addToast } = useApp();

  const [open, setOpen] = useState('3950.00');
  const [high, setHigh] = useState('3980.00');
  const [low, setLow] = useState('3920.00');
  const [close, setClose] = useState('3960.00');
  const [volume, setVolume] = useState('1500000');
  
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('Linear Regression');
  const [loadingModels, setLoadingModels] = useState(true);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  
  const [comparing, setComparing] = useState(false);
  const [leaderboard, setLeaderboard] = useState(null);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const data = await getAvailableModels();
        setModels(data);
        if (data.length > 0) setSelectedModel(data[0]);
      } catch (err) {
        addToast('Failed to load available models', 'error');
      } finally {
        setLoadingModels(false);
      }
    };
    fetchModels();
  }, []);

  useEffect(() => {
    if (location.state) {
      if (location.state.open)   setOpen(location.state.open);
      if (location.state.high)   setHigh(location.state.high);
      if (location.state.low)    setLow(location.state.low);
      if (location.state.close)  setClose(location.state.close);
      if (location.state.volume) setVolume(location.state.volume);
    }
  }, [location.state]);

  const applyPreset = (op, hi, lo, cl, vol) => {
    setOpen(op.toString());
    setHigh(hi.toString());
    setLow(lo.toString());
    setClose(cl.toString());
    setVolume(vol.toString());
    addToast('Market preset loaded', 'info');
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    const oVal = parseFloat(open);
    const hVal = parseFloat(high);
    const lVal = parseFloat(low);
    const cVal = parseFloat(close);
    const vVal = parseFloat(volume);

    if (isNaN(oVal) || isNaN(hVal) || isNaN(lVal) || isNaN(cVal) || isNaN(vVal)) {
      addToast('Please enter valid numeric values for all features', 'error');
      return;
    }
    if (lVal > hVal) {
      addToast('Low price cannot be higher than High price', 'error');
      return;
    }
    if (cVal < lVal || cVal > hVal) {
      addToast('Close price must be between Low and High price', 'error');
      return;
    }

    try {
      setLoading(true);
      const data = await predictClosePrice({
        model: selectedModel,
        Open: oVal,
        High: hVal,
        Low: lVal,
        Close: cVal,
        Volume: vVal,
      });

      setResult({
        ...data,
        Features_Used: { Open: oVal, High: hVal, Low: lVal, Close: cVal, Volume: vVal }
      });
      
      addPredictionToHistory({
        id: Date.now(),
        timestamp: data.timestamp,
        open: oVal,
        high: hVal,
        low: lVal,
        close: cVal,
        volume: vVal,
        predictedClose: data.prediction,
        model: data.model,
        r2: data.metrics.R2
      });
      
      addToast(`Prediction successful using ${data.model}`, 'success');
    } catch (err) {
      console.error('Prediction error:', err);
      addToast(err.response?.data?.detail || 'Failed connecting to backend', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    try {
      setComparing(true);
      setShowCompareModal(true);
      const data = await compareModels();
      setLeaderboard(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to compare models', 'error');
      setShowCompareModal(false);
    } finally {
      setComparing(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const f = result.Features_Used;
    const text = [
      `TCS Stock Next-Day Prediction - ${result.model}`,
      `Predicted Next Close: ₹${result.prediction}`,
      `R² Score: ${result.metrics.R2}`,
      `Fit Status: ${result.fit}`,
      `Training Time: ${result.training_time}s`,
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Prediction copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };
  
  const getBadgeColor = (fit) => {
      if (fit === "Good Fit") return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      if (fit === "Underfitting") return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      if (fit === "Overfitting") return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      return "bg-slate-500/20 text-slate-400 border-slate-500/30";
  };

  return (
    <div className="space-y-12 py-6 max-w-7xl mx-auto px-4 relative">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-card text-xs font-mono text-cyan-300 border border-cyan-500/20 mb-3">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Dynamic Model Inference</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Advanced Stock Price Predictor</h1>
        <p className="text-slate-400 text-sm mt-1">
          Train and predict using multiple state-of-the-art regression models dynamically
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <GlassCard className="lg:col-span-7 space-y-6 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              <span>Input Market Parameters</span>
            </h2>
            <button
              onClick={handleCompare}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition text-xs font-semibold border border-indigo-500/30"
            >
              <BarChart2 className="w-4 h-4" />
              <span>Compare Models</span>
            </button>
          </div>

          <form onSubmit={handlePredict} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="sm:col-span-2 mb-2">
                 <label className="text-xs text-slate-300 font-semibold mb-1.5 block">
                  Select Regression Algorithm
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={loadingModels || loading}
                  className="w-full bg-slate-900/90 border border-indigo-500/40 rounded-xl px-4 py-3 text-indigo-200 font-medium text-sm focus:border-indigo-400 focus:outline-none appearance-none"
                >
                  {loadingModels ? <option>Loading models...</option> : models.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1.5 block">Open ₹</label>
                <input
                  type="number" step="0.01" value={open} onChange={(e) => setOpen(e.target.value)} required
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1.5 block">High ₹</label>
                <input
                  type="number" step="0.01" value={high} onChange={(e) => setHigh(e.target.value)} required
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1.5 block">Low ₹</label>
                <input
                  type="number" step="0.01" value={low} onChange={(e) => setLow(e.target.value)} required
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1.5 block">Close ₹</label>
                <input
                  type="number" step="0.01" value={close} onChange={(e) => setClose(e.target.value)} required
                  className="w-full bg-slate-900/90 border border-cyan-700/60 rounded-xl px-4 py-3 text-cyan-200 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-300 font-semibold mb-1.5 block">Volume (Shares)</label>
                <input
                  type="number" step="1" value={volume} onChange={(e) => setVolume(e.target.value)} required
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || loadingModels}
              className="w-full py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Training {selectedModel}...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Predict close price</span>
                </>
              )}
            </button>
          </form>
        </GlassCard>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
              <GlassCard className="p-8 border border-indigo-500/40 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-[#030712] space-y-6 relative overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest truncate max-w-[200px]">
                    {result.model}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${getBadgeColor(result.fit)}`}>
                    {result.fit}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
                    📈 Predicted Tomorrow Close
                  </span>
                  <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-mono">
                    {formatCurrency(result.prediction)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div>
                    <span className="text-xs text-slate-400 block">R² Score (Test)</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono">
                      {result.metrics.R2}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Training Time</span>
                    <span className="text-lg font-bold text-indigo-400 font-mono">
                      {result.training_time}s
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">RMSE</span>
                    <span className="text-lg font-bold text-cyan-400 font-mono">
                      {result.metrics.RMSE}
                    </span>
                  </div>
                   <div>
                    <span className="text-xs text-slate-400 block">MAPE</span>
                    <span className="text-lg font-bold text-purple-400 font-mono">
                      {result.metrics.MAPE}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <button
                    onClick={handleCopy}
                    className="w-full py-2.5 rounded-xl glass-card hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 flex items-center justify-center space-x-2 transition"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
                    <span>{copied ? 'Copied' : 'Copy Summary'}</span>
                  </button>
                </div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              </GlassCard>
            </motion.div>
          ) : (
            <GlassCard className="p-8 text-center space-y-4 border border-slate-800/80">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Dynamic AI Inference</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Select an algorithm and click Train to perform on-the-fly model training and inference.
              </p>
            </GlassCard>
          )}
        </div>
      </div>

      {/* Plotly Charts Section */}
      {result && result.chart_data && (
        <PredictionCharts chartData={result.chart_data} />
      )}

      {/* Prediction History Log */}
      <GlassCard className="space-y-6 border border-slate-800 mt-12">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Prediction History Log</h2>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                  <th className="py-2.5 px-3">Model</th>
                  <th className="py-2.5 px-3">Close (₹)</th>
                  <th className="py-2.5 px-3">Predicted Next Close (₹)</th>
                  <th className="py-2.5 px-3">R² Fit</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40">
                     <td className="py-2.5 px-3 text-indigo-300">{item.model || 'Linear Regression'}</td>
                    <td className="py-2.5 px-3 text-slate-400">{formatNumber(item.close)}</td>
                    <td className="py-2.5 px-3 text-cyan-300 font-bold">{formatCurrency(item.predictedClose)}</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">{item.r2 || item.confidence}</td>
                    <td className="py-2.5 px-3 text-slate-500">{new Date(item.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-xs text-slate-500 py-6">No prediction history recorded yet.</p>
        )}
      </GlassCard>

      {/* Compare Models Modal */}
      <AnimatePresence>
        {showCompareModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <BarChart2 className="w-5 h-5 text-indigo-400" />
                    <span>Model Leaderboard</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Comparing all available regression models based on R² score.</p>
                </div>
                <button onClick={() => setShowCompareModal(false)} className="text-slate-400 hover:text-white transition">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                {comparing ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin" />
                    <p className="text-slate-300 font-medium">Training and evaluating all models... This may take a moment.</p>
                  </div>
                ) : leaderboard ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-700 text-slate-400 font-semibold uppercase text-xs">
                          <th className="py-3 px-4">Rank</th>
                          <th className="py-3 px-4">Model Name</th>
                          <th className="py-3 px-4">R² Score</th>
                          <th className="py-3 px-4">RMSE</th>
                          <th className="py-3 px-4">MAPE</th>
                          <th className="py-3 px-4">Train Time (s)</th>
                          <th className="py-3 px-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {leaderboard.map((item, idx) => (
                          <tr key={item.Model_Name} className={`hover:bg-slate-800/50 transition ${idx === 0 ? 'bg-indigo-900/20' : ''}`}>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${idx === 0 ? 'bg-yellow-500 text-black' : 'bg-slate-800 text-slate-400'}`}>
                                {item.Rank}
                              </span>
                            </td>
                            <td className={`py-3 px-4 font-medium ${idx === 0 ? 'text-indigo-300' : 'text-slate-200'}`}>
                              {item.Model_Name} {idx === 0 && '🏆'}
                            </td>
                            <td className="py-3 px-4 text-emerald-400 font-mono font-bold">{item.R2_Score}</td>
                            <td className="py-3 px-4 text-cyan-300 font-mono">{item.RMSE}</td>
                            <td className="py-3 px-4 text-purple-300 font-mono">{item.MAPE}</td>
                            <td className="py-3 px-4 text-slate-400 font-mono">{item.Training_Time}</td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => {
                                  setSelectedModel(item.Model_Name);
                                  setShowCompareModal(false);
                                  addToast(`Selected ${item.Model_Name} as the active model`, 'success');
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${idx === 0 ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'}`}
                              >
                                Use Model
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
