using MotorCalculator.Domain.Entities;
using MotorCalculator.Domain.ValueObjects;

namespace MotorCalculator.Domain.Services;

public class MotorCalculationService
{
    private const double Pi = Math.PI;
    
    public CalculationResults CalculateMotor(Motor motor)
    {
        var results = new CalculationResults();
        
        // Validate input parameters
        ValidateInputs(motor, results);
        
        // Core calculations based on Excel formulas
        CalculateFluxValues(motor, results);
        CalculateInductions(motor, results);
        CalculateWindingFactors(motor, results);
        CalculateAirGapArea(motor, results);
        CalculateTurnsPerPhase(motor, results);
        CalculateResistance(motor, results);
        CalculateWireSection(motor, results);
        CalculateSpecificPower(motor, results);
        CalculateHarmonics(motor, results);
        
        // Final validations and alerts
        PerformFinalValidations(motor, results);
        
        return results;
    }
    
    private void ValidateInputs(Motor motor, CalculationResults results)
    {
        // Power validation
        if (motor.PowerHP <= 0)
            results.ValidationAlerts.Add(new ValidationAlert
            {
                Type = AlertType.Critical,
                Message = "Potência deve ser maior que zero",
                Parameter = "PowerHP"
            });
            
        // Efficiency validation (90-105% is typical range)
        if (motor.Efficiency < 0.8 || motor.Efficiency > 1.05)
            results.ValidationAlerts.Add(new ValidationAlert
            {
                Type = AlertType.Warning,
                Message = "Rendimento fora da faixa típica (80-105%)",
                Parameter = "Efficiency",
                CurrentValue = motor.Efficiency * 100,
                RecommendedMin = 80,
                RecommendedMax = 105
            });
            
        // Power factor validation
        if (motor.PowerFactor < 0.1 || motor.PowerFactor > 1.0)
            results.ValidationAlerts.Add(new ValidationAlert
            {
                Type = AlertType.Critical,
                Message = "Fator de potência deve estar entre 0.1 e 1.0",
                Parameter = "PowerFactor"
            });
    }
    
    private void CalculateFluxValues(Motor motor, CalculationResults results)
    {
        // Power in Watts = PowerHP * 736
        double powerWatts = motor.PowerHP * 736;
        
        // Voltage per phase (assuming star connection for calculation)
        double voltagePerPhase = motor.VoltageStar.Value / Math.Sqrt(3);
        
        // Calculate flux per pole based on power and electrical parameters
        // Flux per pole = (E * 60) / (4.44 * f * Nph * Kw)
        // Where E = voltage per phase, f = frequency, Nph = turns per phase, Kw = winding factor
        
        // Initial estimation for turns per phase (will be refined later)
        double estimatedTurnsPerPhase = 100; // This is refined in CalculateTurnsPerPhase
        double estimatedWindingFactor = 0.9; // This is refined in CalculateWindingFactors
        
        results.FluxPerPole = (voltagePerPhase * 60) / (4.44 * motor.Frequency * estimatedTurnsPerPhase * estimatedWindingFactor);
        results.TotalFlux = results.FluxPerPole * motor.Poles;
    }
    
    private void CalculateInductions(Motor motor, CalculationResults results)
    {
        // Air gap induction = FluxPerPole / AirGapArea
        double airGapArea = CalculateAirGapAreaValue(motor);
        results.AirGapInduction = results.FluxPerPole / airGapArea;
        
        // Stator tooth induction
        double statorToothArea = motor.CoreData.StatorToothWidth * motor.CoreData.StackLength;
        results.StatorToothInduction = results.FluxPerPole / statorToothArea;
        
        // Stator crown induction  
        double statorCrownArea = motor.CoreData.CrownHeight * motor.CoreData.StackLength;
        results.StatorCrownInduction = results.FluxPerPole / (statorCrownArea * 2); // Divided by 2 as flux splits
        
        // Validate magnetic saturation
        if (results.StatorToothInduction > 1.8)
            results.ValidationAlerts.Add(new ValidationAlert
            {
                Type = AlertType.Critical,
                Message = "Saturação magnética nos dentes do estator",
                Parameter = "StatorToothInduction",
                CurrentValue = results.StatorToothInduction,
                RecommendedMax = 1.8
            });
            
        if (results.StatorCrownInduction > 1.6)
            results.ValidationAlerts.Add(new ValidationAlert
            {
                Type = AlertType.Critical,
                Message = "Saturação magnética na coroa do estator",
                Parameter = "StatorCrownInduction",
                CurrentValue = results.StatorCrownInduction,
                RecommendedMax = 1.6
            });
    }
    
    private void CalculateWindingFactors(Motor motor, CalculationResults results)
    {
        // Slots per pole per phase
        double slotsPerPolePerPhase = motor.CoreData.NumberOfSlots / (motor.Poles * 3.0);
        
        // Pitch factor (assuming full pitch initially)
        results.PitchFactor = 1.0;
        
        // Distribution factor for 3-phase winding
        // Kd = sin(m*α/2) / (m * sin(α/2))
        // where m = slots per pole per phase, α = slot angle in radians
        double slotAngle = (2 * Pi) / motor.CoreData.NumberOfSlots;
        double alpha = slotAngle * motor.Poles / 2;
        
        if (slotsPerPolePerPhase > 1)
        {
            results.DistributionFactor = Math.Sin(slotsPerPolePerPhase * alpha / 2) / 
                                       (slotsPerPolePerPhase * Math.Sin(alpha / 2));
        }
        else
        {
            results.DistributionFactor = 1.0;
        }
        
        // Overall winding factor
        results.WindingFactor = results.PitchFactor * results.DistributionFactor;
    }
    
    private void CalculateAirGapArea(Motor motor, CalculationResults results)
    {
        results.AirGapArea = CalculateAirGapAreaValue(motor);
    }
    
    private double CalculateAirGapAreaValue(Motor motor)
    {
        // Air gap area = π * D * L / p
        // where D = internal diameter, L = stack length, p = number of poles
        return (Pi * motor.CoreData.InternalDiameter * motor.CoreData.StackLength) / motor.Poles;
    }
    
    private void CalculateTurnsPerPhase(Motor motor, CalculationResults results)
    {
        // Voltage per phase
        double voltagePerPhase = motor.VoltageStar.Value / Math.Sqrt(3);
        
        // Turns per phase = E / (4.44 * f * Φ * Kw)
        // where E = voltage per phase, f = frequency, Φ = flux per pole, Kw = winding factor
        results.TurnsPerPhase = voltagePerPhase / (4.44 * motor.Frequency * results.FluxPerPole * results.WindingFactor);
        
        // Round to nearest whole number
        results.TurnsPerPhase = Math.Round(results.TurnsPerPhase);
        
        // Recalculate flux with actual turns
        double voltagePerPhaseRecalc = motor.VoltageStar.Value / Math.Sqrt(3);
        results.FluxPerPole = voltagePerPhaseRecalc / (4.44 * motor.Frequency * results.TurnsPerPhase * results.WindingFactor);
    }
    
    private void CalculateResistance(Motor motor, CalculationResults results)
    {
        // Average length of turn (simplified calculation)
        double averageTurnLength = 2 * (motor.CoreData.StackLength + Pi * motor.CoreData.InternalDiameter / motor.Poles);
        
        // Total conductor length per phase
        double totalLength = results.TurnsPerPhase * averageTurnLength;
        
        // Resistance per phase = ρ * L / A
        // where ρ = resistivity of copper (1.68e-8 Ω·m), L = length, A = cross-sectional area
        double copperResistivity = 1.68e-8; // Ω·m at 20°C
        
        // Wire section will be calculated next, so use estimated value for now
        double estimatedWireSection = 1e-6; // 1 mm² in m²
        results.ResistancePerPhase = (copperResistivity * totalLength) / estimatedWireSection;
        
        // Joule losses = 3 * I² * R (for 3-phase)
        double currentPerPhase = motor.CurrentStar.Value;
        results.JouleLosses = 3 * Math.Pow(currentPerPhase, 2) * results.ResistancePerPhase;
    }
    
    private void CalculateWireSection(Motor motor, CalculationResults results)
    {
        // Current density (A/mm²) - typically 3-6 A/mm² for continuous operation
        results.CurrentDensity = 4.5; // Conservative value
        
        // Wire section = Current / Current density
        results.WireSection = motor.CurrentStar.Value / results.CurrentDensity;
        
        // Recalculate resistance with actual wire section
        double averageTurnLength = 2 * (motor.CoreData.StackLength + Pi * motor.CoreData.InternalDiameter / motor.Poles);
        double totalLength = results.TurnsPerPhase * averageTurnLength;
        double copperResistivity = 1.68e-8;
        double wireSectionM2 = results.WireSection * 1e-6; // Convert mm² to m²
        
        results.ResistancePerPhase = (copperResistivity * totalLength) / wireSectionM2;
        
        // Calculate AWG size based on wire section
        results.AWGSize = CalculateAWGSize(results.WireSection);
        
        // Validate current density
        if (results.CurrentDensity > 6.0)
            results.ValidationAlerts.Add(new ValidationAlert
            {
                Type = AlertType.Warning,
                Message = "Densidade de corrente elevada - pode causar aquecimento excessivo",
                Parameter = "CurrentDensity",
                CurrentValue = results.CurrentDensity,
                RecommendedMax = 6.0
            });
    }
    
    private void CalculateSpecificPower(Motor motor, CalculationResults results)
    {
        // Specific power = Power / (D² * L)
        // where D = internal diameter, L = stack length
        double powerWatts = motor.PowerHP * 736;
        double volume = Math.Pow(motor.CoreData.InternalDiameter, 2) * motor.CoreData.StackLength;
        
        results.SpecificPower = powerWatts / volume;
        
        // Typical range is 100-500 kW/m³
        if (results.SpecificPower < 100000 || results.SpecificPower > 500000)
            results.ValidationAlerts.Add(new ValidationAlert
            {
                Type = AlertType.Info,
                Message = "Potência específica fora da faixa típica",
                Parameter = "SpecificPower",
                CurrentValue = results.SpecificPower / 1000,
                RecommendedMin = 100,
                RecommendedMax = 500
            });
    }
    
    private void CalculateHarmonics(Motor motor, CalculationResults results)
    {
        // Harmonic factors based on winding configuration
        double fundamentalFactor = results.WindingFactor;
        
        // Calculate harmonic winding factors
        // For harmonics: Kwh = sin(h*π*y/τ) * sin(h*q*α/2) / (q*sin(h*α/2))
        // where h = harmonic order, y = coil pitch, τ = pole pitch, q = slots per pole per phase
        
        double slotsPerPolePerPhase = motor.CoreData.NumberOfSlots / (motor.Poles * 3.0);
        double slotAngle = (2 * Pi) / motor.CoreData.NumberOfSlots;
        
        results.Harmonics.FirstOrder = fundamentalFactor;
        results.Harmonics.FifthOrder = CalculateHarmonicFactor(5, slotsPerPolePerPhase, slotAngle, results.PitchFactor);
        results.Harmonics.SeventhOrder = CalculateHarmonicFactor(7, slotsPerPolePerPhase, slotAngle, results.PitchFactor);
        results.Harmonics.EleventhOrder = CalculateHarmonicFactor(11, slotsPerPolePerPhase, slotAngle, results.PitchFactor);
        results.Harmonics.ThirteenthOrder = CalculateHarmonicFactor(13, slotsPerPolePerPhase, slotAngle, results.PitchFactor);
        results.Harmonics.SeventeenthOrder = CalculateHarmonicFactor(17, slotsPerPolePerPhase, slotAngle, results.PitchFactor);
    }
    
    private double CalculateHarmonicFactor(int harmonicOrder, double slotsPerPolePerPhase, double slotAngle, double pitchFactor)
    {
        // Simplified harmonic factor calculation
        double alpha = slotAngle * harmonicOrder / 2;
        double distributionFactor = Math.Sin(slotsPerPolePerPhase * alpha / 2) / (slotsPerPolePerPhase * Math.Sin(alpha / 2));
        double harmonicPitchFactor = Math.Cos((harmonicOrder - 1) * Pi / (2 * harmonicOrder));
        
        return Math.Abs(distributionFactor * harmonicPitchFactor);
    }
    
    private string CalculateAWGSize(double wireSectionMm2)
    {
        // AWG conversion table (approximate)
        var awgTable = new Dictionary<double, string>
        {
            { 0.05, "30 AWG" }, { 0.08, "28 AWG" }, { 0.13, "26 AWG" }, { 0.20, "24 AWG" },
            { 0.32, "22 AWG" }, { 0.51, "20 AWG" }, { 0.82, "18 AWG" }, { 1.31, "16 AWG" },
            { 2.08, "14 AWG" }, { 3.31, "12 AWG" }, { 5.26, "10 AWG" }, { 8.37, "8 AWG" },
            { 13.3, "6 AWG" }, { 21.1, "4 AWG" }, { 33.6, "2 AWG" }, { 42.4, "1 AWG" },
            { 53.5, "1/0 AWG" }, { 67.4, "2/0 AWG" }, { 85.0, "3/0 AWG" }, { 107, "4/0 AWG" }
        };
        
        double closestSize = awgTable.Keys.OrderBy(x => Math.Abs(x - wireSectionMm2)).First();
        return awgTable[closestSize];
    }
    
    private void PerformFinalValidations(Motor motor, CalculationResults results)
    {
        // Check for motor oversizing/undersizing based on specific power
        if (results.SpecificPower < 50000)
            results.ValidationAlerts.Add(new ValidationAlert
            {
                Type = AlertType.Warning,
                Message = "Motor pode estar superdimensionado",
                Parameter = "SpecificPower"
            });
            
        if (results.SpecificPower > 600000)
            results.ValidationAlerts.Add(new ValidationAlert
            {
                Type = AlertType.Warning,
                Message = "Motor pode estar subdimensionado",
                Parameter = "SpecificPower"
            });
            
        // Check harmonic distortion
        double totalHarmonics = Math.Sqrt(
            Math.Pow(results.Harmonics.FifthOrder, 2) +
            Math.Pow(results.Harmonics.SeventhOrder, 2) +
            Math.Pow(results.Harmonics.EleventhOrder, 2) +
            Math.Pow(results.Harmonics.ThirteenthOrder, 2) +
            Math.Pow(results.Harmonics.SeventeenthOrder, 2)
        );
        
        if (totalHarmonics > 0.1) // 10% THD
            results.ValidationAlerts.Add(new ValidationAlert
            {
                Type = AlertType.Warning,
                Message = "Distorção harmônica elevada",
                Parameter = "Harmonics",
                CurrentValue = totalHarmonics * 100,
                RecommendedMax = 10
            });
    }
}