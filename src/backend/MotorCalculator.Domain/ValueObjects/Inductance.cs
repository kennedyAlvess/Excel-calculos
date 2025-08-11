namespace MotorCalculator.Domain.ValueObjects;

public readonly record struct Inductance
{
    public double Value { get; }
    public string Unit { get; }

    public Inductance(double value, string unit = "T")
    {
        if (value < 0)
            throw new ArgumentException("Inductance cannot be negative", nameof(value));
        
        Value = value;
        Unit = unit;
    }

    public static implicit operator double(Inductance inductance) => inductance.Value;
    public static implicit operator Inductance(double value) => new(value);

    public override string ToString() => $"{Value:F4} {Unit}";
}