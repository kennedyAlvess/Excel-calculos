using MotorCalculator.Application.Common.DTOs;
using MotorCalculator.Domain.Entities;
using MotorCalculator.Domain.Services;
using MotorCalculator.Domain.ValueObjects;

namespace MotorCalculator.Application.Commands.CalculateMotor;

public class CalculateMotorHandler
{
    private readonly IMotorCalculationService _calculationService;

    public CalculateMotorHandler(IMotorCalculationService calculationService)
    {
        _calculationService = calculationService ?? throw new ArgumentNullException(nameof(calculationService));
    }

    public async Task<MotorCalculationResultDto> Handle(CalculateMotorCommand command)
    {
        var parameters = command.Parameters;
        
        // Create domain entity
        var motor = new Motor(
            parameters.Name,
            new Power(parameters.PowerRating, parameters.PowerUnit),
            new Voltage(parameters.Voltage),
            parameters.Frequency,
            parameters.Poles,
            parameters.Efficiency,
            parameters.PowerFactor,
            parameters.CurrentDensity,
            parameters.Diameter,
            parameters.Length,
            parameters.AirGapLength
        );

        // Validate parameters
        var isValid = _calculationService.ValidateMotorParameters(motor, out var validationErrors);

        // Perform calculations
        var calculatedMotor = await _calculationService.PerformCompleteCalculation(motor);
        var harmonics = _calculationService.CalculateHarmonics(calculatedMotor);

        // Map to DTO
        return new MotorCalculationResultDto
        {
            Id = calculatedMotor.Id,
            Name = calculatedMotor.Name,
            Parameters = parameters,
            FluxPerPole = calculatedMotor.FluxPerPole,
            AirGapInduction = calculatedMotor.AirGapInduction.Value,
            ToothInduction = calculatedMotor.ToothInduction.Value,
            YokeInduction = calculatedMotor.YokeInduction.Value,
            WindingFactor = calculatedMotor.WindingFactor,
            InducedVoltage = calculatedMotor.InducedVoltage,
            SpecificPower = calculatedMotor.SpecificPower,
            Harmonics = new HarmonicResultsDto
            {
                Fifth = harmonics.Fifth,
                Seventh = harmonics.Seventh,
                Eleventh = harmonics.Eleventh,
                Thirteenth = harmonics.Thirteenth,
                Seventeenth = harmonics.Seventeenth,
                TotalHarmonicDistortion = harmonics.TotalHarmonicDistortion
            },
            IsValid = isValid,
            ValidationErrors = validationErrors,
            CreatedAt = calculatedMotor.CreatedAt,
            UpdatedAt = calculatedMotor.UpdatedAt
        };
    }
}