import { MotorData, CalculationResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const motorApi = {
  async calculateMotor(data: MotorData): Promise<CalculationResponse> {
    const response = await fetch(`${API_BASE_URL}/api/Motor/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro na calculação');
    }

    return response.json();
  },

  async getValidationRanges() {
    const response = await fetch(`${API_BASE_URL}/api/Motor/validation-ranges`);
    
    if (!response.ok) {
      throw new Error('Erro ao obter ranges de validação');
    }

    return response.json();
  },

  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/api/Motor/health`);
    return response.json();
  }
};