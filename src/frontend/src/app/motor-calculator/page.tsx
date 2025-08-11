'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotorForm } from './components/MotorForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { MotorCalculationResult } from '@/types/motor';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function MotorCalculatorPage() {
  const [calculationResult, setCalculationResult] = useState<MotorCalculationResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleCalculationComplete = (result: MotorCalculationResult) => {
    setCalculationResult(result);
    setShowResults(true);
  };

  const handleNewCalculation = () => {
    setShowResults(false);
    setCalculationResult(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Motor Calculator</h1>
                <p className="text-gray-600 mt-1">
                  Advanced three-phase motor electromagnetic analysis and design tool
                </p>
              </div>
              {showResults && (
                <button
                  onClick={handleNewCalculation}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  New Calculation
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!showResults ? (
            <div>
              {/* Information Section */}
              <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-blue-900 mb-2">
                  Three-Phase Motor Electromagnetic Calculator
                </h2>
                <p className="text-blue-800 mb-4">
                  This tool performs comprehensive electromagnetic analysis of three-phase induction motors,
                  calculating flux distributions, harmonic content, and validating parameters against engineering limits.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-md">
                    <h3 className="font-medium text-blue-900 mb-2">📊 Electromagnetic Analysis</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Flux per pole calculation</li>
                      <li>• Air gap induction analysis</li>
                      <li>• Tooth and yoke induction</li>
                      <li>• Winding factor optimization</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-md">
                    <h3 className="font-medium text-blue-900 mb-2">🌊 Harmonic Analysis</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• 5th, 7th harmonic content</li>
                      <li>• 11th, 13th harmonics</li>
                      <li>• 17th harmonic analysis</li>
                      <li>• Total harmonic distortion</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-md">
                    <h3 className="font-medium text-blue-900 mb-2">✅ Safety Validation</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Current density limits (≤4.5 A/mm²)</li>
                      <li>• Air gap induction (≤1.1T)</li>
                      <li>• Efficiency range (90-105%)</li>
                      <li>• Geometric ratio checks</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Motor Form */}
              <MotorForm onCalculationComplete={handleCalculationComplete} />
            </div>
          ) : (
            calculationResult && <ResultsDashboard result={calculationResult} />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Safety Guidelines</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Current density should not exceed 4.5 A/mm²</li>
                  <li>• Air gap induction must stay below 1.1T</li>
                  <li>• Efficiency should be between 90-105%</li>
                  <li>• Verify calculations with electrical standards</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Recommended Values</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Power factor: 0.8 - 0.95</li>
                  <li>• Efficiency: 92 - 98%</li>
                  <li>• Aspect ratio: 0.5 - 3.0</li>
                  <li>• Air gap induction: ~0.8T</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">About</h3>
                <p className="text-sm text-gray-600">
                  Professional motor design tool implementing industry-standard electromagnetic 
                  calculations with real-time validation and harmonic analysis.
                </p>
              </div>
            </div>
            <div className="border-t mt-8 pt-4">
              <p className="text-center text-sm text-gray-500">
                Motor Calculator v1.0 - Advanced Three-Phase Motor Analysis Tool
              </p>
            </div>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}