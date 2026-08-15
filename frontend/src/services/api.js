import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

export const getHealthCheck = async () => {
  const response = await api.get('/');
  return response.data;
};

export const getAvailableModels = async () => {
  const response = await api.get('/models');
  return response.data;
};

export const predictClosePrice = async (payload) => {
  const response = await api.post('/predict', payload);
  return response.data;
};

export const compareModels = async () => {
  const response = await api.post('/compare');
  return response.data;
};

export const getModelMetrics = async () => {
  const response = await api.get('/metrics');
  return response.data;
};

export const getDatasetInfo = async () => {
  const response = await api.get('/dataset-info');
  return response.data;
};

export const getDatasetRecords = async (limit = 1000, skip = 0) => {
  const response = await api.get(`/dataset?limit=${limit}&skip=${skip}`);
  return response.data;
};

export const getModelRecommendation = async (payload) => {
  const response = await api.post('/recommend', payload);
  return response.data;
};

export default api;

