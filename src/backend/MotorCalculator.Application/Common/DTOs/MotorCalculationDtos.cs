namespace MotorCalculator.Application.Common.DTOs;

public class MotorParametersDto
{
    public string Name { get; set; } = string.Empty;
    public double PowerRating { get; set; }
    public string PowerUnit { get; set; } = "CV";
    public double Voltage { get; set; }
    public double Frequency { get; set; }
    public int Poles { get; set; }
    public double Efficiency { get; set; }
    public double PowerFactor { get; set; }
    public double CurrentDensity { get; set; }
    public double Diameter { get; set; }
    public double Length { get; set; }
    public double AirGapLength { get; set; }
}

public class MotorCalculationResultDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public MotorParametersDto Parameters { get; set; } = new();
    
    // Calculation Results
    public double FluxPerPole { get; set; }
    public double AirGapInduction { get; set; }
    public double ToothInduction { get; set; }
    public double YokeInduction { get; set; }
    public double WindingFactor { get; set; }
    public double InducedVoltage { get; set; }
    public double SpecificPower { get; set; }
    
    // Harmonics
    public HarmonicResultsDto Harmonics { get; set; } = new();
    
    // Validation
    public bool IsValid { get; set; }
    public List<string> ValidationErrors { get; set; } = new();
    
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class HarmonicResultsDto
{
    public double Fifth { get; set; }
    public double Seventh { get; set; }
    public double Eleventh { get; set; }
    public double Thirteenth { get; set; }
    public double Seventeenth { get; set; }
    public double TotalHarmonicDistortion { get; set; }
}