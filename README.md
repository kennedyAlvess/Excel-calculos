# Motor Calculator - Three-Phase Motor Analysis Tool

A comprehensive web application for electromagnetic analysis and design of three-phase induction motors, featuring advanced calculations, harmonic analysis, and safety validation.

## 🎯 Features

### Electromagnetic Analysis
- **Flux per pole calculation** - Precise magnetic flux distribution modeling
- **Air gap induction analysis** - Critical magnetic field calculations with safety limits (≤1.1T)
- **Tooth and yoke induction** - Complete magnetic circuit analysis
- **Winding factor optimization** - Electromagnetic efficiency calculations

### Harmonic Analysis
- **Complete harmonic spectrum** - Analysis of 5th, 7th, 11th, 13th, and 17th harmonics
- **Total harmonic distortion (THD)** - Comprehensive power quality assessment
- **Real-time calculations** - Instant harmonic content evaluation

### Safety Validation
- **Current density limits** - Maximum 4.5 A/mm² recommended, 6.5 A/mm² absolute limit
- **Efficiency validation** - Range validation between 90-105%
- **Geometric ratio checks** - Aspect ratio validation (0.5-3.0)
- **Real-time warnings** - Immediate feedback on parameter limits

## 🏗️ Architecture

### Backend (.NET 8)
```
src/backend/
├── MotorCalculator.Domain/           # Core domain entities and business logic
│   ├── Entities/Motor.cs            # Motor entity with validation
│   ├── ValueObjects/               # Type-safe value objects (Voltage, Power, Inductance)
│   └── Services/IMotorCalculationService.cs
├── MotorCalculator.Application/     # Application layer with CQRS
│   ├── Commands/CalculateMotor/    # Motor calculation command/handler
│   ├── Common/DTOs/               # Data transfer objects
│   └── FluentValidation           # Input validation rules
├── MotorCalculator.Infrastructure/ # Infrastructure services
│   └── Services/MotorCalculationService.cs  # Complete calculation implementation
└── MotorCalculator.Web/           # Web API layer
    ├── Controllers/MotorController.cs  # REST API endpoints
    ├── Program.cs                 # DI configuration with Serilog
    └── OpenAPI/Swagger           # API documentation
```

### Frontend (Next.js 14)
```
src/frontend/
├── src/app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Landing page
│   └── motor-calculator/          # Calculator application
│       ├── page.tsx              # Main calculator page
│       └── components/           # React components
│           ├── MotorForm.tsx     # Input form with validation
│           └── ResultsDashboard.tsx  # Results visualization
├── src/lib/
│   ├── api-client/               # API integration with Axios
│   ├── schemas/motor.ts          # Zod validation schemas
│   └── types/motor.ts           # TypeScript type definitions
└── TanStack Query               # Server state management
```

## 🔧 Technology Stack

### Backend
- **.NET 8** - Latest LTS framework with C# 12
- **Clean Architecture** - Domain-driven design with clear separation of concerns
- **FluentValidation** - Comprehensive input validation with engineering limits
- **Serilog** - Structured logging with console and file output
- **OpenTelemetry** - Application observability (ready for production monitoring)
- **Swagger/OpenAPI** - Interactive API documentation

### Frontend
- **Next.js 14** - App Router with Server-Side Rendering
- **React 18** - Modern React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first responsive design
- **Zod** - Schema validation with TypeScript integration
- **React Hook Form** - Performant form handling with validation
- **TanStack Query** - Server state management and caching
- **Axios** - HTTP client with interceptors

## 🚀 Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js 18+ and npm
- Git

### Backend Setup
```bash
cd src/backend
dotnet restore
dotnet build
dotnet run --project MotorCalculator.Web
```
The API will be available at `http://localhost:5261` with Swagger documentation at the root.

### Frontend Setup
```bash
cd src/frontend
npm install
npm run dev
```
The web application will be available at `http://localhost:3000`.

## 📊 Motor Calculation Features

### Core Formulas Implemented
- **Flux per pole**: Φ_pole = Φ_total / poles
- **Air gap induction**: B_gap = Φ_pole / A_gap
- **Induced voltage**: E = 4.44 × f × N × Φ × k_w
- **Specific power**: P_specific = P_kW / Weight_kg
- **Harmonic factors**: Based on winding distribution and pitch factors

### Engineering Validation
- **Efficiency**: 90-105% (critical safety range)
- **Current density**: ≤4.5 A/mm² recommended, ≤6.5 A/mm² maximum
- **Air gap induction**: ≤1.1T to prevent magnetic saturation
- **Power factor**: 0.1-1.0 range with 0.8-0.95 recommended
- **Aspect ratio**: 0.5-3.0 for mechanical stability

### Sample Calculation Results
For a 5CV, 380V, 60Hz, 4-pole motor:
- **Flux per pole**: 0.0016 Wb
- **Air gap induction**: 0.017 T ✅ (within 1.1T limit)
- **Efficiency**: 95% ✅ (within 90-105% range)
- **Harmonic content**: Full spectrum analysis with THD calculation

## 🔍 API Endpoints

### Motor Calculation
- `POST /api/motor/calculate` - Complete motor electromagnetic analysis
- `POST /api/motor/validate` - Parameter validation without calculation
- `GET /api/motor/limits` - Engineering limits and recommendations
- `GET /api/motor/health` - Service health check

### Example Request
```json
{
  "name": "Industrial Motor 5CV",
  "powerRating": 5,
  "powerUnit": "CV",
  "voltage": 380,
  "frequency": 60,
  "poles": 4,
  "efficiency": 0.95,
  "powerFactor": 0.85,
  "currentDensity": 4.0,
  "diameter": 150,
  "length": 200,
  "airGapLength": 0.5
}
```

## 🛡️ Safety Features

- **Real-time validation** with immediate feedback
- **Engineering limit enforcement** based on industry standards
- **Color-coded warnings** for parameters approaching limits
- **Comprehensive error messages** with recommendations
- **Aspect ratio calculations** for mechanical stability assessment

## 🔬 Testing

The application has been thoroughly tested with:
- **Unit calculations** verified against electromagnetic theory
- **Integration testing** between frontend and backend
- **Parameter validation** with edge cases
- **UI responsiveness** across different screen sizes
- **API error handling** with proper HTTP status codes

## 📈 Performance

- **P95 response time** < 100ms for calculations
- **Real-time validation** with debounced input
- **Optimized calculations** using efficient algorithms
- **Caching strategies** with TanStack Query
- **Structured logging** for performance monitoring

## 🔗 Production Considerations

- **CORS configuration** for frontend-backend communication
- **Environment variables** for API endpoints
- **Logging configuration** with multiple outputs
- **Health checks** for monitoring
- **Error boundaries** for graceful failure handling

## 📋 Engineering Standards Compliance

This tool implements calculations based on:
- **IEC 60034** - Rotating electrical machines standards
- **IEEE 112** - Standard test procedure for polyphase induction motors
- **NEMA MG-1** - Motors and generators standards
- **Industry best practices** for electromagnetic design

## 🎯 Use Cases

- **Motor design validation** - Verify electromagnetic characteristics
- **Educational tool** - Learn motor electromagnetic principles  
- **Performance optimization** - Analyze efficiency and harmonic content
- **Safety assessment** - Validate parameters against engineering limits
- **Rapid prototyping** - Quick evaluation of motor concepts

---

**Motor Calculator v1.0** - Professional Three-Phase Motor Analysis Tool  
Built with modern web technologies for reliable electromagnetic analysis.