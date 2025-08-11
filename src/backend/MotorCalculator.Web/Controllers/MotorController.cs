using Microsoft.AspNetCore.Mvc;
using MotorCalculator.Application.Commands.CalculateMotor;
using MotorCalculator.Application.Common.DTOs;
using FluentValidation;

namespace MotorCalculator.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class MotorController : ControllerBase
{
    private readonly CalculateMotorHandler _calculateMotorHandler;
    private readonly IValidator<CalculateMotorCommand> _validator;
    private readonly ILogger<MotorController> _logger;

    public MotorController(
        CalculateMotorHandler calculateMotorHandler,
        IValidator<CalculateMotorCommand> validator,
        ILogger<MotorController> logger)
    {
        _calculateMotorHandler = calculateMotorHandler ?? throw new ArgumentNullException(nameof(calculateMotorHandler));
        _validator = validator ?? throw new ArgumentNullException(nameof(validator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Calculates motor parameters and returns detailed results
    /// </summary>
    /// <param name="parameters">Motor input parameters</param>
    /// <returns>Complete motor calculation results including harmonics and validations</returns>
    [HttpPost("calculate")]
    [ProducesResponseType(typeof(MotorCalculationResultDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MotorCalculationResultDto>> CalculateMotor([FromBody] MotorParametersDto parameters)
    {
        try
        {
            _logger.LogInformation("Starting motor calculation for motor: {MotorName}", parameters.Name);

            var command = new CalculateMotorCommand { Parameters = parameters };
            
            // Validate command
            var validationResult = await _validator.ValidateAsync(command);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Motor calculation validation failed for motor: {MotorName}. Errors: {Errors}", 
                    parameters.Name, string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)));
                
                var problemDetails = new ValidationProblemDetails();
                foreach (var error in validationResult.Errors)
                {
                    problemDetails.Errors.Add(error.PropertyName, new[] { error.ErrorMessage });
                }
                
                return BadRequest(problemDetails);
            }

            // Execute calculation
            var result = await _calculateMotorHandler.Handle(command);
            
            _logger.LogInformation("Motor calculation completed successfully for motor: {MotorName}. Valid: {IsValid}", 
                parameters.Name, result.IsValid);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred during motor calculation for motor: {MotorName}", parameters.Name);
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred during motor calculation");
        }
    }

    /// <summary>
    /// Validates motor parameters without performing calculations
    /// </summary>
    /// <param name="parameters">Motor input parameters</param>
    /// <returns>Validation results</returns>
    [HttpPost("validate")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> ValidateMotorParameters([FromBody] MotorParametersDto parameters)
    {
        try
        {
            var command = new CalculateMotorCommand { Parameters = parameters };
            var validationResult = await _validator.ValidateAsync(command);

            if (!validationResult.IsValid)
            {
                var problemDetails = new ValidationProblemDetails();
                foreach (var error in validationResult.Errors)
                {
                    problemDetails.Errors.Add(error.PropertyName, new[] { error.ErrorMessage });
                }
                
                return BadRequest(problemDetails);
            }

            return Ok(new { IsValid = true, Message = "Motor parameters are valid" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred during motor validation for motor: {MotorName}", parameters.Name);
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred during validation");
        }
    }

    /// <summary>
    /// Returns motor calculation limits and recommendations
    /// </summary>
    /// <returns>Engineering limits and recommended ranges</returns>
    [HttpGet("limits")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public ActionResult GetMotorLimits()
    {
        var limits = new
        {
            Efficiency = new { Min = 0.90, Max = 1.05, Recommended = new { Min = 0.92, Max = 0.98 } },
            CurrentDensity = new { Max = 6.5, Recommended = 4.5, Unit = "A/mm²" },
            AirGapInduction = new { Max = 1.1, Recommended = 0.8, Unit = "T" },
            PowerFactor = new { Min = 0.1, Max = 1.0, Recommended = new { Min = 0.8, Max = 0.95 } },
            AspectRatio = new { Min = 0.5, Max = 3.0, Unit = "Length/Diameter" },
            Frequency = new { Min = 1, Max = 400, Common = new[] { 50, 60 }, Unit = "Hz" },
            Poles = new { Min = 2, Max = 100, Common = new[] { 2, 4, 6, 8 }, Note = "Must be even" }
        };

        return Ok(limits);
    }

    /// <summary>
    /// Health check endpoint
    /// </summary>
    /// <returns>Service health status</returns>
    [HttpGet("health")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public ActionResult GetHealth()
    {
        return Ok(new
        {
            Status = "Healthy",
            Service = "Motor Calculator API",
            Timestamp = DateTime.UtcNow,
            Version = "1.0.0"
        });
    }
}