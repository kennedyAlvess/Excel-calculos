namespace MotorCalculator.Domain.ValueObjects;

public class HarmonicResults
{
    public double Fifth { get; set; }      // 5th harmonic
    public double Seventh { get; set; }    // 7th harmonic
    public double Eleventh { get; set; }   // 11th harmonic
    public double Thirteenth { get; set; } // 13th harmonic
    public double Seventeenth { get; set; } // 17th harmonic
    
    public double TotalHarmonicDistortion => 
        Math.Sqrt(Math.Pow(Fifth, 2) + Math.Pow(Seventh, 2) + Math.Pow(Eleventh, 2) + 
                  Math.Pow(Thirteenth, 2) + Math.Pow(Seventeenth, 2));

    public HarmonicResults()
    {
    }

    public HarmonicResults(double fifth, double seventh, double eleventh, double thirteenth, double seventeenth)
    {
        Fifth = fifth;
        Seventh = seventh;
        Eleventh = eleventh;
        Thirteenth = thirteenth;
        Seventeenth = seventeenth;
    }
}