import React from 'react';
import Plot from 'react-plotly.js';
import { GlassCard } from '../GlassCard';

export const PredictionCharts = ({ chartData }) => {
  if (!chartData || !chartData.y_true || !chartData.y_pred) {
    return null;
  }

  const { y_true, y_pred, feature_importance, feature_names, correlation_matrix } = chartData;

  // 1. Actual vs Predicted Line Plot
  const actualVsPredictedData = [
    {
      y: y_true,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Actual Close',
      marker: { color: '#38bdf8' },
    },
    {
      y: y_pred,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Predicted Close',
      marker: { color: '#fb7185' },
    },
  ];

  // 2. Residual Plot
  const residuals = y_true.map((val, i) => val - y_pred[i]);
  const residualData = [
    {
      y: residuals,
      x: y_pred,
      type: 'scatter',
      mode: 'markers',
      name: 'Residuals',
      marker: { color: '#a78bfa', size: 6 },
    },
    {
      x: [Math.min(...y_pred), Math.max(...y_pred)],
      y: [0, 0],
      type: 'scatter',
      mode: 'lines',
      name: 'Zero Error Line',
      line: { color: '#94a3b8', dash: 'dash' },
    },
  ];

  // 3. Feature Importance Bar Chart
  let featureImportanceData = null;
  if (feature_importance && feature_importance.length === feature_names.length) {
    featureImportanceData = [
      {
        x: feature_names,
        y: feature_importance,
        type: 'bar',
        marker: { color: '#34d399' },
      },
    ];
  }

  // 4. Correlation Heatmap
  let correlationData = null;
  if (correlation_matrix) {
    const keys = Object.keys(correlation_matrix);
    const z = keys.map((rowKey) => keys.map((colKey) => correlation_matrix[rowKey][colKey]));
    correlationData = [
      {
        z: z,
        x: keys,
        y: keys,
        type: 'heatmap',
        colorscale: 'Viridis',
      },
    ];
  }

  const layoutBase = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { color: '#cbd5e1' },
    margin: { t: 40, l: 50, r: 20, b: 40 },
    xaxis: { gridcolor: '#334155', zerolinecolor: '#334155' },
    yaxis: { gridcolor: '#334155', zerolinecolor: '#334155' },
    legend: { orientation: 'h', y: -0.2 },
  };

  return (
    <div className="space-y-6 mt-8">
      <h3 className="text-xl font-bold text-white mb-4">Model Insights</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-4 border border-slate-800">
          <h4 className="text-sm font-semibold text-slate-300 mb-2">Actual vs Predicted (Test Set)</h4>
          <Plot
            data={actualVsPredictedData}
            layout={{ ...layoutBase, title: '' }}
            useResizeHandler={true}
            style={{ width: '100%', height: '300px' }}
          />
        </GlassCard>

        <GlassCard className="p-4 border border-slate-800">
          <h4 className="text-sm font-semibold text-slate-300 mb-2">Residual Plot</h4>
          <Plot
            data={residualData}
            layout={{ ...layoutBase, title: '', xaxis: { ...layoutBase.xaxis, title: 'Predicted Value' }, yaxis: { ...layoutBase.yaxis, title: 'Residual Error' } }}
            useResizeHandler={true}
            style={{ width: '100%', height: '300px' }}
          />
        </GlassCard>

        {featureImportanceData && (
          <GlassCard className="p-4 border border-slate-800">
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Feature Importance</h4>
            <Plot
              data={featureImportanceData}
              layout={{ ...layoutBase, title: '' }}
              useResizeHandler={true}
              style={{ width: '100%', height: '300px' }}
            />
          </GlassCard>
        )}

        {correlationData && (
          <GlassCard className="p-4 border border-slate-800">
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Feature Correlation</h4>
            <Plot
              data={correlationData}
              layout={{ ...layoutBase, title: '' }}
              useResizeHandler={true}
              style={{ width: '100%', height: '300px' }}
            />
          </GlassCard>
        )}
      </div>
    </div>
  );
};
