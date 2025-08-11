using MotorCalculator.Application.Common.DTOs;

namespace MotorCalculator.Application.Commands.CalculateMotor;

public class CalculateMotorCommand
{
    public MotorParametersDto Parameters { get; set; } = new();
}