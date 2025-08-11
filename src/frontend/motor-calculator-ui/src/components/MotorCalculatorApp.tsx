'use client';

import { useState } from 'react';
import { MotorData, CalculationResults, ValidationError } from '@/types';
import { motorApi } from '@/lib/api';
import MotorForm from './MotorForm';
import ResultsDashboard from './ResultsDashboard';

const defaultMotorData: MotorData = {
  model: '',
  powerHP: 1,
  powerFactor: 0.85,
  rpm: 1800,
  poles: 4,
  efficiency: 0.9,
  frequency: 60,
  voltageDelta: 220,
  voltageStar: 220,
  currentDelta: 3.8,
  currentStar: 3.8,
  slotDepth: 0.025,
  crownHeight: 0.015,
  statorToothWidth: 0.008,
  numberOfSlots: 36,
  stackLength: 0.12,
  internalDiameter: 0.08,
};

export default function MotorCalculatorApp() {
  const [motorData, setMotorData] = useState<MotorData>(defaultMotorData);
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const handleCalculate = async () => {
    setIsCalculating(true);
    setErrors([]);
    
    try {
      const response = await motorApi.calculateMotor(motorData);
      
      if (response.success && response.results) {
        setResults(response.results);
      } else {
        setErrors([{ property: 'general', message: response.errorMessage || 'Erro desconhecido' }]);
      }
    } catch (error: unknown) {
      console.error('Calculation error:', error);
      setErrors([{ property: 'general', message: 'Erro de conexão com o servidor' }]);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setMotorData(defaultMotorData);
    setResults(null);
    setErrors([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Calculadora de Motores Trifásicos
        </h1>
        <p className="text-lg text-gray-600">
          Versão Web da Planilha Premium 2.0 - Cálculos completos de motores elétricos
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Dados do Motor
            </h2>
            <MotorForm
              data={motorData}
              onChange={setMotorData}
              errors={errors}
              isCalculating={isCalculating}
              onCalculate={handleCalculate}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {results ? (
            <ResultsDashboard results={results} />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📊</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Resultados dos Cálculos
                </h3>
                <p className="text-gray-500">
                  Preencha os dados do motor e clique em &quot;Calcular&quot; para visualizar os resultados
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium mb-2">Erros de Validação:</h3>
          <ul className="space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-red-700 text-sm">
                <strong>{error.property}:</strong> {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}