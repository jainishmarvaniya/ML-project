import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  Info, 
  Cpu, 
  Code2, 
  Database, 
  User, 
  Sparkles, 
  TrendingUp, 
  CheckCircle,
  ExternalLink,
  Layers,
  Zap,
  Award
} from 'lucide-react';

export const About = () => {
  const techStack = [
    { category: "Frontend Framework", name: "React 19 + Vite", desc: "Latest React features with Vite lightning-fast HMR and bundling.", icon: Code2, color: "text-cyan-400" },
    { category: "Styling & Design System", name: "Tailwind CSS + Glassmorphism", desc: "Custom dark theme palette (#030712) with Apple + Linear + Stripe design aesthetics.", icon: Sparkles, color: "text-purple-400" },
    { category: "Animations", name: "Framer Motion + GSAP", desc: "Fluid page transitions, micro-interactions, floating gradient mesh animations.", icon: Zap, color: "text-blue-400" },
    { category: "Interactive Visualization", name: "Plotly.js + Recharts", desc: "Interactive time series line charts, scatter plots, histograms, and heatmaps.", icon: Layers, color: "text-emerald-400" },
    { category: "Backend Engine", name: "FastAPI + Uvicorn", desc: "Asynchronous Python web framework delivering high throughput prediction APIs.", icon: Cpu, color: "text-amber-400" },
    { category: "Machine Learning Pipeline", name: "Scikit-learn + Pandas + Joblib", desc: "StandardScaler feature normalization and Multiple Linear Regression modeling.", icon: Database, color: "text-rose-400" },
  ];

  return (
    <div className="space-y-12 py-6 max-w-7xl mx-auto px-4">
      {/* Title Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-card text-xs font-mono text-cyan-300 border border-cyan-500/20 mb-3">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Project & Technical Documentation</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">About the Application</h1>
        <p className="text-slate-400 text-sm mt-1">
          Architectural overview of TCS AI Stock Price Prediction built with Multiple Linear Regression & FastAPI
        </p>
      </div>

      {/* Project Overview Card */}
      <GlassCard className="p-8 lg:p-10 border border-slate-800 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-purple-600 to-cyan-400 flex items-center justify-center shadow-xl">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">TCS Stock Price Prediction Engine</h2>
            <p className="text-xs font-mono text-cyan-400">Multiple Linear Regression • Version 1.0.0</p>
          </div>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed">
          This production-ready application predicts today's closing stock price for <strong>Tata Consultancy Services (TCS)</strong> using <strong>Multiple Linear Regression</strong> based on four key market features: <code>Open</code>, <code>High</code>, <code>Low</code>, and <code>Volume</code>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400 block font-mono">Dataset Size</span>
            <span className="text-lg font-bold text-white">5,926 Records</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400 block font-mono">Model Fit (R²)</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">99.9957%</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400 block font-mono">Mean Absolute Error</span>
            <span className="text-lg font-bold text-cyan-400 font-mono">₹4.50</span>
          </div>
        </div>
      </GlassCard>

      {/* Tech Stack Cards Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-white">Technology Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <GlassCard key={idx} className="space-y-3 border border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 ${tech.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">
                      {tech.category}
                    </span>
                    <h3 className="text-base font-bold text-white">{tech.name}</h3>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{tech.desc}</p>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* ML Algorithm Detailed Explanation */}
      <GlassCard className="p-8 border border-slate-800 space-y-6">
        <h2 className="text-2xl font-extrabold text-white flex items-center space-x-3">
          <Cpu className="w-6 h-6 text-purple-400" />
          <span>Machine Learning Algorithm & Mathematical Formulation</span>
        </h2>

        <p className="text-slate-300 text-sm leading-relaxed">
          Multiple Linear Regression is a supervised learning algorithm that models the linear relationship between a continuous scalar response variable and multiple explanatory variables.
        </p>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-cyan-300 space-y-2 overflow-x-auto">
          <p className="text-slate-400">// Multiple Linear Regression Formula:</p>
          <p className="text-base font-bold">Y = β₀ + β₁·X₁ + β₂·X₂ + β₃·X₃ + β₄·X₄ + ε</p>
          <p className="text-slate-400 pt-2">// Where:</p>
          <p>Y = Predicted Close Price</p>
          <p>X₁, X₂, X₃, X₄ = Open, High, Low, Volume (StandardScaler scaled)</p>
          <p>β₀ = Intercept coefficient</p>
          <p>β₁, β₂, β₃, β₄ = Feature slopes learned via Ordinary Least Squares (OLS)</p>
        </div>
      </GlassCard>

      {/* Developer Profile Card */}
      <GlassCard className="p-8 border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Senior AI Full Stack Engineer</h3>
            <p className="text-xs text-slate-400">Machine Learning & Web Systems Architect</p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Designed and developed with clean architecture, strict Pydantic schema validation, reusable React components, and responsive dark mode glassmorphism.
        </p>
      </GlassCard>
    </div>
  );
};
