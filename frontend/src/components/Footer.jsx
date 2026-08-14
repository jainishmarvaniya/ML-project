import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Cpu, Github, ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/60 bg-[#030712]/80 backdrop-blur-xl relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-cyan-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">TCS AI Stock</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Production-Grade Multiple Linear Regression Model predicting Tata Consultancy Services (TCS) daily close prices with 99.99% model fit (R²).
            </p>
            <div className="flex items-center space-x-2 text-xs text-cyan-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>FastAPI Backend Active</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
              Dashboard Pages
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-slate-400 hover:text-cyan-300 transition-colors">Home Landing</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-cyan-300 transition-colors">CSV Dataset Preview</Link>
              </li>
              <li>
                <Link to="/prediction" className="text-slate-400 hover:text-cyan-300 transition-colors">Live Stock Predictor</Link>
              </li>
              <li>
                <Link to="/visualization" className="text-slate-400 hover:text-cyan-300 transition-colors">Interactive Analytics</Link>
              </li>
            </ul>
          </div>

          {/* Technical Architecture */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
              Tech Stack
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Frontend: React 19 + Vite + Tailwind</li>
              <li>Charts: Plotly.js + Recharts</li>
              <li>Animations: Framer Motion + GSAP</li>
              <li>Backend: FastAPI + Uvicorn + Python</li>
              <li>ML: Scikit-learn + Pandas + Joblib</li>
            </ul>
          </div>

          {/* Model Metrics Quick View */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
              Model Performance
            </h4>
            <div className="glass-card p-4 rounded-xl space-y-2 border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">R² Score:</span>
                <span className="text-emerald-400 font-mono font-bold">0.999957</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Mean Abs Error:</span>
                <span className="text-cyan-400 font-mono font-bold">₹4.50</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">MAPE:</span>
                <span className="text-purple-400 font-mono font-bold">0.67%</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 TCS AI Stock Price Prediction. Built with Apple + Linear inspired aesthetics.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="hover:text-slate-400 transition-colors">FastAPI v1.0</span>
            <span>•</span>
            <span className="hover:text-slate-400 transition-colors">React 19</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
