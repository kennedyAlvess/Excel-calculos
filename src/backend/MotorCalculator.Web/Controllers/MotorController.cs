using Microsoft.AspNetCore.Mvc;
using MotorCalculator.Application.Commands.CalculateMotor;
using MotorCalculator.Application.Validators;
using FluentValidation;

namespace MotorCalculator.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MotorController : ControllerBase
{
    private readonly CalculateMotorHandler _calculateMotorHandler;
    private readonly IValidator<CalculateMotorCommand> _validator;
    
    public MotorController(
        CalculateMotorHandler calculateMotorHandler,
        IValidator<CalculateMotorCommand> validator)
    {
        _calculateMotorHandler = calculateMotorHandler;
        _validator = validator;
    }
    
    /// <summary>
    /// Calcula os parâmetros de um motor trifásico
    /// </summary>
    /// <param name="command">Dados de entrada do motor</param>
    /// <returns>Resultados dos cálculos do motor</returns>
    [HttpPost("calculate")]
    public async Task<ActionResult<CalculateMotorResponse>> CalculateMotor([FromBody] CalculateMotorCommand command)
    {
        // Validate input
        var validationResult = await _validator.ValidateAsync(command);
        if (!validationResult.IsValid)
        {
            return BadRequest(new
            {
                errors = validationResult.Errors.Select(e => new
                {
                    property = e.PropertyName,
                    message = e.ErrorMessage,
                    attemptedValue = e.AttemptedValue
                })
            });
        }
        
        // Process calculation
        var response = await _calculateMotorHandler.Handle(command);
        
        if (!response.Success)
        {
            return BadRequest(new { error = response.ErrorMessage });
        }
        
        return Ok(response);
    }
    
    /// <summary>
    /// Obtém informações sobre os ranges válidos para cada parâmetro
    /// </summary>
    [HttpGet("validation-ranges")]
    public ActionResult GetValidationRanges()
    {
        return Ok(new
        {
            powerHP = new { min = 0.1, max = 10000, unit = "HP" },
            powerFactor = new { min = 0.1, max = 1.0, unit = "" },
            rpm = new { min = 1, max = 36000, unit = "RPM" },
            poles = new { min = 2, max = 100, unit = "", note = "Deve ser par" },
            efficiency = new { min = 0.1, max = 1.1, unit = "%" },
            frequency = new { min = 1, max = 400, unit = "Hz" },
            voltage = new { min = 1, max = 50000, unit = "V" },
            current = new { min = 0.1, max = 10000, unit = "A" },
            coreData = new
            {
                slotDepth = new { min = 0.001, max = 1.0, unit = "m" },
                crownHeight = new { min = 0.001, max = 1.0, unit = "m" },
                statorToothWidth = new { min = 0.001, max = 0.5, unit = "m" },
                numberOfSlots = new { min = 1, max = 1000, unit = "" },
                stackLength = new { min = 0.001, max = 5.0, unit = "m" },
                internalDiameter = new { min = 0.001, max = 10.0, unit = "m" }
            }
        });
    }
    
    /// <summary>
    /// Healthcheck endpoint
    /// </summary>
    [HttpGet("health")]
    public ActionResult HealthCheck()
    {
        return Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
    }
}