namespace MotorCalculator.Domain.ValueObjects;

public readonly record struct Power
{
    public double Value { get; }
    public string Unit { get; }

    public Power(double value, string unit = "CV")
    {
        if (value < 0)
            throw new ArgumentException("Power cannot be negative", nameof(value));
        
        Value = value;
        Unit = unit;
    }

    public static implicit operator double(Power power) => power.Value;
    public static implicit operator Power(double value) => new(value);

    public double ToWatts() => Unit switch
    {
        "CV" => Value * 735.5, // CV to Watts
        "HP" => Value * 746,   // HP to Watts
        "kW" => Value * 1000,  // kW to Watts
        "W" => Value,          // Already in Watts
        _ => throw new InvalidOperationException($"Unknown power unit: {Unit}")
    };

    public override string ToString() => $"{Value:F2} {Unit}";
}