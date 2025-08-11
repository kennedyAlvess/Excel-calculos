using MotorCalculator.Domain.Services;

namespace MotorCalculator.Application.Commands.CalculateMotor;

public class CalculateMotorHandler
{
    private readonly MotorCalculationService _calculationService;
    
    public CalculateMotorHandler(MotorCalculationService calculationService)
    {
        _calculationService = calculationService;
    }
    
    public async Task<CalculateMotorResponse> Handle(CalculateMotorCommand command)
    {
        try
        {
            var motor = command.ToMotor();
            var results = _calculationService.CalculateMotor(motor);
            
            return new CalculateMotorResponse
            {
                Success = true,
                Results = results
            };
        }
        catch (Exception ex)
        {
            return new CalculateMotorResponse
            {
                Success = false,
                ErrorMessage = ex.Message
            };
        }
    }
}