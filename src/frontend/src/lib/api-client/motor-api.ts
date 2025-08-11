import axios from 'axios';
import { MotorParameters, MotorCalculationResult, MotorLimits } from '@/types/motor';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5261/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const motorApi = {
  // Calculate motor parameters
  calculateMotor: async (parameters: MotorParameters): Promise<MotorCalculationResult> => {
    const response = await apiClient.post<MotorCalculationResult>('/motor/calculate', parameters);
    return response.data;
  },

  // Validate motor parameters
  validateMotorParameters: async (parameters: MotorParameters): Promise<{ isValid: boolean; message: string }> => {
    const response = await apiClient.post<{ isValid: boolean; message: string }>('/motor/validate', parameters);
    return response.data;
  },

  // Get motor calculation limits
  getMotorLimits: async (): Promise<MotorLimits> => {
    const response = await apiClient.get<MotorLimits>('/motor/limits');
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<{ status: string; service: string; timestamp: string; version: string }> => {
    const response = await apiClient.get('/motor/health');
    return response.data;
  },
};

export default apiClient;