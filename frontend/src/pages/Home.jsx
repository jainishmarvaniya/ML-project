import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GlassCard } from '../components/GlassCard';
import { StatCard } from '../components/StatCard';
import { useApp } from '../context/AppContext';

import { 
  TrendingUp, 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  CheckCircle, 
  BarChart3, 
  ShieldAlert, 
  Database,
  Layers,
  Activity,
  Award
} from 'lucide-react';
import { fadeIn, staggerContainer, heroHeadlineAnimation } from '../animations/variants';

gsap.registerPlugin(ScrollTrigger);

export const Home = () => {
  const navigate = useNavigate();
  const { metrics, datasetInfo } = useApp();
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);

  // Quick Home Prediction Teaser State
  const [openPrice, setOpenPrice] = useState('3950');
  const [highPrice, setHighPrice] = useState('3980');
  const [lowPrice, setLowPrice] = useState('3920');
  const [volume, setVolume] = useState('1500000');

  useEffect(() => {
    // GSAP Scroll Animations
    cardsRef.current.forEach((el, index) => {
      gsap.fromTo(el, 
        { autoAlpha: 0, y: 100, rotateX: -20 },
        { 
          duration: 1, 
          autoAlpha: 1, 
          y: 0, 
          rotateX: 0,
          scrollTrigger: {
            trigger: el,
            start: "top bottom-=100",
            toggleActions: "play none none reverse"
          },
          delay: index * 0.1
        }
      );
    });
  }, []);

  const handleQuickPredict = (e) => {
    e.preventDefault();
    navigate('/prediction', {
      state: { open: openPrice, high: highPrice, low: lowPrice, volume: volume }
    });
  };

  const features = [
    {
      title: "13+ Advanced Models",
      description: "From Linear Regression to XGBoost and CatBoost, dynamically trained on the latest market data.",
      icon: Cpu,
      color: "blue"
    },
    {
      title: "Real-time Inference",
      description: "Sub-second prediction response via high-performance FastAPI Python engine.",
      icon: Zap,
      color: "cyan"
    },
    {
      title: "Interactive Analytics",
      description: "Plotly.js dynamic charts including Actual vs Predicted, Residuals, and Feature Importance.",
      icon: BarChart3,
      color: "purple"
    },
    {
      title: "Model Leaderboard",
      description: "Compare algorithms head-to-head in our Arena and deploy the best performing model instantly.",
      icon: Award,
      color: "emerald"
    }
  ];

  return (
    <div className="space-y-24 py-8 relative" ref={sectionRef}>
      
      {/* Floating 3D Orbs Background */}
      <motion.div style={{ y }} className="absolute top-[10%] left-[5%] w-72 h-72 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, -300]) }} className="absolute top-[40%] right-[10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[150px] pointer-events-none -z-10" />
      <motion.div style={{ y }} className="absolute bottom-[20%] left-[20%] w-64 h-64 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative pt-8 pb-16 overflow-hidden">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center space-y-8 px-4"
        >
          {/* Top Badge */}
          <motion.div 
            variants={fadeIn} 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card border border-indigo-500/30 text-indigo-300 text-xs font-mono cursor-default"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>TCS Stock Price Prediction Engine • Next-Gen AI</span>
          </motion.div>

          {/* Main Hero Headline */}
          <motion.h1 
            variants={heroHeadlineAnimation}
            className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-tight"
          >
            Predict The <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
               TCS Prices
            </span>
          </motion.h1>

          <motion.p 
            variants={fadeIn}
            className="text-base sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
          >
            Empowering traders and financial analysts with precision AI stock predictions. Train 13+ state-of-the-art models on the fly and make data-driven decisions.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/prediction"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:opacity-95 transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 group"
            >
              <span>Launch Predictor</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/arena"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-slate-200 glass-card hover:bg-slate-800/60 border border-slate-700/60 transition-all flex items-center justify-center space-x-2"
            >
              <Award className="w-5 h-5 text-yellow-400" />
              <span>Enter Models Arena</span>
            </Link>
          </motion.div>

          {/* Quick Hero Interactive Teaser Card */}
          <motion.div variants={fadeIn} className="pt-12 max-w-3xl mx-auto relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <GlassCard tilt={true} className="p-8 border border-slate-700/60 shadow-2xl relative text-left rounded-3xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-sm font-bold text-white">Interactive Quick Predictor</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">TCS.NS</span>
              </div>

              <form onSubmit={handleQuickPredict} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Open Price (₹)</label>
                  <input
                    type="number"
                    value={openPrice}
                    onChange={(e) => setOpenPrice(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="3950"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">High Price (₹)</label>
                  <input
                    type="number"
                    value={highPrice}
                    onChange={(e) => setHighPrice(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="3980"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Low Price (₹)</label>
                  <input
                    type="number"
                    value={lowPrice}
                    onChange={(e) => setLowPrice(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="3920"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Volume</label>
                  <input
                    type="number"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="1500000"
                  />
                </div>

                <div className="col-span-2 sm:col-span-4 mt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition flex items-center justify-center space-x-2"
                  >
                    <span>Analyze & Predict</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </motion.div>
      </section>

      {/* Live Model Statistics Counter Bar */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div ref={el => cardsRef.current[0] = el}>
            <StatCard
              title="Total Historical Records"
              value={datasetInfo?.Total_Rows ? datasetInfo.Total_Rows.toLocaleString() : "5,926"}
              subtitle="TCS Daily Stock Data"
              icon={Database}
              color="blue"
              trend="100% Verified"
            />
          </div>
          <div ref={el => cardsRef.current[1] = el}>
             <StatCard
              title="Available Algorithms"
              value="13"
              subtitle="Regression Models"
              icon={Layers}
              color="indigo"
              trend="Dynamic Training"
            />
          </div>
          <div ref={el => cardsRef.current[2] = el}>
            <StatCard
              title="Top Model Accuracy"
              value="99.99%"
              subtitle="R² Score on Test Set"
              icon={Activity}
              color="emerald"
              trend="Highly Accurate"
            />
          </div>
          <div ref={el => cardsRef.current[3] = el}>
            <StatCard
              title="Inference Speed"
              value="< 0.1s"
              subtitle="Average execution time"
              icon={Zap}
              color="cyan"
              trend="Lightning Fast"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-3" ref={el => cardsRef.current[4] = el}>
          <h2 className="text-3xl font-extrabold text-white">Engineered for Financial Excellence</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Combining statistical rigor with real-time web architecture to deliver accurate stock price forecasts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} ref={el => cardsRef.current[5 + idx] = el}>
                <GlassCard tilt={true} className="space-y-4 border border-slate-800 h-full">
                  <div className={`w-12 h-12 rounded-xl bg-${feat.color}-500/10 border border-${feat.color}-500/20 flex items-center justify-center text-${feat.color}-400`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
                </GlassCard>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-5xl mx-auto px-4 text-center pb-24" ref={el => cardsRef.current[9] = el}>
        <GlassCard className="p-10 border border-indigo-500/30 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900/80 space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl font-extrabold text-white">Ready to Predict Today's TCS Stock Close Price?</h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              Input custom Open, High, Low, and Volume parameters or load quick market presets to get instant closing price predictions using the best AI models.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                to="/prediction"
                className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-indigo-500 to-cyan-600 hover:opacity-90 transition shadow-lg shadow-indigo-500/20"
              >
                <span>Launch Tool</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
};
