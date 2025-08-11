using MotorCalculator.Domain.ValueObjects;

namespace MotorCalculator.Domain.Entities;

public class Motor
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public Power PowerRating { get; private set; }
    public Voltage Voltage { get; private set; }
    public double Frequency { get; private set; } // Hz
    public int Poles { get; private set; }
    public double Efficiency { get; private set; } // 0.0 to 1.0
    public double PowerFactor { get; private set; } // 0.0 to 1.0
    public double CurrentDensity { get; private set; } // A/mm²
    
    // Geometric properties
    public double Diameter { get; private set; } // mm
    public double Length { get; private set; } // mm
    public double AirGapLength { get; private set; } // mm
    
    // Calculation results
    public double FluxPerPole { get; private set; } // Wb
    public Inductance AirGapInduction { get; private set; } // T
    public Inductance ToothInduction { get; private set; } // T
    public Inductance YokeInduction { get; private set; } // T
    public double WindingFactor { get; private set; }
    public double InducedVoltage { get; private set; } // V
    public double SpecificPower { get; private set; } // kW/kg
    
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public Motor(
        string name,
        Power powerRating,
        Voltage voltage,
        double frequency,
        int poles,
        double efficiency,
        double powerFactor,
        double currentDensity,
        double diameter,
        double length,
        double airGapLength)
    {
        Id = Guid.NewGuid();
        Name = name ?? throw new ArgumentNullException(nameof(name));
        PowerRating = powerRating;
        Voltage = voltage;
        Frequency = frequency;
        Poles = poles;
        Efficiency = efficiency;
        PowerFactor = powerFactor;
        CurrentDensity = currentDensity;
        Diameter = diameter;
        Length = length;
        AirGapLength = airGapLength;
        CreatedAt = DateTime.UtcNow;
        
        ValidateParameters();
    }

    private void ValidateParameters()
    {
        if (string.IsNullOrWhiteSpace(Name))
            throw new ArgumentException("Motor name cannot be empty", nameof(Name));
        
        if (Frequency <= 0)
            throw new ArgumentException("Frequency must be positive", nameof(Frequency));
        
        if (Poles <= 0 || Poles % 2 != 0)
            throw new ArgumentException("Poles must be a positive even number", nameof(Poles));
        
        if (Efficiency <= 0 || Efficiency > 1.05)
            throw new ArgumentException("Efficiency must be between 0 and 1.05", nameof(Efficiency));
        
        if (PowerFactor <= 0 || PowerFactor > 1)
            throw new ArgumentException("Power factor must be between 0 and 1", nameof(PowerFactor));
        
        if (CurrentDensity <= 0)
            throw new ArgumentException("Current density must be positive", nameof(CurrentDensity));
        
        if (Diameter <= 0)
            throw new ArgumentException("Diameter must be positive", nameof(Diameter));
        
        if (Length <= 0)
            throw new ArgumentException("Length must be positive", nameof(Length));
        
        if (AirGapLength <= 0)
            throw new ArgumentException("Air gap length must be positive", nameof(AirGapLength));
    }

    public void UpdateCalculationResults(
        double fluxPerPole,
        Inductance airGapInduction,
        Inductance toothInduction,
        Inductance yokeInduction,
        double windingFactor,
        double inducedVoltage,
        double specificPower)
    {
        FluxPerPole = fluxPerPole;
        AirGapInduction = airGapInduction;
        ToothInduction = toothInduction;
        YokeInduction = yokeInduction;
        WindingFactor = windingFactor;
        InducedVoltage = inducedVoltage;
        SpecificPower = specificPower;
        UpdatedAt = DateTime.UtcNow;
    }
}