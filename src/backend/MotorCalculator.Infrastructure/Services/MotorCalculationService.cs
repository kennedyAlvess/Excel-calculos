using MotorCalculator.Domain.Entities;
using MotorCalculator.Domain.Services;
using MotorCalculator.Domain.ValueObjects;

namespace MotorCalculator.Infrastructure.Services;

public class MotorCalculationService : IMotorCalculationService
{
    public double CalculateFluxPerPole(double totalFlux, int poles)
    {
        if (poles <= 0) throw new ArgumentException("Poles must be positive", nameof(poles));
        return totalFlux / poles;
    }

    public double CalculateAirGapInduction(double fluxPerPole, double airGapArea)
    {
        if (airGapArea <= 0) throw new ArgumentException("Air gap area must be positive", nameof(airGapArea));
        return fluxPerPole / airGapArea;
    }

    public double CalculateToothInduction(double flux, double toothArea)
    {
        if (toothArea <= 0) throw new ArgumentException("Tooth area must be positive", nameof(toothArea));
        return flux / toothArea;
    }

    public double CalculateYokeInduction(double flux, double yokeArea)
    {
        if (yokeArea <= 0) throw new ArgumentException("Yoke area must be positive", nameof(yokeArea));
        return flux / (2 * yokeArea); // Yoke carries half the flux
    }

    public HarmonicResults CalculateHarmonics(Motor motor)
    {
        // Simplified harmonic calculation based on motor parameters
        // In real implementation, this would be based on complex electromagnetic analysis
        
        var slotsPerPole = 3; // Typical for 3-phase motor
        var windingPitch = 0.8; // Typical short pitch
        
        // Calculate harmonic factors based on winding distribution
        var fifth = CalculateHarmonicFactor(5, slotsPerPole, windingPitch);
        var seventh = CalculateHarmonicFactor(7, slotsPerPole, windingPitch);
        var eleventh = CalculateHarmonicFactor(11, slotsPerPole, windingPitch);
        var thirteenth = CalculateHarmonicFactor(13, slotsPerPole, windingPitch);
        var seventeenth = CalculateHarmonicFactor(17, slotsPerPole, windingPitch);

        return new HarmonicResults(fifth, seventh, eleventh, thirteenth, seventeenth);
    }

    private double CalculateHarmonicFactor(int harmonicOrder, int slotsPerPole, double windingPitch)
    {
        // Simplified harmonic factor calculation
        var distributionFactor = Math.Sin(Math.PI / (2 * harmonicOrder)) / (slotsPerPole * Math.Sin(Math.PI / (2 * harmonicOrder * slotsPerPole)));
        var pitchFactor = Math.Sin(harmonicOrder * Math.PI * windingPitch / 2);
        
        return Math.Abs(distributionFactor * pitchFactor);
    }

    public double CalculateWindingFactor(double pitchFactor, double distributionFactor)
    {
        return pitchFactor * distributionFactor;
    }

    public double CalculateInducedVoltage(double frequency, double turnsPerPhase, double fluxPerPole)
    {
        // EMF = 4.44 * f * N * Φ * kw (simplified formula)
        const double windingFactor = 0.9; // Typical value
        return 4.44 * frequency * turnsPerPhase * fluxPerPole * windingFactor;
    }

    public double CalculateSpecificPower(double powerCV, double diameter, double length)
    {
        // Convert CV to kW
        var powerKW = powerCV * 0.7355;
        
        // Estimate motor weight based on dimensions (simplified)
        var volume = Math.PI * Math.Pow(diameter / 2000, 2) * (length / 1000); // m³
        var density = 7800; // kg/m³ (steel density)
        var estimatedWeight = volume * density;
        
        if (estimatedWeight <= 0) return 0;
        
        return powerKW / estimatedWeight;
    }

    public async Task<Motor> PerformCompleteCalculation(Motor motor)
    {
        // Calculate flux per pole based on power and voltage
        var powerWatts = motor.PowerRating.ToWatts();
        var synchronousSpeed = 120 * motor.Frequency / motor.Poles; // RPM
        var torque = powerWatts * 60 / (2 * Math.PI * synchronousSpeed); // Nm
        
        // Estimate air gap area (simplified)
        var airGapRadius = motor.Diameter / 2000; // m
        var airGapArea = 2 * Math.PI * airGapRadius * (motor.Length / 1000); // m²
        
        // Calculate magnetic flux
        var fluxPerPole = CalculateFluxDensityFromPower(powerWatts, motor.Frequency, motor.Poles);
        
        // Calculate inductions
        var airGapInduction = CalculateAirGapInduction(fluxPerPole, airGapArea);
        var toothInduction = CalculateToothInduction(fluxPerPole, airGapArea * 0.7); // Approximate tooth area
        var yokeInduction = CalculateYokeInduction(fluxPerPole, airGapArea * 0.3); // Approximate yoke area
        
        // Calculate winding factor (simplified)
        var windingFactor = CalculateWindingFactor(0.966, 0.956); // Typical values
        
        // Calculate induced voltage
        var turnsPerPhase = EstimateTurnsPerPhase(motor.Voltage.Value, motor.Frequency, fluxPerPole);
        var inducedVoltage = CalculateInducedVoltage(motor.Frequency, turnsPerPhase, fluxPerPole);
        
        // Calculate specific power
        var specificPower = CalculateSpecificPower(motor.PowerRating.Value, motor.Diameter, motor.Length);
        
        // Update motor with calculation results
        motor.UpdateCalculationResults(
            fluxPerPole,
            new Inductance(airGapInduction),
            new Inductance(toothInduction),
            new Inductance(yokeInduction),
            windingFactor,
            inducedVoltage,
            specificPower
        );

        return await Task.FromResult(motor);
    }

    private double CalculateFluxDensityFromPower(double powerWatts, double frequency, int poles)
    {
        // Simplified flux calculation based on power
        // This is a rough approximation - real calculation would be much more complex
        var basePower = 1000; // 1kW reference
        var baseFlux = 0.001; // 1mWb reference
        
        return baseFlux * Math.Sqrt(powerWatts / basePower) * (50 / frequency) * (4.0 / poles);
    }

    private double EstimateTurnsPerPhase(double voltage, double frequency, double fluxPerPole)
    {
        // Simplified turns estimation
        const double windingFactor = 0.9;
        return voltage / (4.44 * frequency * fluxPerPole * windingFactor);
    }

    public bool ValidateMotorParameters(Motor motor, out List<string> validationErrors)
    {
        validationErrors = new List<string>();

        // Critical validation: Air gap induction should not exceed 1.1T
        if (motor.AirGapInduction.Value > 1.1)
        {
            validationErrors.Add("Air gap induction exceeds 1.1T - magnetic saturation risk");
        }

        // Critical validation: Current density recommendation
        if (motor.CurrentDensity > 4.5)
        {
            validationErrors.Add("Current density above 4.5 A/mm² - consider increasing conductor area");
        }

        if (motor.CurrentDensity > 6.5)
        {
            validationErrors.Add("Current density exceeds 6.5 A/mm² - unsafe operating condition");
        }

        // Efficiency validation
        if (motor.Efficiency < 0.90)
        {
            validationErrors.Add("Efficiency below 90% - design optimization needed");
        }

        if (motor.Efficiency > 1.05)
        {
            validationErrors.Add("Efficiency above 105% - physically impossible");
        }

        // Power factor validation
        if (motor.PowerFactor < 0.8)
        {
            validationErrors.Add("Power factor below 0.8 - consider power factor correction");
        }

        // Geometric validations
        var aspectRatio = motor.Length / motor.Diameter;
        if (aspectRatio > 3.0)
        {
            validationErrors.Add("Length/Diameter ratio > 3.0 - mechanical stability concerns");
        }

        if (aspectRatio < 0.5)
        {
            validationErrors.Add("Length/Diameter ratio < 0.5 - inefficient magnetic circuit");
        }

        return validationErrors.Count == 0;
    }
}