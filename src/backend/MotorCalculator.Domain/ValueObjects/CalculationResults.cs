namespace MotorCalculator.Domain.ValueObjects;

public class CalculationResults
{
    // Magnetic Flux calculations
    public double TotalFlux { get; set; }
    public double FluxPerPole { get; set; }
    
    // Magnetic Inductions
    public double AirGapInduction { get; set; }
    public double StatorToothInduction { get; set; }
    public double StatorCrownInduction { get; set; }
    
    // Harmonics (1st, 5th, 7th, 11th, 13th, 17th orders)
    public HarmonicsData Harmonics { get; set; } = new();
    
    // Winding factors
    public double WindingFactor { get; set; }
    public double PitchFactor { get; set; }
    public double DistributionFactor { get; set; }
    
    // Air gap area calculations
    public double AirGapArea { get; set; }
    
    // Turns per phase
    public double TurnsPerPhase { get; set; }
    
    // Resistance per phase
    public double ResistancePerPhase { get; set; }
    public double JouleLosses { get; set; }
    
    // Wire section calculations
    public double WireSection { get; set; }
    public double CurrentDensity { get; set; }
    public string AWGSize { get; set; } = string.Empty;
    
    // Specific power
    public double SpecificPower { get; set; }
    
    // Validation alerts
    public List<ValidationAlert> ValidationAlerts { get; set; } = new();
}

public class HarmonicsData
{
    public double FirstOrder { get; set; }
    public double FifthOrder { get; set; }
    public double SeventhOrder { get; set; }
    public double EleventhOrder { get; set; }
    public double ThirteenthOrder { get; set; }
    public double SeventeenthOrder { get; set; }
}

public class ValidationAlert
{
    public AlertType Type { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Parameter { get; set; } = string.Empty;
    public double CurrentValue { get; set; }
    public double RecommendedMin { get; set; }
    public double RecommendedMax { get; set; }
}

public enum AlertType
{
    Info,
    Warning,
    Critical
}