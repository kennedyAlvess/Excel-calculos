using MotorCalculator.Domain.Entities;
using MotorCalculator.Domain.ValueObjects;

namespace MotorCalculator.Application.Commands.CalculateMotor;

public class CalculateMotorCommand
{
    public string Model { get; set; } = string.Empty;
    public double PowerHP { get; set; }
    public double PowerFactor { get; set; }
    public double RPM { get; set; }
    public int Poles { get; set; }
    public double Efficiency { get; set; }
    public double Frequency { get; set; }
    
    // Voltage and Current for Delta/Star configurations
    public double VoltageDelta { get; set; }
    public double VoltageStar { get; set; }
    public double CurrentDelta { get; set; }
    public double CurrentStar { get; set; }
    
    // Core data
    public double SlotDepth { get; set; }
    public double CrownHeight { get; set; }
    public double StatorToothWidth { get; set; }
    public int NumberOfSlots { get; set; }
    public double StackLength { get; set; }
    public double InternalDiameter { get; set; }
    
    public Motor ToMotor()
    {
        return new Motor
        {
            Model = Model,
            PowerHP = PowerHP,
            PowerFactor = PowerFactor,
            RPM = RPM,
            Poles = Poles,
            Efficiency = Efficiency,
            Frequency = Frequency,
            VoltageDelta = new Voltage(VoltageDelta),
            VoltageStar = new Voltage(VoltageStar),
            CurrentDelta = new Current(CurrentDelta),
            CurrentStar = new Current(CurrentStar),
            CoreData = new CoreData
            {
                SlotDepth = SlotDepth,
                CrownHeight = CrownHeight,
                StatorToothWidth = StatorToothWidth,
                NumberOfSlots = NumberOfSlots,
                StackLength = StackLength,
                InternalDiameter = InternalDiameter
            }
        };
    }
}