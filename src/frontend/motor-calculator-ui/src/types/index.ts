export interface MotorData {
  model: string;
  powerHP: number;
  powerFactor: number;
  rpm: number;
  poles: number;
  efficiency: number;
  frequency: number;
  voltageDelta: number;
  voltageStar: number;
  currentDelta: number;
  currentStar: number;
  slotDepth: number;
  crownHeight: number;
  statorToothWidth: number;
  numberOfSlots: number;
  stackLength: number;
  internalDiameter: number;
}

export interface CalculationResults {
  totalFlux: number;
  fluxPerPole: number;
  airGapInduction: number;
  statorToothInduction: number;
  statorCrownInduction: number;
  harmonics: HarmonicsData;
  windingFactor: number;
  pitchFactor: number;
  distributionFactor: number;
  airGapArea: number;
  turnsPerPhase: number;
  resistancePerPhase: number;
  jouleLosses: number;
  wireSection: number;
  currentDensity: number;
  awgSize: string;
  specificPower: number;
  validationAlerts: ValidationAlert[];
}

export interface HarmonicsData {
  firstOrder: number;
  fifthOrder: number;
  seventhOrder: number;
  eleventhOrder: number;
  thirteenthOrder: number;
  seventeenthOrder: number;
}

export interface ValidationAlert {
  type: 'Info' | 'Warning' | 'Critical';
  message: string;
  parameter: string;
  currentValue?: number;
  recommendedMin?: number;
  recommendedMax?: number;
}

export interface CalculationResponse {
  success: boolean;
  errorMessage?: string;
  results?: CalculationResults;
}

export interface ValidationError {
  property: string;
  message: string;
  attemptedValue?: unknown;
}