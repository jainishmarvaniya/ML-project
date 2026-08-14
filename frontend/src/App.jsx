import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { MouseFollower } from './components/MouseFollower';
import { AnimatedBackground } from './components/AnimatedBackground';
import { ToastContainer } from './components/Toast';
import { BackToTop } from './components/BackToTop';

import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Prediction } from './pages/Prediction';
import { DataVisualization } from './pages/DataVisualization';
import { ModelEvaluation } from './pages/ModelEvaluation';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';
import { ModelsArena } from './pages/ModelsArena';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <div
            className="relative min-h-screen flex flex-col justify-between overflow-hidden"
            style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}
          >
            {/* Interactive Aesthetics */}
            <MouseFollower />
            <AnimatedBackground />

            {/* Layout Header */}
            <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
            <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

            {/* Main View Router */}
            <main className="relative z-10 flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/prediction" element={<Prediction />} />
                <Route path="/visualization" element={<DataVisualization />} />
                <Route path="/evaluation" element={<ModelEvaluation />} />
                <Route path="/arena" element={<ModelsArena />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* Layout Footer & Floating Controls */}
            <Footer />
            <ToastContainer />
            <BackToTop />
          </div>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}
