namespace MotorCalculator.Domain.ValueObjects;

public class CoreData
{
    /// <summary>
    /// Profundidade do canal (h)
    /// </summary>
    public double SlotDepth { get; set; }
    
    /// <summary>
    /// Altura da coroa (hc)
    /// </summary>
    public double CrownHeight { get; set; }
    
    /// <summary>
    /// Largura do dente do estator (bd)
    /// </summary>
    public double StatorToothWidth { get; set; }
    
    /// <summary>
    /// Número de canais (N)
    /// </summary>
    public int NumberOfSlots { get; set; }
    
    /// <summary>
    /// Comprimento do pacote (L)
    /// </summary>
    public double StackLength { get; set; }
    
    /// <summary>
    /// Diâmetro interno (D)
    /// </summary>
    public double InternalDiameter { get; set; }
}