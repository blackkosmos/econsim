export interface EconomicIndicators {
  inflation: number;       // %
  unemployment: number;    // %
  gdpGrowth: number;       // %
  marketConfidence: number;// 0-100
  debtToGdp: number;       // %
  bankingStability: number;// 0-100
  interestRate: number;    // %
  currencyStrength: number;// 0-100
}

export interface PolicyOption {
  id: string;
  label: string;
  description: string;
  category: 'monetary' | 'fiscal' | 'regulatory' | 'structural';
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
}

const CRISIS_TEMPLATES = [
  {
    title: 'The Sovereign Debt Spiral',
    subtitle: 'Fiscal Crisis — Eurozone Periphery',
    narrative: `Bond markets have lost confidence in Valdoria's government debt after years of fiscal expansion. Yields on 10-year bonds have spiked to 9.4%, making refinancing nearly impossible. The IMF has issued a warning. Foreign investors are pulling capital, the currency is under pressure, and domestic banks — heavily exposed to government bonds — are teetering. Citizens are demanding the government act, but every option carries painful trade-offs.`,
    severity: 'critical' as const,
    indicatorBias: { debtToGdp: 30, inflation: 2, bankingStability: -20, marketConfidence: -25, gdpGrowth: 0, unemployment: 0, interestRate: 0, currencyStrength: 0 },
  },
  {
    title: 'The Banking Contagion',subtitle: 'Systemic Banking Crisis — Emerging Market',narrative: `Three of Nordavia's largest commercial banks have reported catastrophic losses on real-estate derivatives. A bank run began last Tuesday — queues outside branches, ATM limits imposed. Interbank lending has frozen. The central bank has injected emergency liquidity, but confidence is evaporating. If two more banks fail, the payments system itself could collapse. You have been appointed to the Crisis Response Committee.`,
    severity: 'severe' as const,
    indicatorBias: { bankingStability: -35, marketConfidence: -30, gdpGrowth: -2, unemployment: 2, debtToGdp: 0, inflation: 0, interestRate: 0, currencyStrength: 0 },
  },
  {
    title: 'The Stagflation Trap',
    subtitle: 'Supply Shock & Monetary Dilemma',
    narrative: `A prolonged drought combined with a global energy supply disruption has sent food and fuel prices soaring in Kestria. Inflation has hit 14% — the highest in two decades — while GDP growth has stalled at 0.3%. The central bank faces an impossible choice: raise rates to crush inflation and risk recession, or hold rates and let inflation erode living standards. Trade unions are threatening strikes. The government's approval rating is at an all-time low.`,severity: 'severe' as const,
    indicatorBias: { inflation: 8, unemployment: 3, gdpGrowth: -2.5, marketConfidence: -15, debtToGdp: 0, bankingStability: 0, interestRate: 0, currencyStrength: 0 },
  },
  {
    title: 'The Currency Collapse',subtitle: 'Exchange Rate Crisis — Capital Flight',narrative: `Speculative attacks on the Mervian peso have depleted 60% of the central bank's foreign reserves in just six weeks. The currency has lost 38% of its value against the dollar. Import costs have surged, fuelling inflation. Businesses with dollar-denominated debt are facing insolvency. The government must decide whether to defend the peg, float the currency, or seek emergency IMF assistance — each path carries severe political and economic consequences.`,
    severity: 'critical' as const,
    indicatorBias: { currencyStrength: -35, inflation: 6, marketConfidence: -20, bankingStability: -15, debtToGdp: 0, gdpGrowth: 0, unemployment: 0, interestRate: 0 },
  },
  {
    title: 'The Deflationary Spiral',
    subtitle: 'Demand Collapse — Liquidity Trap',
    narrative: `Prethania's economy has entered a deflationary spiral. Consumer prices have fallen for 18 consecutive months. Households are deferring purchases, expecting prices to fall further. Corporate investment has collapsed. The central bank's policy rate is already at 0.1% — near the zero lower bound. Conventional monetary policy is exhausted. The government must now consider unconventional tools, but public debt is already elevated and political consensus is fragile.`,
    severity: 'moderate' as const,
    indicatorBias: { inflation: -5, gdpGrowth: -3, marketConfidence: -10, unemployment: 4, debtToGdp: 0, bankingStability: 0, interestRate: 0, currencyStrength: 0 },
  },
  {
    title: 'The Credit Bubble Burst',
    subtitle: 'Asset Price Collapse — Household Debt Crisis',
    narrative: `After a decade of ultra-low interest rates, Solantia's housing market has crashed 35% in 12 months. Millions of households are in negative equity. Consumer spending has collapsed as households deleverage. Banks are reporting rising non-performing loans. The construction sector — which accounted for 12% of GDP — has shed 400,000 jobs. The government must balance rescuing the financial system without rewarding reckless lending behaviour.`,
    severity: 'severe' as const,
    indicatorBias: { bankingStability: -25, unemployment: 5, gdpGrowth: -3, marketConfidence: -20, debtToGdp: 0, inflation: 0, interestRate: 0, currencyStrength: 0 },
  },
];

const ALL_POLICIES: PolicyOption[] = [
  { id: 'rate-hike', label: 'Raise Interest Rates', description: 'Increase the central bank policy rate by 1.5 percentage points to tighten monetary conditions.', category: 'monetary' },
  { id: 'rate-cut', label: 'Cut Interest Rates', description: 'Reduce the policy rate by 1.5 percentage points to stimulate borrowing and investment.', category: 'monetary' },
  { id: 'qe', label: 'Quantitative Easing', description: 'Purchase government bonds and assets to inject liquidity and lower long-term yields.', category: 'monetary' },
  { id: 'bank-bailout', label: 'Bank Bailout', description: 'Provide emergency capital injections to failing banks to prevent systemic collapse.', category: 'regulatory' },
  { id: 'fiscal-stimulus', label: 'Fiscal Stimulus Package', description: 'Increase government spending on infrastructure and social programmes to boost aggregate demand.', category: 'fiscal' },
  { id: 'austerity', label: 'Austerity Measures', description: 'Cut government spending and raise taxes to reduce the deficit and restore market confidence.', category: 'fiscal' },
  { id: 'capital-controls', label: 'Capital Controls', description: 'Restrict capital outflows to prevent currency collapse and stabilise reserves.', category: 'regulatory' },
  { id: 'imf-bailout', label: 'Seek IMF Assistance', description: 'Request an IMF loan programme in exchange for structural reforms and fiscal consolidation.', category: 'structural' },
  { id: 'bank-guarantee', label: 'Deposit Guarantee Scheme', description: 'Guarantee all bank deposits up to a limit to halt bank runs and restore confidence.', category: 'regulatory' },
  { id: 'wage-freeze', label: 'Public Sector Wage Freeze', description: 'Freeze public sector wages to reduce fiscal pressure and signal commitment to consolidation.', category: 'fiscal' },
  { id: 'debt-restructure', label: 'Debt Restructuring', description: 'Negotiate with creditors to extend maturities and reduce debt service costs.', category: 'structural' },
  { id: 'supply-reform', label: 'Supply-Side Reforms', description: 'Deregulate labour markets and reduce barriers to business to improve long-run productivity.', category: 'structural' },
];

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function rand(min: number, max: number, decimals = 1) {
  const v = Math.random() * (max - min) + min;
  return parseFloat(v.toFixed(decimals));
}

export function generateCrisis(): CrisisScenario {
  const template = CRISIS_TEMPLATES[Math.floor(Math.random() * CRISIS_TEMPLATES.length)];
  const bias = template.indicatorBias;

  const base: EconomicIndicators = {
    inflation: clamp(rand(2, 6) + (bias.inflation ?? 0), -3, 25),
    unemployment: clamp(rand(4, 8) + (bias.unemployment ?? 0), 2, 30),
    gdpGrowth: clamp(rand(0.5, 2.5) + (bias.gdpGrowth ?? 0), -8, 6),
    marketConfidence: clamp(rand(45, 65) + (bias.marketConfidence ?? 0), 5, 95),
    debtToGdp: clamp(rand(55, 80) + (bias.debtToGdp ?? 0), 30, 150),
    bankingStability: clamp(rand(55, 75) + (bias.bankingStability ?? 0), 5, 95),
    interestRate: clamp(rand(1, 5) + (bias.interestRate ?? 0), 0.1, 20),
    currencyStrength: clamp(rand(50, 70) + (bias.currencyStrength ?? 0), 5, 95),
  };

  // Pick 4 relevant policies
  const shuffled = [...ALL_POLICIES].sort(() => Math.random() - 0.5);
  const policies = shuffled.slice(0, 4);

  return {
    id: `crisis-${Date.now()}`,
    title: template.title,
    subtitle: template.subtitle,
    narrative: template.narrative,
    severity: template.severity,
    indicators: base,
    policies,
  };
}

const POLICY_OUTCOMES: Record<string, (ind: EconomicIndicators) => DecisionOutcome> = {
  'rate-hike': (ind) => {
    const tooHigh = ind.interestRate > 8;
    return {
      explanation: tooHigh
        ? 'Further rate hikes have tipped the economy into recession. Borrowing costs are crushing businesses and households. GDP contracts sharply and unemployment rises.' :'Higher rates are cooling inflation, but at a cost to growth. Market confidence improves slightly as investors see commitment to price stability. Unemployment edges up as credit tightens.',
      indicatorDeltas: {
        inflation: tooHigh ? -1.5 : -1.2,
        interestRate: 1.5,
        gdpGrowth: tooHigh ? -2.5 : -0.8,
        unemployment: tooHigh ? 2.5 : 0.8,
        marketConfidence: tooHigh ? -8 : 5,
        currencyStrength: 4,
      },
      severity: tooHigh ? 'negative' : 'neutral',
    };
  },
  'rate-cut': (ind) => {
    const alreadyLow = ind.interestRate < 1;
    return {
      explanation: alreadyLow
        ? 'With rates already near zero, the cut has little stimulative effect — a classic liquidity trap. Markets are disappointed that the central bank has exhausted conventional tools.' :'Lower borrowing costs stimulate investment and consumer spending. GDP growth picks up. However, if inflation is already elevated, this risks overheating the economy further.',
      indicatorDeltas: {
        interestRate: -1.5,
        gdpGrowth: alreadyLow ? 0.2 : 0.9,
        inflation: alreadyLow ? 0.1 : 0.8,
        unemployment: -0.5,
        marketConfidence: alreadyLow ? -5 : 4,
        currencyStrength: -3,
      },
      severity: alreadyLow ? 'negative' : 'positive',
    };
  },
  'qe': () => ({
    explanation: 'Asset purchases inject liquidity into the financial system, compressing long-term yields and supporting asset prices. Market confidence recovers. However, the expanded money supply risks fuelling inflation if the economy is not in a demand slump.',
    indicatorDeltas: {
      marketConfidence: 10,
      bankingStability: 8,
      gdpGrowth: 0.6,
      inflation: 1.2,
      currencyStrength: -5,
    },
    severity: 'positive',
  }),
  'bank-bailout': (ind) => ({
    explanation: ind.bankingStability < 40
      ? 'The bailout prevents systemic collapse. Banking stability recovers significantly, halting the credit freeze. However, the fiscal cost is substantial, raising debt-to-GDP and signalling moral hazard to future risk-takers.'
      : 'The bailout stabilises the banking sector, but critics argue it rewards reckless behaviour. The fiscal cost adds to debt pressures. Market confidence improves modestly.',
    indicatorDeltas: {
      bankingStability: ind.bankingStability < 40 ? 22 : 14,
      marketConfidence: 8,
      debtToGdp: 6,
      gdpGrowth: 0.4,
    },
    severity: 'positive',
  }),
  'fiscal-stimulus': (ind) => {
    const highDebt = ind.debtToGdp > 100;
    return {
      explanation: highDebt
        ? 'With debt already above 100% of GDP, markets react negatively to further borrowing. Bond yields spike, partially offsetting the demand boost. Growth improves marginally but confidence falls.' :'Government spending boosts aggregate demand, lifting GDP growth and reducing unemployment. The multiplier effect is strongest when the economy has significant slack. Debt rises but confidence holds.',
      indicatorDeltas: {
        gdpGrowth: highDebt ? 0.4 : 1.2,
        unemployment: -0.8,
        debtToGdp: 5,
        marketConfidence: highDebt ? -8 : 5,
        inflation: 0.5,
      },
      severity: highDebt ? 'neutral' : 'positive',
    };
  },
  'austerity': (ind) => {
    const deepRecession = ind.gdpGrowth < -2;
    return {
      explanation: deepRecession
        ? 'Austerity during a deep recession amplifies the downturn — the fiscal multiplier works in reverse. GDP contracts further, unemployment rises sharply, and the debt-to-GDP ratio paradoxically worsens as the denominator shrinks.'
        : 'Spending cuts reduce the deficit and restore some market confidence. Bond yields fall. However, reduced government spending drags on growth and pushes unemployment higher in the short run.',
      indicatorDeltas: {
        debtToGdp: deepRecession ? 3 : -6,
        marketConfidence: deepRecession ? -10 : 8,
        gdpGrowth: deepRecession ? -1.8 : -0.5,
        unemployment: deepRecession ? 2.5 : 1.0,
        inflation: -0.4,
      },
      severity: deepRecession ? 'negative' : 'neutral',
    };
  },
  'capital-controls': () => ({
    explanation: 'Capital controls halt the immediate outflow, stabilising the currency and reserves. However, they signal economic distress to global investors and damage the country\'s reputation for openness. Foreign direct investment falls. The controls buy time but are not a long-term solution.',
    indicatorDeltas: {
      currencyStrength: 8,
      marketConfidence: -6,
      gdpGrowth: -0.4,
      bankingStability: 5,
    },
    severity: 'neutral',
  }),
  'imf-bailout': () => ({
    explanation: 'The IMF programme provides emergency financing and restores creditor confidence. Bond yields fall sharply. However, the attached conditionality — spending cuts and structural reforms — creates short-term pain. Growth dips before recovering.',
    indicatorDeltas: {
      marketConfidence: 14,
      debtToGdp: -8,
      currencyStrength: 10,
      gdpGrowth: -0.6,
      unemployment: 1.2,
      bankingStability: 6,
    },
    severity: 'positive',
  }),
  'bank-guarantee': () => ({
    explanation: 'The deposit guarantee immediately halts the bank run. Confidence in the banking system is restored overnight. The fiscal contingent liability is large, but the immediate crisis is contained. Interbank lending resumes.',
    indicatorDeltas: {
      bankingStability: 18,
      marketConfidence: 10,
      gdpGrowth: 0.3,
    },
    severity: 'positive',
  }),
  'wage-freeze': () => ({
    explanation: 'The wage freeze reduces public sector costs and signals fiscal discipline. Inflation pressures ease modestly. However, public sector workers\' real wages fall, reducing consumer spending and dampening growth.',
    indicatorDeltas: {
      inflation: -0.6,
      debtToGdp: -2,
      marketConfidence: 4,
      gdpGrowth: -0.3,
      unemployment: 0.3,
    },
    severity: 'neutral',
  }),
  'debt-restructure': () => ({
    explanation: 'Debt restructuring reduces the immediate debt service burden, freeing fiscal space. However, it triggers a technical default, damaging the country\'s credit rating and market access for years. Growth recovers slowly as the debt overhang lifts.',
    indicatorDeltas: {
      debtToGdp: -18,
      marketConfidence: -12,
      currencyStrength: -8,
      gdpGrowth: 0.8,
      bankingStability: -10,
    },
    severity: 'neutral',
  }),
  'supply-reform': () => ({
    explanation: 'Supply-side reforms improve long-run productive capacity, but effects are slow to materialise. In the short run, labour market deregulation may increase unemployment as firms restructure. Investor confidence in the economy\'s fundamentals improves.',
    indicatorDeltas: {
      marketConfidence: 7,
      gdpGrowth: 0.4,
      unemployment: 0.8,
      inflation: -0.3,
    },
    severity: 'neutral',
  }),
};

export function applyPolicy(
  policyId: string,
  currentIndicators: EconomicIndicators,
  policies: PolicyOption[]
): { outcome: DecisionOutcome; newIndicators: EconomicIndicators } {
  const fn = POLICY_OUTCOMES[policyId];
  const outcome = fn
    ? fn(currentIndicators)
    : {
        explanation: 'The policy has been implemented. Effects are mixed and uncertain.',
        indicatorDeltas: {},
        severity: 'neutral' as const,
      };

  const deltas = outcome.indicatorDeltas;
  const newIndicators: EconomicIndicators = {
    inflation: clamp((currentIndicators.inflation + (deltas.inflation ?? 0)), -5, 30),
    unemployment: clamp((currentIndicators.unemployment + (deltas.unemployment ?? 0)), 1, 35),
    gdpGrowth: clamp((currentIndicators.gdpGrowth + (deltas.gdpGrowth ?? 0)), -10, 10),
    marketConfidence: clamp((currentIndicators.marketConfidence + (deltas.marketConfidence ?? 0)), 0, 100),
    debtToGdp: clamp((currentIndicators.debtToGdp + (deltas.debtToGdp ?? 0)), 10, 200),
    bankingStability: clamp((currentIndicators.bankingStability + (deltas.bankingStability ?? 0)), 0, 100),
    interestRate: clamp((currentIndicators.interestRate + (deltas.interestRate ?? 0)), 0.1, 25),
    currencyStrength: clamp((currentIndicators.currencyStrength + (deltas.currencyStrength ?? 0)), 0, 100),
  };

  return { outcome, newIndicators };
}
