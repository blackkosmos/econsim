// ─── Types ────────────────────────────────────────────────────────────────────

export interface EconomicIndicators {
  inflation: number;       // %
  unemployment: number;    // %
  gdpGrowth: number;       // %
  marketConfidence: number;// 0-100
  debtToGdp: number;       // %
  bankingStability: number;// 0-100
  policyRate: number;      // % (renamed from interestRate for clarity)
  currencyStrength: number;// 0-100
}

export interface PolicyOption {
  id: string;
  label: string;
  description: string;
  category: 'monetary' | 'fiscal' | 'regulatory' | 'structural';
  indicatorDeltas: Partial<EconomicIndicators>;
  explanation: string;
  severity: 'positive' | 'neutral' | 'negative';
}

export interface DecisionOutcome {
  explanation: string;
  indicatorDeltas: Partial<EconomicIndicators>;
  severity: 'positive' | 'neutral' | 'negative';
}

export interface CrisisScenario {
  id: string;
  title: string;
  subtitle: string;
  narrative: string;
  severity: 'moderate' | 'severe' | 'critical';
  indicators: EconomicIndicators;
  policies: PolicyOption[];
}

export interface SimulationStep {
  step: number;
  policyId: string;
  policyLabel: string;
  outcome: DecisionOutcome;
  indicatorsAfter: EconomicIndicators;
  indicatorsBefore: EconomicIndicators;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

// ─── Crisis 1: Inflation Shock ────────────────────────────────────────────────

const CRISIS_INFLATION_SHOCK: CrisisScenario = {
  id: 'crisis-inflation-shock',
  title: 'The Inflation Shock',
  subtitle: 'Monetary Policy Dilemma — Demand-Pull & Cost-Push',
  narrative: `Valdoria's economy is overheating. A combination of post-pandemic fiscal stimulus and a global energy supply disruption has sent inflation to 11% — the highest in three decades. The central bank has been slow to act, and inflation expectations are becoming unanchored. Bond markets are nervous. The currency is weakening as real interest rates turn deeply negative. You have been appointed as the new central bank governor. The public is demanding action. Every option carries painful trade-offs.`,
  severity: 'critical',
  indicators: {
    inflation: 11.0,
    unemployment: 4.0,
    gdpGrowth: 0.5,
    marketConfidence: 55,
    debtToGdp: 75,
    bankingStability: 70,
    policyRate: 3.0,
    currencyStrength: 50,
  },
  policies: [
    {
      id: 'aggressive-rate-hike',
      label: 'Aggressive Interest Rate Increase',
      description: 'Raise the policy rate by 2.5 percentage points to 5.5% — a sharp tightening to crush inflation expectations.',
      category: 'monetary',
      indicatorDeltas: {
        inflation: -2.5,
        gdpGrowth: -1.0,
        unemployment: 0.6,
        marketConfidence: 13,
        currencyStrength: 11,
        policyRate: 2.5,
        // debtToGdp: no change
        // bankingStability: no change
      },
      explanation: 'A sharp rate hike signals credible commitment to price stability. Inflation expectations fall, the currency strengthens as capital inflows rise, and market confidence improves. However, higher borrowing costs reduce investment and consumer spending, dragging GDP growth down and pushing unemployment slightly higher. This is the classic monetary policy trade-off: lower inflation at the cost of short-run output.',
      severity: 'positive',
    },
    {
      id: 'gradual-rate-hike',
      label: 'Gradual Rate Increase',
      description: 'Raise the policy rate by 1.0 percentage point to 4.0% — a cautious tightening to balance inflation and growth.',
      category: 'monetary',
      indicatorDeltas: {
        inflation: -1.2,
        gdpGrowth: -0.3,
        unemployment: 0.2,
        marketConfidence: 5,
        currencyStrength: 5,
        policyRate: 1.0,
      },
      explanation: 'A gradual approach limits damage to growth and employment, but markets question whether the central bank is serious about inflation. Inflation falls only modestly. The currency strengthens slightly. This buys time but risks inflation becoming entrenched if expectations de-anchor further.',
      severity: 'neutral',
    },
    {
      id: 'rate-cut-inflation',
      label: 'Cut Interest Rates',
      description: 'Reduce the policy rate by 1.5 percentage points to 1.5% — prioritise growth over inflation control.',
      category: 'monetary',
      indicatorDeltas: {
        inflation: 2.2,
        gdpGrowth: 0.7,
        marketConfidence: -15,
        currencyStrength: -12,
        policyRate: -1.5,
        // unemployment: no change (growth boost offsets)
      },
      explanation: 'Cutting rates during high inflation is a serious policy error. Lower borrowing costs stimulate demand, pushing inflation even higher. Market confidence collapses as investors lose faith in the central bank\'s commitment to price stability. The currency weakens sharply as real interest rates fall further into negative territory. This is the wrong tool for this crisis.',
      severity: 'negative',
    },
    {
      id: 'fiscal-stimulus-inflation',
      label: 'Fiscal Stimulus Package',
      description: 'Increase government spending to support households hit by rising prices — a demand-side response.',
      category: 'fiscal',
      indicatorDeltas: {
        inflation: 1.5,
        gdpGrowth: 0.5,
        debtToGdp: 4,
        marketConfidence: -8,
        // unemployment: no change
        // policyRate: no change
        // currencyStrength: no change
      },
      explanation: 'Fiscal stimulus adds to aggregate demand in an already overheating economy, worsening inflation. While it supports short-run growth, it works against the monetary tightening needed to control prices. Government borrowing rises, pushing debt-to-GDP higher and reducing market confidence. This is a procyclical policy error — the wrong response to demand-pull inflation.',
      severity: 'negative',
    },
  ],
};

// ─── Crisis 2: Sovereign Debt Spiral ─────────────────────────────────────────

const CRISIS_SOVEREIGN_DEBT: CrisisScenario = {
  id: 'crisis-sovereign-debt',
  title: 'The Sovereign Debt Spiral',
  subtitle: 'Fiscal Crisis — Bond Market Collapse',
  narrative: `Nordavia's government debt has reached 125% of GDP after years of fiscal expansion. Bond markets have lost confidence — yields on 10-year bonds have spiked to 9.4%, making refinancing nearly impossible. The IMF has issued a warning. Foreign investors are pulling capital, the currency is under severe pressure, and domestic banks — heavily exposed to government bonds — are teetering. The government must act, but every option carries painful trade-offs between fiscal credibility and economic pain.`,
  severity: 'critical',
  indicators: {
    inflation: 4.5,
    unemployment: 5.5,
    gdpGrowth: 0.0,
    marketConfidence: 35,
    debtToGdp: 125,
    bankingStability: 55,
    policyRate: 3.0,
    currencyStrength: 40,
  },
  policies: [
    {
      id: 'imf-programme',
      label: 'Seek IMF Assistance',
      description: 'Request an IMF loan programme in exchange for structural reforms and fiscal consolidation.',
      category: 'structural',
      indicatorDeltas: {
        marketConfidence: 18,
        debtToGdp: -8,
        currencyStrength: 12,
        gdpGrowth: -0.8,
        unemployment: 1.5,
        bankingStability: 8,
        // inflation: no change
        // policyRate: no change
      },
      explanation: 'The IMF programme provides emergency financing and restores creditor confidence. Bond yields fall sharply as the international backstop removes default risk. The currency strengthens and banking stability improves. However, the attached conditionality — spending cuts and structural reforms — creates short-term pain: growth falls and unemployment rises. This is the classic IMF trade-off: credibility now, pain later.',
      severity: 'positive',
    },
    {
      id: 'austerity-debt',
      label: 'Austerity Measures',
      description: 'Cut government spending and raise taxes to reduce the deficit and restore market confidence.',
      category: 'fiscal',
      indicatorDeltas: {
        debtToGdp: -6,
        marketConfidence: 10,
        gdpGrowth: -1.5,
        unemployment: 2.0,
        inflation: -0.5,
        // policyRate: no change
        // bankingStability: no change
        // currencyStrength: no change
      },
      explanation: 'Austerity reduces the deficit and signals fiscal discipline, improving market confidence and reducing debt-to-GDP. However, cutting spending when the economy is already stagnant amplifies the downturn — the fiscal multiplier works in reverse. GDP contracts and unemployment rises. This is the austerity paradox: the medicine is necessary but painful.',
      severity: 'neutral',
    },
    {
      id: 'debt-restructure',
      label: 'Debt Restructuring',
      description: 'Negotiate with creditors to extend maturities and reduce debt service costs — a partial default.',
      category: 'structural',
      indicatorDeltas: {
        debtToGdp: -20,
        marketConfidence: -15,
        currencyStrength: -10,
        bankingStability: -12,
        gdpGrowth: 0.5,
        // inflation: no change
        // unemployment: no change
        // policyRate: no change
      },
      explanation: 'Debt restructuring dramatically reduces the debt burden, freeing fiscal space for recovery. However, it triggers a technical default, damaging the country\'s credit rating and market access for years. The currency falls and banking stability deteriorates as banks holding government bonds suffer losses. Market confidence collapses. This buys long-run sustainability at the cost of severe short-run disruption.',
      severity: 'negative',
    },
    {
      id: 'fiscal-expansion-debt',
      label: 'Fiscal Expansion',
      description: 'Increase government spending to stimulate growth — betting that growth will reduce the debt ratio.',
      category: 'fiscal',
      indicatorDeltas: {
        debtToGdp: 8,
        marketConfidence: -20,
        currencyStrength: -8,
        gdpGrowth: 0.3,
        inflation: 0.8,
        bankingStability: -5,
        // unemployment: no change
        // policyRate: no change
      },
      explanation: 'Expanding spending when debt is already at 125% of GDP is extremely dangerous. Bond markets react immediately — yields spike further, the currency falls, and banking stability deteriorates as sovereign risk rises. Market confidence collapses. While growth ticks up marginally, the debt-to-GDP ratio worsens sharply. This is the wrong policy at the wrong time — it accelerates the debt spiral.',
      severity: 'negative',
    },
  ],
};

// ─── Crisis 3: Housing Bubble Collapse ───────────────────────────────────────

const CRISIS_HOUSING_BUBBLE: CrisisScenario = {
  id: 'crisis-housing-bubble',
  title: 'The Housing Bubble Collapse',
  subtitle: 'Asset Price Crash — Banking System Stress',
  narrative: `After a decade of ultra-low interest rates, Solantia's housing market has crashed 35% in 12 months. Millions of households are in negative equity. Consumer spending has collapsed as households deleverage. Banks are reporting rising non-performing loans and the banking stability index has fallen to 35. The construction sector — which accounted for 12% of GDP — has shed 400,000 jobs. The government must balance rescuing the financial system without rewarding reckless lending behaviour.`,
  severity: 'severe',
  indicators: {
    inflation: 2.0,
    unemployment: 4.0,
    gdpGrowth: 2.5,
    marketConfidence: 60,
    debtToGdp: 80,
    bankingStability: 35,
    policyRate: 4.0,
    currencyStrength: 55,
  },
  policies: [
    {
      id: 'bank-bailout-housing',
      label: 'Bank Bailout & Recapitalisation',
      description: 'Provide emergency capital injections to failing banks to prevent systemic collapse.',
      category: 'regulatory',
      indicatorDeltas: {
        bankingStability: 22,
        marketConfidence: 12,
        debtToGdp: 7,
        gdpGrowth: 0.5,
        // inflation: no change
        // unemployment: no change
        // policyRate: no change
        // currencyStrength: no change
      },
      explanation: 'The bailout prevents systemic collapse. Banking stability recovers significantly, halting the credit freeze and restoring interbank lending. Market confidence improves as the systemic risk is contained. However, the fiscal cost is substantial — debt-to-GDP rises as the government absorbs bank losses. Critics argue it rewards reckless behaviour, creating moral hazard for future crises.',
      severity: 'positive',
    },
    {
      id: 'rate-cut-housing',
      label: 'Emergency Rate Cut',
      description: 'Cut the policy rate by 2.0 percentage points to 2.0% to ease mortgage burdens and stimulate the economy.',
      category: 'monetary',
      indicatorDeltas: {
        policyRate: -2.0,
        gdpGrowth: 0.8,
        inflation: 0.6,
        marketConfidence: 8,
        currencyStrength: -6,
        bankingStability: 5,
        // unemployment: no change
        // debtToGdp: no change
      },
      explanation: 'Cutting rates reduces mortgage costs for households, easing the debt burden and supporting consumer spending. GDP growth picks up and banking stability improves slightly as non-performing loans stabilise. Market confidence recovers modestly. The currency weakens as interest rate differentials narrow. This is the appropriate monetary response to a demand-side shock from the housing crash.',
      severity: 'positive',
    },
    {
      id: 'deposit-guarantee',
      label: 'Deposit Guarantee Scheme',
      description: 'Guarantee all bank deposits to halt bank runs and restore confidence in the banking system.',
      category: 'regulatory',
      indicatorDeltas: {
        bankingStability: 18,
        marketConfidence: 10,
        gdpGrowth: 0.3,
        debtToGdp: 3,
        // inflation: no change
        // unemployment: no change
        // policyRate: no change
        // currencyStrength: no change
      },
      explanation: 'The deposit guarantee immediately halts bank runs. Confidence in the banking system is restored overnight and interbank lending resumes. The fiscal contingent liability is large but the immediate crisis is contained. This is a targeted intervention that addresses the confidence problem without the full cost of a bailout.',
      severity: 'positive',
    },
    {
      id: 'no-intervention',
      label: 'No Intervention — Let Markets Clear',
      description: 'Allow failing banks to collapse and let the market correct — avoid moral hazard.',
      category: 'structural',
      indicatorDeltas: {
        bankingStability: -18,
        marketConfidence: -20,
        gdpGrowth: -2.5,
        unemployment: 1.8,
        currencyStrength: -8,
        // inflation: no change
        // policyRate: no change
        // debtToGdp: no change
      },
      explanation: 'Refusing to intervene allows insolvent banks to fail. While this avoids moral hazard, the systemic consequences are severe. Banking stability collapses further as contagion spreads. Credit freezes, investment collapses, and GDP contracts sharply. Unemployment rises as businesses cannot access finance. Market confidence evaporates. This is the 1929 mistake — allowing a financial crisis to become an economic depression.',
      severity: 'negative',
    },
  ],
};

// ─── All Crises ───────────────────────────────────────────────────────────────

export const ALL_CRISES: CrisisScenario[] = [
  CRISIS_INFLATION_SHOCK,
  CRISIS_SOVEREIGN_DEBT,
  CRISIS_HOUSING_BUBBLE,
];

// ─── Generate / Select Crisis ─────────────────────────────────────────────────

export function generateCrisis(crisisId?: string): CrisisScenario {
  if (crisisId) {
    const found = ALL_CRISES.find((c) => c.id === crisisId);
    if (found) return found;
  }
  return ALL_CRISES[Math.floor(Math.random() * ALL_CRISES.length)];
}

// ─── Apply Policy ─────────────────────────────────────────────────────────────

export function applyPolicy(
  policyId: string,
  currentIndicators: EconomicIndicators,
  policies: PolicyOption[]
): { outcome: DecisionOutcome; newIndicators: EconomicIndicators } {
  const policy = policies.find((p) => p.id === policyId);

  if (!policy) {
    return {
      outcome: {
        explanation: 'The policy has been implemented. Effects are mixed and uncertain.',
        indicatorDeltas: {},
        severity: 'neutral',
      },
      newIndicators: { ...currentIndicators },
    };
  }

  const outcome: DecisionOutcome = {
    explanation: policy.explanation,
    indicatorDeltas: policy.indicatorDeltas,
    severity: policy.severity,
  };

  const d = policy.indicatorDeltas;
  const newIndicators: EconomicIndicators = {
    inflation: clamp(currentIndicators.inflation + (d.inflation ?? 0), -5, 30),
    unemployment: clamp(currentIndicators.unemployment + (d.unemployment ?? 0), 1, 35),
    gdpGrowth: clamp(currentIndicators.gdpGrowth + (d.gdpGrowth ?? 0), -10, 10),
    marketConfidence: clamp(currentIndicators.marketConfidence + (d.marketConfidence ?? 0), 0, 100),
    debtToGdp: clamp(currentIndicators.debtToGdp + (d.debtToGdp ?? 0), 10, 200),
    bankingStability: clamp(currentIndicators.bankingStability + (d.bankingStability ?? 0), 0, 100),
    policyRate: clamp(currentIndicators.policyRate + (d.policyRate ?? 0), 0.1, 25),
    currencyStrength: clamp(currentIndicators.currencyStrength + (d.currencyStrength ?? 0), 0, 100),
  };

  return { outcome, newIndicators };
}
