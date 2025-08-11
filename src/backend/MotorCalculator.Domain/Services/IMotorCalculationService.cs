using MotorCalculator.Domain.Entities;
using MotorCalculator.Domain.ValueObjects;

namespace MotorCalculator.Domain.Services;

public interface IMotorCalculationService
{
    /// <summary>
    /// Calculates the magnetic flux per pole
    /// </summary>
    double CalculateFluxPerPole(double totalFlux, int poles);
    
    /// <summary>
    /// Calculates air gap magnetic induction
    /// </summary>
    double CalculateAirGapInduction(double fluxPerPole, double airGapArea);
    
    /// <summary>
    /// Calculates tooth magnetic induction
    /// </summary>
    double CalculateToothInduction(double flux, double toothArea);
    
    /// <summary>
    /// Calculates yoke magnetic induction
    /// </summary>
    double CalculateYokeInduction(double flux, double yokeArea);
    
    /// <summary>
    /// Calculates harmonic content (5th, 7th, 11th, 13th, 17th)
    /// </summary>
    HarmonicResults CalculateHarmonics(Motor motor);
    
    /// <summary>
    /// Calculates winding factor
    /// </summary>
    double CalculateWindingFactor(double pitchFactor, double distributionFactor);
    
    /// <summary>
    /// Calculates induced voltage
    /// </summary>
    double CalculateInducedVoltage(double frequency, double turnsPerPhase, double fluxPerPole);
    
    /// <summary>
    /// Calculates specific power (power per unit weight)
    /// </summary>
    double CalculateSpecificPower(double powerCV, double diameter, double length);
    
    /// <summary>
    /// Performs complete motor calculations and updates the motor entity
    /// </summary>
    Task<Motor> PerformCompleteCalculation(Motor motor);
    
    /// <summary>
    /// Validates motor parameters against engineering limits
    /// </summary>
    bool ValidateMotorParameters(Motor motor, out List<string> validationErrors);
}