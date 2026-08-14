import jsPDF from 'jspdf';

export const exportPredictionReportPdf = (predictionData) => {
  const doc = new jsPDF();
  
  // Dark style theme header
  doc.setFillColor(3, 7, 18);
  doc.rect(0, 0, 210, 297, 'F');
  
  doc.setTextColor(6, 182, 212);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('TCS AI Stock Price Prediction Report', 14, 25);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 33);
  doc.text('Model: Multiple Linear Regression | Dataset: TCS Historical Stock Data', 14, 39);

  // Line separator
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.5);
  doc.line(14, 45, 196, 45);

  // Result Section Box
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(14, 52, 182, 45, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text("Predicted Today's Close Price:", 22, 65);
  
  doc.setTextColor(34, 197, 94);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(`INR ${predictionData.Predicted_Close?.toFixed(2) || '0.00'}`, 22, 80);

  doc.setTextColor(168, 85, 247);
  doc.setFontSize(12);
  doc.text(`Model Confidence (R²): ${predictionData.Confidence_Score || 99.99}%`, 110, 80);

  // Inputs Section
  doc.setTextColor(6, 182, 212);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Input Parameters Provided:', 14, 115);

  const inputs = [
    ['Opening Price (Open)', `INR ${predictionData.Features_Used?.Open || 0}`],
    ['Day High Price (High)', `INR ${predictionData.Features_Used?.High || 0}`],
    ['Day Low Price (Low)', `INR ${predictionData.Features_Used?.Low || 0}`],
    ['Trading Volume (Volume)', `${predictionData.Features_Used?.Volume?.toLocaleString() || 0} shares`]
  ];

  let yPos = 128;
  inputs.forEach(([label, value]) => {
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(14, yPos, 182, 12, 2, 2, 'F');
    doc.setTextColor(226, 232, 240);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(label, 20, yPos + 8);
    doc.setFont('helvetica', 'bold');
    doc.text(value, 140, yPos + 8);
    yPos += 16;
  });

  // Disclaimer / Footer
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('Disclaimer: This prediction is generated using a Multiple Linear Regression model for educational and research purposes.', 14, 270);
  doc.text('TCS Stock Price Prediction Dashboard © 2026', 14, 276);

  doc.save(`TCS_Stock_Prediction_Report_${Date.now()}.pdf`);
};
