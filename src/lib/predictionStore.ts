'use client';

export interface PredictionEntry {
  questionId: string;
  selectedAnswerId: string;
  timestamp: number;
}

export interface SimulationPredictions {
  scenarioId: string;
  predictions: PredictionEntry[];
}

// In-memory store keyed by scenarioId
const store: Record<string, SimulationPredictions> = {};

export function savePredictions(scenarioId: string, predictions: PredictionEntry[]): void {
  store[scenarioId] = { scenarioId, predictions };
  console.log('[PredictionStore] Saved predictions for', scenarioId, predictions);
}

export function getPredictions(scenarioId: string): PredictionEntry[] {
  return store[scenarioId]?.predictions ?? [];
}

export function getPredictionForQuestion(scenarioId: string, questionId: string): PredictionEntry | undefined {
  const predictions = getPredictions(scenarioId);
  return predictions.find((p) => p.questionId === questionId);
}
