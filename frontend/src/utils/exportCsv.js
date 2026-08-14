export const exportPredictionToCsv = (predictionData) => {
  const headers = ['Timestamp', 'Open Price (₹)', 'High Price (₹)', 'Low Price (₹)', 'Volume', 'Predicted Close Price (₹)', 'Confidence Score (%)'];
  const row = [
    `"${predictionData.Timestamp || new Date().toISOString()}"`,
    predictionData.Features_Used?.Open || predictionData.Open || 0,
    predictionData.Features_Used?.High || predictionData.High || 0,
    predictionData.Features_Used?.Low || predictionData.Low || 0,
    predictionData.Features_Used?.Volume || predictionData.Volume || 0,
    predictionData.Predicted_Close || 0,
    predictionData.Confidence_Score || 99.99
  ];

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), row.join(',')].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `TCS_Prediction_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportDatasetToCsv = (dataset) => {
  if (!dataset || !dataset.length) return;
  const headers = Object.keys(dataset[0]);
  const rows = dataset.map(item => headers.map(h => `"${item[h]}"`).join(','));
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `TCS_Historical_Data_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
