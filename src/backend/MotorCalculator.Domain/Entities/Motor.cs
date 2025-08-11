using MotorCalculator.Domain.ValueObjects;

namespace MotorCalculator.Domain.Entities;

public class Motor
{
    public string Model { get; set; } = string.Empty;
    public double PowerHP { get; set; }
    public double PowerFactor { get; set; }
    public double RPM { get; set; }
    public int Poles { get; set; }
    public double Efficiency { get; set; }
    public double Frequency { get; set; }
    
    // Voltage and Current for Delta/Star configurations
    public Voltage VoltageDelta { get; set; } = new();
    public Voltage VoltageStar { get; set; } = new();
    public Current CurrentDelta { get; set; } = new();
    public Current CurrentStar { get; set; } = new();
    
    // Core data
    public CoreData CoreData { get; set; } = new();
    
    // Calculated values - populated by MotorCalculationService
    public CalculationResults? Results { get; set; }
}
