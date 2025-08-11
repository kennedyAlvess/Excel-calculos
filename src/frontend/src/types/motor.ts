export interface MotorParameters {
  name: string;
  powerRating: number;
  powerUnit: string;
  voltage: number;
  frequency: number;
  poles: number;
  efficiency: number;
  powerFactor: number;
  currentDensity: number;
  diameter: number;
  length: number;
  airGapLength: number;
}

export interface HarmonicResults {
  fifth: number;
  seventh: number;
  eleventh: number;
  thirteenth: number;
  seventeenth: number;
  totalHarmonicDistortion: number;
}

export interface MotorCalculationResult {
  id: string;
  name: string;
  parameters: MotorParameters;
  fluxPerPole: number;
  airGapInduction: number;
  toothInduction: number;
  yokeInduction: number;
  windingFactor: number;
  inducedVoltage: number;
  specificPower: number;
  harmonics: HarmonicResults;
  isValid: boolean;
  validationErrors: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface MotorLimits {
  efficiency: {
    min: number;
    max: number;
    recommended: { min: number; max: number };
  };
  currentDensity: {
    max: number;
    recommended: number;
    unit: string;
  };
  airGapInduction: {
    max: number;
    recommended: number;
    unit: string;
  };
  powerFactor: {
    min: number;
    max: number;
    recommended: { min: number; max: number };
  };
  aspectRatio: {
    min: number;
    max: number;
    unit: string;
  };
  frequency: {
    min: number;
    max: number;
    common: number[];
    unit: string;
  };
  poles: {
    min: number;
    max: number;
    common: number[];
    note: string;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}