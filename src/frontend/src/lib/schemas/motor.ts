import { z } from 'zod';

export const motorParametersSchema = z.object({
  name: z
    .string()
    .min(1, 'Motor name is required')
    .max(100, 'Motor name cannot exceed 100 characters'),
  
  powerRating: z
    .number()
    .positive('Power rating must be positive')
    .max(10000, 'Power rating cannot exceed 10000 CV'),
  
  powerUnit: z
    .string()
    .min(1, 'Power unit is required')
    .default('CV'),
  
  voltage: z
    .number()
    .positive('Voltage must be positive')
    .max(50000, 'Voltage cannot exceed 50kV'),
  
  frequency: z
    .number()
    .positive('Frequency must be positive')
    .max(400, 'Frequency cannot exceed 400 Hz'),
  
  poles: z
    .number()
    .int('Number of poles must be an integer')
    .positive('Number of poles must be positive')
    .refine((val) => val % 2 === 0, 'Number of poles must be even')
    .max(100, 'Number of poles cannot exceed 100'),
  
  efficiency: z
    .number()
    .min(0.90, 'Efficiency must be at least 90%')
    .max(1.05, 'Efficiency cannot exceed 105%'),
  
  powerFactor: z
    .number()
    .min(0.1, 'Power factor must be at least 0.1')
    .max(1.0, 'Power factor cannot exceed 1.0'),
  
  currentDensity: z
    .number()
    .positive('Current density must be positive')
    .max(6.5, 'Current density should not exceed 6.5 A/mm² for safety')
    .refine((val) => val <= 4.5, {
      message: 'Current density above 4.5 A/mm² is not recommended',
    }),
  
  diameter: z
    .number()
    .positive('Diameter must be positive')
    .max(5000, 'Diameter cannot exceed 5000 mm'),
  
  length: z
    .number()
    .positive('Length must be positive')
    .max(10000, 'Length cannot exceed 10000 mm'),
  
  airGapLength: z
    .number()
    .positive('Air gap length must be positive')
    .max(50, 'Air gap length cannot exceed 50 mm'),
});

export type MotorParametersSchema = z.infer<typeof motorParametersSchema>;