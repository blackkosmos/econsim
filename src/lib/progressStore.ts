'use client';

const STORAGE_KEY = 'econsim_completed_scenarios';

export function getCompletedScenarios(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function markScenarioCompleted(scenarioId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getCompletedScenarios();
    if (!current.includes(scenarioId)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, scenarioId]));
    }
  } catch {
    // ignore
  }
}

export function isScenarioCompleted(scenarioId: string): boolean {
  return getCompletedScenarios().includes(scenarioId);
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
