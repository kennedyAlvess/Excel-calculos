namespace MotorCalculator.Domain.ValueObjects;

public readonly record struct Voltage
{
    public double Value { get; }
    public string Unit { get; }

    public Voltage(double value, string unit = "V")
    {
        if (value < 0)
            throw new ArgumentException("Voltage cannot be negative", nameof(value));
        
        Value = value;
        Unit = unit;
    }

    public static implicit operator double(Voltage voltage) => voltage.Value;
    public static implicit operator Voltage(double value) => new(value);

    public override string ToString() => $"{Value:F2} {Unit}";
}