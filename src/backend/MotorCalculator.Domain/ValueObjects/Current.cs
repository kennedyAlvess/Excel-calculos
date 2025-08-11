namespace MotorCalculator.Domain.ValueObjects;

public class Current
{
    public double Value { get; set; }
    public string Unit { get; set; } = "A";
    
    public Current() { }
    
    public Current(double value)
    {
        Value = value;
    }
}