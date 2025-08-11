using FluentValidation;

namespace MotorCalculator.Application.Commands.CalculateMotor;

public class CalculateMotorValidator : AbstractValidator<CalculateMotorCommand>
{
    public CalculateMotorValidator()
    {
        RuleFor(x => x.Parameters.Name)
            .NotEmpty()
            .WithMessage("Motor name is required")
            .MaximumLength(100)
            .WithMessage("Motor name cannot exceed 100 characters");

        RuleFor(x => x.Parameters.PowerRating)
            .GreaterThan(0)
            .WithMessage("Power rating must be positive")
            .LessThanOrEqualTo(10000)
            .WithMessage("Power rating cannot exceed 10000 CV");

        RuleFor(x => x.Parameters.Voltage)
            .GreaterThan(0)
            .WithMessage("Voltage must be positive")
            .LessThanOrEqualTo(50000)
            .WithMessage("Voltage cannot exceed 50kV");

        RuleFor(x => x.Parameters.Frequency)
            .GreaterThan(0)
            .WithMessage("Frequency must be positive")
            .LessThanOrEqualTo(400)
            .WithMessage("Frequency cannot exceed 400 Hz");

        RuleFor(x => x.Parameters.Poles)
            .GreaterThan(0)
            .WithMessage("Number of poles must be positive")
            .Must(BeEvenNumber)
            .WithMessage("Number of poles must be even")
            .LessThanOrEqualTo(100)
            .WithMessage("Number of poles cannot exceed 100");

        // Critical validation: Efficiency 90-105%
        RuleFor(x => x.Parameters.Efficiency)
            .InclusiveBetween(0.90, 1.05)
            .WithMessage("Efficiency must be between 90-105%");

        RuleFor(x => x.Parameters.PowerFactor)
            .InclusiveBetween(0.1, 1.0)
            .WithMessage("Power factor must be between 0.1 and 1.0");

        // Critical validation: Current density recommendation
        RuleFor(x => x.Parameters.CurrentDensity)
            .GreaterThan(0)
            .WithMessage("Current density must be positive")
            .LessThanOrEqualTo(6.5)
            .WithMessage("Current density should not exceed 6.5 A/mm² for safety")
            .LessThanOrEqualTo(4.5)
            .WithMessage("Current density above 4.5 A/mm² is not recommended")
            .WithSeverity(Severity.Warning);

        RuleFor(x => x.Parameters.Diameter)
            .GreaterThan(0)
            .WithMessage("Diameter must be positive")
            .LessThanOrEqualTo(5000)
            .WithMessage("Diameter cannot exceed 5000 mm");

        RuleFor(x => x.Parameters.Length)
            .GreaterThan(0)
            .WithMessage("Length must be positive")
            .LessThanOrEqualTo(10000)
            .WithMessage("Length cannot exceed 10000 mm");

        RuleFor(x => x.Parameters.AirGapLength)
            .GreaterThan(0)
            .WithMessage("Air gap length must be positive")
            .LessThanOrEqualTo(50)
            .WithMessage("Air gap length cannot exceed 50 mm");
    }

    private static bool BeEvenNumber(int poles)
    {
        return poles % 2 == 0;
    }
}