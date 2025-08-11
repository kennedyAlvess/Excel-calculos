'use client';

import { MotorData, ValidationError } from '@/types';

interface MotorFormProps {
  data: MotorData;
  onChange: (data: MotorData) => void;
  errors: ValidationError[];
  isCalculating: boolean;
  onCalculate: () => void;
  onReset: () => void;
}

export default function MotorForm({
  data,
  onChange,
  errors,
  isCalculating,
  onCalculate,
  onReset,
}: MotorFormProps) {
  const handleInputChange = (field: keyof MotorData, value: string | number) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.property.toLowerCase().includes(field.toLowerCase()))?.message;
  };

  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onCalculate(); }}>
      {/* Basic Motor Data */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Dados Básicos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modelo do Motor
            </label>
            <input
              type="text"
              value={data.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: WEG W22 1HP"
            />
            {getFieldError('model') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError('model')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Potência (HP)
            </label>
            <input
              type="number"
              step="0.1"
              value={data.powerHP}
              onChange={(e) => handleInputChange('powerHP', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {getFieldError('powerHP') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError('powerHP')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fator de Potência
            </label>
            <input
              type="number"
              step="0.01"
              min="0.1"
              max="1"
              value={data.powerFactor}
              onChange={(e) => handleInputChange('powerFactor', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {getFieldError('powerFactor') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError('powerFactor')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RPM
            </label>
            <input
              type="number"
              value={data.rpm}
              onChange={(e) => handleInputChange('rpm', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {getFieldError('rpm') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError('rpm')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Pólos
            </label>
            <select
              value={data.poles}
              onChange={(e) => handleInputChange('poles', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={2}>2 pólos</option>
              <option value={4}>4 pólos</option>
              <option value={6}>6 pólos</option>
              <option value={8}>8 pólos</option>
              <option value={10}>10 pólos</option>
              <option value={12}>12 pólos</option>
            </select>
            {getFieldError('poles') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError('poles')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rendimento (%)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.1"
              max="1.1"
              value={data.efficiency}
              onChange={(e) => handleInputChange('efficiency', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {getFieldError('efficiency') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError('efficiency')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frequência (Hz)
            </label>
            <select
              value={data.frequency}
              onChange={(e) => handleInputChange('frequency', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={50}>50 Hz</option>
              <option value={60}>60 Hz</option>
            </select>
            {getFieldError('frequency') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError('frequency')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Electrical Data */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Dados Elétricos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tensão Delta (V)
            </label>
            <input
              type="number"
              value={data.voltageDelta}
              onChange={(e) => handleInputChange('voltageDelta', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {getFieldError('voltageDelta') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError('voltageDelta')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tensão Estrela (V)
            </label>
            <input
              type="number"
              value={data.voltageStar}
              onChange={(e) => handleInputChange('voltageStar', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {getFieldError('voltageStar') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError('voltageStar')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Corrente Delta (A)
            </label>
            <input
              type="number"
              step="0.1"
              value={data.currentDelta}
              onChange={(e) => handleInputChange('currentDelta', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {getFieldError('currentDelta') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError('currentDelta')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Corrente Estrela (A)
            </label>
            <input
              type="number"
              step="0.1"
              value={data.currentStar}
              onChange={(e) => handleInputChange('currentStar', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {getFieldError('currentStar') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError('currentStar')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Core Data */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Dados do Núcleo</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profundidade do Canal (m)
            </label>
            <input
              type="number"
              step="0.001"
              value={data.slotDepth}
              onChange={(e) => handleInputChange('slotDepth', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {getFieldError('slotDepth') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError('slotDepth')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Altura da Coroa (m)
            </label>
            <input
              type="number"
              step="0.001"
              value={data.crownHeight}
              onChange={(e) => handleInputChange('crownHeight', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {getFieldError('crownHeight') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError('crownHeight')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Largura do Dente (m)
            </label>
            <input
              type="number"
              step="0.001"
              value={data.statorToothWidth}
              onChange={(e) => handleInputChange('statorToothWidth', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {getFieldError('statorToothWidth') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError('statorToothWidth')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Canais
            </label>
            <input
              type="number"
              value={data.numberOfSlots}
              onChange={(e) => handleInputChange('numberOfSlots', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {getFieldError('numberOfSlots') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError('numberOfSlots')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comprimento do Pacote (m)
            </label>
            <input
              type="number"
              step="0.001"
              value={data.stackLength}
              onChange={(e) => handleInputChange('stackLength', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {getFieldError('stackLength') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError('stackLength')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diâmetro Interno (m)
            </label>
            <input
              type="number"
              step="0.001"
              value={data.internalDiameter}
              onChange={(e) => handleInputChange('internalDiameter', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {getFieldError('internalDiameter') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError('internalDiameter')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isCalculating}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed font-medium"
        >
          {isCalculating ? 'Calculando...' : 'Calcular Motor'}
        </button>
        
        <button
          type="button"
          onClick={onReset}
          disabled={isCalculating}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed font-medium"
        >
          Limpar
        </button>
      </div>
    </form>
  );
}