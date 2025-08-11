using MotorCalculator.Domain.Services;
using MotorCalculator.Application.Commands.CalculateMotor;
using MotorCalculator.Application.Validators;
using FluentValidation;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { 
        Title = "Motor Calculator API", 
        Version = "v1",
        Description = "API para cálculo de motores trifásicos baseada na planilha Excel Premium 2.0" 
    });
});

// Register domain services
builder.Services.AddScoped<MotorCalculationService>();

// Register application services
builder.Services.AddScoped<CalculateMotorHandler>();

// Register validators
builder.Services.AddScoped<IValidator<CalculateMotorCommand>, CalculateMotorCommandValidator>();

// Add CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Motor Calculator API v1");
        c.RoutePrefix = string.Empty; // Serve Swagger UI at root
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
