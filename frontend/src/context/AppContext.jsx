import React, { createContext, useContext, useState, useEffect } from 'react';
import { getModelMetrics, getDatasetInfo } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('tcs_prediction_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    try {
      const saved = localStorage.getItem('app_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'dark';
    }
  });

  const [toasts, setToasts] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  useEffect(() => {
    localStorage.setItem('tcs_prediction_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('app_theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    } catch {
      // ignore storage failures in restricted environments
    }
  }, [theme]);

  const fetchGlobalData = async () => {
    try {
      setLoadingInitial(true);
      const [mRes, dRes] = await Promise.all([
        getModelMetrics().catch(() => null),
        getDatasetInfo().catch(() => null)
      ]);
      if (mRes) setMetrics(mRes);
      if (dRes) setDatasetInfo(dRes);
    } catch (err) {
      console.error('Failed fetching app metadata:', err);
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    fetchGlobalData();
  }, []);

  const addPredictionToHistory = (prediction) => {
    const item = {
      id: Date.now(),
      timestamp: prediction.Timestamp || new Date().toISOString(),
      open: prediction.Features_Used?.Open,
      high: prediction.Features_Used?.High,
      low: prediction.Features_Used?.Low,
      close: prediction.Features_Used?.Close,
      volume: prediction.Features_Used?.Volume,
      predictedClose: prediction.Predicted_Close,
      confidence: prediction.Confidence_Score
    };
    setHistory((prev) => [item, ...prev.slice(0, 49)]); // keep max 50 items
    addToast('Prediction saved to history!', 'success');
  };

  const clearHistory = () => {
    setHistory([]);
    addToast('Prediction history cleared', 'info');
  };

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        history,
        addPredictionToHistory,
        clearHistory,
        toasts,
        addToast,
        removeToast,
        metrics,
        datasetInfo,
        loadingInitial,
        refreshGlobalData: fetchGlobalData,
        theme,
        toggleTheme: () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
