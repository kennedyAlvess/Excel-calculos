'use client';

import { CalculationResults } from '@/types';

interface ResultsDashboardProps {
  results: CalculationResults;
}

export default function ResultsDashboard({ results }: ResultsDashboardProps) {
  const formatNumber = (num: number, decimals: number = 3) => {
    return num.toFixed(decimals);
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'Critical':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'Warning':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'Info':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Validation Alerts */}
      {results.validationAlerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Alertas e Validações
          </h3>
          <div className="space-y-3">
            {results.validationAlerts.map((alert, index) => (
              <div
                key={index}
                className={`p-3 rounded-md border ${getAlertColor(alert.type)}`}
              >
                <div className="font-medium">{alert.message}</div>
                {alert.currentValue !== undefined && (
                  <div className="text-sm mt-1">
                    Valor atual: {formatNumber(alert.currentValue)}
                    {alert.recommendedMin !== undefined && alert.recommendedMax !== undefined && (
                      <span className="ml-2">
                        (Recomendado: {formatNumber(alert.recommendedMin)} - {formatNumber(alert.recommendedMax)})
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Magnetic Flux Results */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Fluxo Magnético
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Fluxo Total</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(results.totalFlux)} Wb
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Fluxo por Polo</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(results.fluxPerPole)} Wb
            </div>
          </div>
        </div>
      </div>

      {/* Magnetic Inductions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Induções Magnéticas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Entre-ferro</div>
            <div className="text-xl font-bold text-green-600">
              {formatNumber(results.airGapInduction)} T
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Dente do Estator</div>
            <div className="text-xl font-bold text-green-600">
              {formatNumber(results.statorToothInduction)} T
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Coroa do Estator</div>
            <div className="text-xl font-bold text-green-600">
              {formatNumber(results.statorCrownInduction)} T
            </div>
          </div>
        </div>
      </div>

      {/* Winding Factors */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Fatores de Enrolamento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Fator de Passo</div>
            <div className="text-xl font-bold text-purple-600">
              {formatNumber(results.pitchFactor)}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Fator de Distribuição</div>
            <div className="text-xl font-bold text-purple-600">
              {formatNumber(results.distributionFactor)}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Fator de Enrolamento</div>
            <div className="text-xl font-bold text-purple-600">
              {formatNumber(results.windingFactor)}
            </div>
          </div>
        </div>
      </div>

      {/* Harmonic Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Análise de Harmônicas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600">1ª Ordem</div>
            <div className="text-lg font-bold text-indigo-600">
              {formatNumber(results.harmonics.firstOrder)}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600">5ª Ordem</div>
            <div className="text-lg font-bold text-indigo-600">
              {formatNumber(results.harmonics.fifthOrder)}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600">7ª Ordem</div>
            <div className="text-lg font-bold text-indigo-600">
              {formatNumber(results.harmonics.seventhOrder)}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600">11ª Ordem</div>
            <div className="text-lg font-bold text-indigo-600">
              {formatNumber(results.harmonics.eleventhOrder)}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600">13ª Ordem</div>
            <div className="text-lg font-bold text-indigo-600">
              {formatNumber(results.harmonics.thirteenthOrder)}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600">17ª Ordem</div>
            <div className="text-lg font-bold text-indigo-600">
              {formatNumber(results.harmonics.seventeenthOrder)}
            </div>
          </div>
        </div>
      </div>

      {/* Electrical Parameters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Parâmetros Elétricos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Espiras por Fase</div>
            <div className="text-xl font-bold text-orange-600">
              {formatNumber(results.turnsPerPhase, 0)}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Resistência por Fase</div>
            <div className="text-xl font-bold text-orange-600">
              {formatNumber(results.resistancePerPhase)} Ω
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Perdas por Joule</div>
            <div className="text-xl font-bold text-orange-600">
              {formatNumber(results.jouleLosses)} W
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Área do Entre-ferro</div>
            <div className="text-xl font-bold text-orange-600">
              {formatNumber(results.airGapArea)} m²
            </div>
          </div>
        </div>
      </div>

      {/* Wire and Material Data */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Dados do Condutor
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Seção do Fio</div>
            <div className="text-xl font-bold text-red-600">
              {formatNumber(results.wireSection)} mm²
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Densidade de Corrente</div>
            <div className="text-xl font-bold text-red-600">
              {formatNumber(results.currentDensity)} A/mm²
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Tamanho AWG</div>
            <div className="text-xl font-bold text-red-600">
              {results.awgSize}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Métricas de Desempenho
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Potência Específica</div>
          <div className="text-2xl font-bold text-teal-600">
            {formatNumber(results.specificPower / 1000)} kW/m³
          </div>
        </div>
      </div>
    </div>
  );
}