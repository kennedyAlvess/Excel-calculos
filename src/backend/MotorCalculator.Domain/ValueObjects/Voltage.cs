namespace MotorCalculator.Domain.ValueObjects;

public class Voltage
{
    public double Value { get; set; }
    public string Unit { get; set; } = "V";
    
    public Voltage() { }
    
    public Voltage(double value)
    {
        Value = value;
    }
}