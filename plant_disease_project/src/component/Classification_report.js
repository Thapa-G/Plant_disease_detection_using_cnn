import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const Report = () => {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/app/get_matr/', {
          withCredentials: true,
        });
        setMetrics(response.data.metrics);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setError('Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  if (!metrics) return <p style={{ textAlign: 'center' }}>No data available</p>;

  const lastRecall = metrics.recalls ? metrics.recalls[metrics.recalls.length - 1].toFixed(3) : 'N/A';
  const lastPrecision = metrics.precisions ? metrics.precisions[metrics.precisions.length - 1].toFixed(3): 'N/A';
  const lastF1Score = metrics.f1_scores ? metrics.f1_scores[metrics.f1_scores.length - 1] .toFixed(3) : 'N/A';

  const lossData = {
    labels: metrics.train_losses.map((_, index) => `Epoch ${index + 1}`),
    datasets: [
      { label: 'Training Loss', data: metrics.train_losses, borderColor: 'red', fill: false },
      { label: 'Validation Loss', data: metrics.val_losses, borderColor: 'blue', fill: false }
    ]
  };

  const accuracyData = {
    labels: metrics.val_accuracies.map((_, index) => `Epoch ${index + 1}`),
    datasets: [
      { label: 'Validation Accuracy', data: metrics.val_accuracies, borderColor: 'green', fill: false }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  // Extract the latest confusion matrix
  const lastConfusionMatrix = metrics.confusion_matrices && metrics.confusion_matrices.length > 0
    ? metrics.confusion_matrices[metrics.confusion_matrices.length - 1]
    : null;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Training Metrics Report</h1>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3>Final Evaluation Metrics</h3>
        <p><strong>Precision:</strong> {lastPrecision}</p>
        <p><strong>Recall:</strong> {lastRecall}</p>
        <p><strong>F1 Score:</strong> {lastF1Score}</p>
      </div>

      <div style={{ width: '500px', margin: '20px auto' }}>
        <h2 style={{ color: '#E44D26' }}>Loss Curve</h2>
        <div style={{ height: '300px' }}>
          <Line data={lossData} options={chartOptions} />
        </div>
      </div>

      <div style={{ width:'500px', margin: '20px auto' }}>
        <h2 style={{ color: '#4CAF50' }}>Accuracy Curve</h2>
        <div style={{ height: '300px' }}>
          <Line data={accuracyData} options={chartOptions} />
        </div>
      </div>

      {/* Confusion Matrix Display */}
      {lastConfusionMatrix && (
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <h2 style={{ color: '#333' }}>Confusion Matrix</h2>
          <table border="1" style={{ margin: 'auto', borderCollapse: 'collapse', fontSize: '18px' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px', border: '1px solid black' }}>Actual \ Predicted</th>
                {lastConfusionMatrix[0].map((_, index) => (
                  <th key={`col-${index}`} style={{ padding: '10px', border: '1px solid black' }}>P{index}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lastConfusionMatrix.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  <th style={{ padding: '10px', border: '1px solid black' }}>A{rowIndex}</th>
                  {row.map((value, colIndex) => (
                    <td key={`cell-${rowIndex}-${colIndex}`} style={{ padding: '10px', textAlign: 'center', border: '1px solid black' }}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Report;
