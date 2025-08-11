'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { motorParametersSchema, type MotorParametersSchema } from '@/lib/schemas/motor';
import { motorApi } from '@/lib/api-client/motor-api';
import type { MotorCalculationResult } from '@/types/motor';

interface MotorFormProps {
  onCalculationComplete?: (result: MotorCalculationResult) => void;
}

export function MotorForm({ onCalculationComplete }: MotorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<MotorParametersSchema>({
    resolver: zodResolver(motorParametersSchema),
    defaultValues: {
      name: '',
      powerRating: 5,
      powerUnit: 'CV',
      voltage: 380,
      frequency: 60,
      poles: 4,
      efficiency: 0.95,
      powerFactor: 0.85,
      currentDensity: 4.0,
      diameter: 150,
      length: 200,
      airGapLength: 0.5,
    },
  });

  const calculateMutation = useMutation({
    mutationFn: motorApi.calculateMotor,
    onSuccess: (result) => {
      onCalculationComplete?.(result);
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error('Calculation error:', error);
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: MotorParametersSchema) => {
    setIsSubmitting(true);
    calculateMutation.mutate(data);
  };

  const watchedValues = watch();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Motor Calculator</h2>
        <p className="text-gray-600">
          Enter motor parameters to calculate electromagnetic characteristics and performance metrics.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Motor Identification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Motor Name *
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Industrial Motor 5CV"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
        </div>

        {/* Power and Electrical Parameters */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Electrical Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="powerRating" className="block text-sm font-medium text-gray-700 mb-1">
                Power Rating *
              </label>
              <div className="flex">
                <input
                  {...register('powerRating', { valueAsNumber: true })}
                  type="number"
                  step="0.1"
                  id="powerRating"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5"
                />
                <select
                  {...register('powerUnit')}
                  className="px-3 py-2 border border-gray-300 border-l-0 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CV">CV</option>
                  <option value="HP">HP</option>
                  <option value="kW">kW</option>
                </select>
              </div>
              {errors.powerRating && (
                <p className="mt-1 text-sm text-red-600">{errors.powerRating.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="voltage" className="block text-sm font-medium text-gray-700 mb-1">
                Voltage (V) *
              </label>
              <input
                {...register('voltage', { valueAsNumber: true })}
                type="number"
                step="1"
                id="voltage"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="380"
              />
              {errors.voltage && (
                <p className="mt-1 text-sm text-red-600">{errors.voltage.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                Frequency (Hz) *
              </label>
              <select
                {...register('frequency', { valueAsNumber: true })}
                id="frequency"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={50}>50 Hz</option>
                <option value={60}>60 Hz</option>
                <option value={25}>25 Hz</option>
                <option value={400}>400 Hz</option>
              </select>
              {errors.frequency && (
                <p className="mt-1 text-sm text-red-600">{errors.frequency.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Performance Parameters */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="poles" className="block text-sm font-medium text-gray-700 mb-1">
                Poles *
              </label>
              <select
                {...register('poles', { valueAsNumber: true })}
                id="poles"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={2}>2 poles</option>
                <option value={4}>4 poles</option>
                <option value={6}>6 poles</option>
                <option value={8}>8 poles</option>
                <option value={10}>10 poles</option>
                <option value={12}>12 poles</option>
              </select>
              {errors.poles && (
                <p className="mt-1 text-sm text-red-600">{errors.poles.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="efficiency" className="block text-sm font-medium text-gray-700 mb-1">
                Efficiency *
                <span className="text-xs text-gray-500 ml-1">(90-105%)</span>
              </label>
              <input
                {...register('efficiency', { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0.90"
                max="1.05"
                id="efficiency"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.95"
              />
              {errors.efficiency && (
                <p className="mt-1 text-sm text-red-600">{errors.efficiency.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="powerFactor" className="block text-sm font-medium text-gray-700 mb-1">
                Power Factor *
                <span className="text-xs text-gray-500 ml-1">(0.1-1.0)</span>
              </label>
              <input
                {...register('powerFactor', { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0.1"
                max="1.0"
                id="powerFactor"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.85"
              />
              {errors.powerFactor && (
                <p className="mt-1 text-sm text-red-600">{errors.powerFactor.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="currentDensity" className="block text-sm font-medium text-gray-700 mb-1">
                Current Density *
                <span className="text-xs text-gray-500 ml-1">(A/mm²)</span>
              </label>
              <input
                {...register('currentDensity', { valueAsNumber: true })}
                type="number"
                step="0.1"
                min="0.1"
                max="6.5"
                id="currentDensity"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  watchedValues.currentDensity > 4.5 ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300'
                }`}
                placeholder="4.0"
              />
              {watchedValues.currentDensity > 4.5 && (
                <p className="mt-1 text-sm text-yellow-600">
                  ⚠️ Above recommended 4.5 A/mm²
                </p>
              )}
              {errors.currentDensity && (
                <p className="mt-1 text-sm text-red-600">{errors.currentDensity.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Geometric Parameters */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Geometric Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="diameter" className="block text-sm font-medium text-gray-700 mb-1">
                Diameter (mm) *
              </label>
              <input
                {...register('diameter', { valueAsNumber: true })}
                type="number"
                step="1"
                min="1"
                max="5000"
                id="diameter"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="150"
              />
              {errors.diameter && (
                <p className="mt-1 text-sm text-red-600">{errors.diameter.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
                Length (mm) *
              </label>
              <input
                {...register('length', { valueAsNumber: true })}
                type="number"
                step="1"
                min="1"
                max="10000"
                id="length"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="200"
              />
              {errors.length && (
                <p className="mt-1 text-sm text-red-600">{errors.length.message}</p>
              )}
              {watchedValues.diameter && watchedValues.length && (
                <p className="mt-1 text-xs text-gray-500">
                  Aspect ratio: {(watchedValues.length / watchedValues.diameter).toFixed(2)} 
                  {watchedValues.length / watchedValues.diameter > 3 && (
                    <span className="text-yellow-600"> ⚠️ High ratio</span>
                  )}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="airGapLength" className="block text-sm font-medium text-gray-700 mb-1">
                Air Gap (mm) *
              </label>
              <input
                {...register('airGapLength', { valueAsNumber: true })}
                type="number"
                step="0.1"
                min="0.1"
                max="50"
                id="airGapLength"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.5"
              />
              {errors.airGapLength && (
                <p className="mt-1 text-sm text-red-600">{errors.airGapLength.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="border-t pt-6">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => reset()}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Reset Form
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </span>
              ) : (
                'Calculate Motor'
              )}
            </button>
          </div>
        </div>
      </form>

      {calculateMutation.error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 font-medium">Calculation Error</p>
          <p className="text-red-600 text-sm mt-1">
            {calculateMutation.error instanceof Error ? calculateMutation.error.message : 'An unknown error occurred'}
          </p>
        </div>
      )}
    </div>
  );
}