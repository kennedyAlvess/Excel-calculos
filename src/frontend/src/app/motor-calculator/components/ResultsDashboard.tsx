'use client';

import { MotorCalculationResult } from '@/types/motor';

interface ResultsDashboardProps {
  result: MotorCalculationResult;
}

export function ResultsDashboard({ result }: ResultsDashboardProps) {
  const formatNumber = (value: number, decimals: number = 4) => {
    return value.toFixed(decimals);
  };

  const getValidationStatus = () => {
    if (result.isValid) {
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: '✅',
        message: 'All parameters within safe operating limits'
      };
    } else {
      return {
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: '⚠️',
        message: 'Warning: Parameters outside recommended limits'
      };
    }
  };

  const status = getValidationStatus();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{result.name}</h2>
            <p className="text-gray-600">
              {result.parameters.powerRating} {result.parameters.powerUnit} • {result.parameters.voltage}V • {result.parameters.frequency}Hz • {result.parameters.poles} poles
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Calculated at</p>
            <p className="text-sm font-medium">{new Date(result.createdAt).toLocaleString()}</p>
          </div>
        </div>

        {/* Validation Status */}
        <div className={`p-4 rounded-md ${status.bgColor} ${status.borderColor} border`}>
          <div className="flex items-center">
            <span className="text-xl mr-2">{status.icon}</span>
            <span className={`font-medium ${status.color}`}>{status.message}</span>
          </div>
          {result.validationErrors.length > 0 && (
            <ul className="mt-2 space-y-1">
              {result.validationErrors.map((error, index) => (
                <li key={index} className={`text-sm ${status.color}`}>
                  • {error}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Electromagnetic Results */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Electromagnetic Analysis</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-600">Flux per Pole</p>
                <p className="text-xl font-bold text-blue-600">{formatNumber(result.fluxPerPole)} Wb</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-600">Winding Factor</p>
                <p className="text-xl font-bold text-blue-600">{formatNumber(result.windingFactor, 3)}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="font-medium text-gray-700">Air Gap Induction</span>
                <span className={`font-bold ${result.airGapInduction > 1.1 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatNumber(result.airGapInduction)} T
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="font-medium text-gray-700">Tooth Induction</span>
                <span className="font-bold text-gray-900">{formatNumber(result.toothInduction)} T</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="font-medium text-gray-700">Yoke Induction</span>
                <span className="font-bold text-gray-900">{formatNumber(result.yokeInduction)} T</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Results */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-600">Induced Voltage</p>
                <p className="text-xl font-bold text-green-600">{formatNumber(result.inducedVoltage, 1)} V</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-600">Specific Power</p>
                <p className="text-xl font-bold text-green-600">{formatNumber(result.specificPower, 3)} kW/kg</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="font-medium text-gray-700">Efficiency</span>
                <span className={`font-bold ${result.parameters.efficiency < 0.9 ? 'text-red-600' : 'text-green-600'}`}>
                  {(result.parameters.efficiency * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="font-medium text-gray-700">Power Factor</span>
                <span className={`font-bold ${result.parameters.powerFactor < 0.8 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {result.parameters.powerFactor.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="font-medium text-gray-700">Current Density</span>
                <span className={`font-bold ${result.parameters.currentDensity > 4.5 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {result.parameters.currentDensity.toFixed(1)} A/mm²
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Harmonic Analysis */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Harmonic Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-blue-50 p-4 rounded-md text-center">
            <p className="text-sm font-medium text-blue-600">5th Harmonic</p>
            <p className="text-lg font-bold text-blue-800">{formatNumber(result.harmonics.fifth, 3)}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-md text-center">
            <p className="text-sm font-medium text-blue-600">7th Harmonic</p>
            <p className="text-lg font-bold text-blue-800">{formatNumber(result.harmonics.seventh, 3)}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-md text-center">
            <p className="text-sm font-medium text-blue-600">11th Harmonic</p>
            <p className="text-lg font-bold text-blue-800">{formatNumber(result.harmonics.eleventh, 3)}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-md text-center">
            <p className="text-sm font-medium text-blue-600">13th Harmonic</p>
            <p className="text-lg font-bold text-blue-800">{formatNumber(result.harmonics.thirteenth, 3)}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-md text-center">
            <p className="text-sm font-medium text-blue-600">17th Harmonic</p>
            <p className="text-lg font-bold text-blue-800">{formatNumber(result.harmonics.seventeenth, 3)}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-md text-center">
            <p className="text-sm font-medium text-purple-600">Total THD</p>
            <p className="text-lg font-bold text-purple-800">{formatNumber(result.harmonics.totalHarmonicDistortion, 3)}</p>
          </div>
        </div>
      </div>

      {/* Input Parameters Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Input Parameters</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Power</h4>
            <p className="text-sm text-gray-600">Rating: {result.parameters.powerRating} {result.parameters.powerUnit}</p>
            <p className="text-sm text-gray-600">Voltage: {result.parameters.voltage} V</p>
            <p className="text-sm text-gray-600">Frequency: {result.parameters.frequency} Hz</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Configuration</h4>
            <p className="text-sm text-gray-600">Poles: {result.parameters.poles}</p>
            <p className="text-sm text-gray-600">Efficiency: {(result.parameters.efficiency * 100).toFixed(1)}%</p>
            <p className="text-sm text-gray-600">Power Factor: {result.parameters.powerFactor.toFixed(2)}</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Geometry</h4>
            <p className="text-sm text-gray-600">Diameter: {result.parameters.diameter} mm</p>
            <p className="text-sm text-gray-600">Length: {result.parameters.length} mm</p>
            <p className="text-sm text-gray-600">Air Gap: {result.parameters.airGapLength} mm</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Ratios</h4>
            <p className="text-sm text-gray-600">
              Aspect Ratio: {(result.parameters.length / result.parameters.diameter).toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">Current Density: {result.parameters.currentDensity} A/mm²</p>
            <p className="text-sm text-gray-600">
              Synchronous Speed: {Math.round(120 * result.parameters.frequency / result.parameters.poles)} RPM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}