using FluentValidation;

namespace MotorCalculator.Application.Validators;

public class CalculateMotorCommandValidator : AbstractValidator<Commands.CalculateMotor.CalculateMotorCommand>
{
    public CalculateMotorCommandValidator()
    {
        RuleFor(x => x.Model)
            .NotEmpty()
            .WithMessage("Modelo do motor é obrigatório")
            .MaximumLength(100)
            .WithMessage("Modelo do motor não pode exceder 100 caracteres");
            
        RuleFor(x => x.PowerHP)
            .GreaterThan(0)
            .WithMessage("Potência deve ser maior que zero")
            .LessThanOrEqualTo(10000)
            .WithMessage("Potência não pode exceder 10.000 HP");
            
        RuleFor(x => x.PowerFactor)
            .GreaterThan(0)
            .WithMessage("Fator de potência deve ser maior que zero")
            .LessThanOrEqualTo(1)
            .WithMessage("Fator de potência não pode exceder 1.0");
            
        RuleFor(x => x.RPM)
            .GreaterThan(0)
            .WithMessage("RPM deve ser maior que zero")
            .LessThanOrEqualTo(36000)
            .WithMessage("RPM não pode exceder 36.000");
            
        RuleFor(x => x.Poles)
            .GreaterThan(0)
            .WithMessage("Número de pólos deve ser maior que zero")
            .Must(x => x % 2 == 0)
            .WithMessage("Número de pólos deve ser par")
            .LessThanOrEqualTo(100)
            .WithMessage("Número de pólos não pode exceder 100");
            
        RuleFor(x => x.Efficiency)
            .GreaterThan(0)
            .WithMessage("Rendimento deve ser maior que zero")
            .LessThanOrEqualTo(1.1)
            .WithMessage("Rendimento não pode exceder 110%");
            
        RuleFor(x => x.Frequency)
            .GreaterThan(0)
            .WithMessage("Frequência deve ser maior que zero")
            .LessThanOrEqualTo(400)
            .WithMessage("Frequência não pode exceder 400 Hz");
            
        RuleFor(x => x.VoltageDelta)
            .GreaterThan(0)
            .WithMessage("Tensão delta deve ser maior que zero")
            .LessThanOrEqualTo(50000)
            .WithMessage("Tensão delta não pode exceder 50 kV");
            
        RuleFor(x => x.VoltageStar)
            .GreaterThan(0)
            .WithMessage("Tensão estrela deve ser maior que zero")
            .LessThanOrEqualTo(50000)
            .WithMessage("Tensão estrela não pode exceder 50 kV");
            
        RuleFor(x => x.CurrentDelta)
            .GreaterThan(0)
            .WithMessage("Corrente delta deve ser maior que zero")
            .LessThanOrEqualTo(10000)
            .WithMessage("Corrente delta não pode exceder 10.000 A");
            
        RuleFor(x => x.CurrentStar)
            .GreaterThan(0)
            .WithMessage("Corrente estrela deve ser maior que zero")
            .LessThanOrEqualTo(10000)
            .WithMessage("Corrente estrela não pode exceder 10.000 A");
            
        // Core data validations
        RuleFor(x => x.SlotDepth)
            .GreaterThan(0)
            .WithMessage("Profundidade do canal deve ser maior que zero")
            .LessThanOrEqualTo(1)
            .WithMessage("Profundidade do canal não pode exceder 1 metro");
            
        RuleFor(x => x.CrownHeight)
            .GreaterThan(0)
            .WithMessage("Altura da coroa deve ser maior que zero")
            .LessThanOrEqualTo(1)
            .WithMessage("Altura da coroa não pode exceder 1 metro");
            
        RuleFor(x => x.StatorToothWidth)
            .GreaterThan(0)
            .WithMessage("Largura do dente deve ser maior que zero")
            .LessThanOrEqualTo(0.5)
            .WithMessage("Largura do dente não pode exceder 0.5 metro");
            
        RuleFor(x => x.NumberOfSlots)
            .GreaterThan(0)
            .WithMessage("Número de canais deve ser maior que zero")
            .LessThanOrEqualTo(1000)
            .WithMessage("Número de canais não pode exceder 1000");
            
        RuleFor(x => x.StackLength)
            .GreaterThan(0)
            .WithMessage("Comprimento do pacote deve ser maior que zero")
            .LessThanOrEqualTo(5)
            .WithMessage("Comprimento do pacote não pode exceder 5 metros");
            
        RuleFor(x => x.InternalDiameter)
            .GreaterThan(0)
            .WithMessage("Diâmetro interno deve ser maior que zero")
            .LessThanOrEqualTo(10)
            .WithMessage("Diâmetro interno não pode exceder 10 metros");
            
        // Cross-field validations (disabled for testing)
        /*
        RuleFor(x => x)
            .Must(x => x.VoltageStar == x.VoltageDelta / Math.Sqrt(3))
            .WithMessage("Relação entre tensões delta e estrela deve ser correta (V_delta = V_star * √3)")
            .When(x => x.VoltageDelta > 0 && x.VoltageStar > 0);
            
        RuleFor(x => x)
            .Must(x => Math.Abs(x.CurrentStar - x.CurrentDelta * Math.Sqrt(3)) < 0.01)
            .WithMessage("Relação entre correntes delta e estrela deve ser correta (I_star = I_delta * √3)")
            .When(x => x.CurrentDelta > 0 && x.CurrentStar > 0);
        */
    }
}