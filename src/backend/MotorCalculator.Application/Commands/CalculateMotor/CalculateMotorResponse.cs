using MotorCalculator.Domain.ValueObjects;

namespace MotorCalculator.Application.Commands.CalculateMotor;

public class CalculateMotorResponse
{
    public bool Success { get; set; }
    public string? ErrorMessage { get; set; }
    public CalculationResults? Results { get; set; }
}