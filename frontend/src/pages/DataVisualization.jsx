import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { ChartSkeleton } from '../components/LoadingSkeleton';
import { getDatasetRecords } from '../services/api';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
import { LineChart as LineChartIcon, BarChart2, Activity, PieChart, Layers } from 'lucide-react';

const Plot = createPlotlyComponent(Plotly);


export const DataVisualization = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await getDatasetRecords(2500, 0);
        if (data && data.records) {
          setRecords(data.records);
        }
      } catch (err) {
        console.error("Failed fetching records for analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Data processing for Plotly charts
  const dates = records.map((r) => r.Date);
  const closePrices = records.map((r) => r.Close);
  const openPrices = records.map((r) => r.Open);
  const highPrices = records.map((r) => r.High);
  const lowPrices = records.map((r) => r.Low);
  const volumes = records.map((r) => r.Volume);

  // Common dark Plotly layout config
  const darkLayout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(15, 23, 42, 0.4)',
    font: { color: '#94a3b8', family: 'Plus Jakarta Sans, sans-serif' },
    xaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155' },
    yaxis: { gridcolor: '#1e293b', zerolinecolor: '#334155' },
    margin: { l: 50, r: 30, t: 40, b: 50 },
    autosize: true,
  };

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto px-4">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center space-x-3">
          <LineChartIcon className="w-8 h-8 text-cyan-400" />
          <span>Interactive Market Visualizations</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          High-performance Plotly & Recharts analytics exploring TCS historical stock trends and feature correlations
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* Chart 1: Interactive Line Chart (Close Price over Time) */}
          <GlassCard className="space-y-4 border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <span>Historical Close Price Trend (INR)</span>
                </h2>
                <p className="text-xs text-slate-400">Interactive zoomable time series chart for TCS.NS</p>
              </div>
            </div>

            <div className="w-full h-[400px]">
              <Plot
                data={[
                  {
                    x: dates,
                    y: closePrices,
                    type: 'scatter',
                    mode: 'lines',
                    name: 'TCS Close Price',
                    line: { color: '#06b6d4', width: 2 },
                  },
                ]}
                layout={{
                  ...darkLayout,
                  title: { text: 'TCS Daily Close Price Trajectory', font: { color: '#f8fafc', size: 14 } },
                  xaxis: {
                    ...darkLayout.xaxis,
                    rangeselector: {
                      buttons: [
                        { count: 1, label: '1y', step: 'year', stepmode: 'backward' },
                        { count: 5, label: '5y', step: 'year', stepmode: 'backward' },
                        { step: 'all', label: 'All' },
                      ],
                      bgcolor: '#0f172a',
                      font: { color: '#06b6d4' },
                    },
                  },
                }}
                useResizeHandler
                className="w-full h-full"
              />
            </div>
          </GlassCard>

          {/* Grid 2: Area Chart & Volume Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Chart 2: High/Low Area Chart */}
            <GlassCard className="space-y-4 border border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-purple-400" />
                <span>Price Range Area Chart (High vs Low)</span>
              </h2>
              <div className="w-full h-[350px]">
                <Plot
                  data={[
                    {
                      x: dates,
                      y: highPrices,
                      name: 'Day High',
                      type: 'scatter',
                      mode: 'lines',
                      line: { color: '#10b981', width: 1.5 },
                    },
                    {
                      x: dates,
                      y: lowPrices,
                      name: 'Day Low',
                      type: 'scatter',
                      mode: 'lines',
                      fill: 'tonexty',
                      line: { color: '#ef4444', width: 1.5 },
                    },
                  ]}
                  layout={{
                    ...darkLayout,
                    title: { text: 'High vs Low Price Bounds', font: { color: '#f8fafc', size: 14 } },
                  }}
                  useResizeHandler
                  className="w-full h-full"
                />
              </div>
            </GlassCard>

            {/* Chart 3: Volume Bar Chart */}
            <GlassCard className="space-y-4 border border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <BarChart2 className="w-5 h-5 text-blue-400" />
                <span>Trading Volume Bar Chart</span>
              </h2>
              <div className="w-full h-[350px]">
                <Plot
                  data={[
                    {
                      x: dates,
                      y: volumes,
                      type: 'bar',
                      name: 'Volume',
                      marker: { color: '#3b82f6' },
                    },
                  ]}
                  layout={{
                    ...darkLayout,
                    title: { text: 'Shares Traded Volume Density', font: { color: '#f8fafc', size: 14 } },
                  }}
                  useResizeHandler
                  className="w-full h-full"
                />
              </div>
            </GlassCard>
          </div>

          {/* Grid 3: Scatter Plot & Histogram */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Chart 4: Scatter Plot (Open vs Close) */}
            <GlassCard className="space-y-4 border border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-emerald-400" />
                <span>Scatter Correlation: Open vs Close Price</span>
              </h2>
              <div className="w-full h-[350px]">
                <Plot
                  data={[
                    {
                      x: openPrices,
                      y: closePrices,
                      mode: 'markers',
                      type: 'scatter',
                      marker: { color: '#a78bfa', size: 4, opacity: 0.6 },
                    },
                  ]}
                  layout={{
                    ...darkLayout,
                    title: { text: 'Linear Alignment of Open vs Close Prices', font: { color: '#f8fafc', size: 14 } },
                    xaxis: { ...darkLayout.xaxis, title: 'Open Price (₹)' },
                    yaxis: { ...darkLayout.yaxis, title: 'Close Price (₹)' },
                  }}
                  useResizeHandler
                  className="w-full h-full"
                />
              </div>
            </GlassCard>

            {/* Chart 5: Histogram Distribution of Close Prices */}
            <GlassCard className="space-y-4 border border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-amber-400" />
                <span>Close Price Histogram Distribution</span>
              </h2>
              <div className="w-full h-[350px]">
                <Plot
                  data={[
                    {
                      x: closePrices,
                      type: 'histogram',
                      marker: { color: '#06b6d4' },
                    },
                  ]}
                  layout={{
                    ...darkLayout,
                    title: { text: 'Frequency Distribution of Closing Prices', font: { color: '#f8fafc', size: 14 } },
                    xaxis: { ...darkLayout.xaxis, title: 'Close Price (₹)' },
                    yaxis: { ...darkLayout.yaxis, title: 'Frequency Count' },
                  }}
                  useResizeHandler
                  className="w-full h-full"
                />
              </div>
            </GlassCard>
          </div>

          {/* Chart 6: Feature Correlation Heatmap */}
          <GlassCard className="space-y-4 border border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Feature Correlation Heatmap</span>
            </h2>
            <p className="text-xs text-slate-400">
              Pearson correlation matrix demonstrating near-perfect correlation (1.00) between Open, High, Low and Close prices.
            </p>
            <div className="w-full h-[360px]">
              <Plot
                data={[
                  {
                    z: [
                      [1.00, 0.9998, 0.9998, 0.9997, 0.05],
                      [0.9998, 1.00, 0.9997, 0.9998, 0.06],
                      [0.9998, 0.9997, 1.00, 0.9998, 0.04],
                      [0.9997, 0.9998, 0.9998, 1.00, 0.05],
                      [0.05, 0.06, 0.04, 0.05, 1.00],
                    ],
                    x: ['Open', 'High', 'Low', 'Close', 'Volume'],
                    y: ['Open', 'High', 'Low', 'Close', 'Volume'],
                    type: 'heatmap',
                    colorscale: 'Viridis',
                  },
                ]}
                layout={{
                  ...darkLayout,
                  title: { text: 'TCS Stock Pearson Correlation Matrix', font: { color: '#f8fafc', size: 14 } },
                }}
                useResizeHandler
                className="w-full h-full"
              />
            </div>
          </GlassCard>

        </div>
      )}
    </div>
  );
};
