'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Zap, RefreshCw, Cpu, ChevronRight, AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EconomicIndicators {
  inflation: number;
  unemployment: number;
  gdpGrowth: number;
  marketConfidence: number;
  debtToGdp: number;
  bankingStability: number;
  policyRate: number;
  currencyStrength: number;
}

interface AnswerChoice {
  id: string;
  label: string;
  isCorrect: boolean;
  feedback: string;
  indicatorChanges: Partial<EconomicIndicators>;
}

interface CrisisStep {
  stepNumber: number;
  question: string;
  choices: AnswerChoice[];
}

interface CrisisData {
  id: string;
  title: string;
  briefing: string;
  startingIndicators: EconomicIndicators;
  steps: CrisisStep[];
}

interface StepRecord {
  stepNumber: number;
  chosenLabel: string;
  wasCorrectFirstAttempt: boolean;
  hpEarned: number;
  indicatorsBefore: EconomicIndicators;
  indicatorsAfter: EconomicIndicators;
}

// ─── Crisis Data ──────────────────────────────────────────────────────────────

const CRISES: CrisisData[] = [
  {
    id: 'inflation-shock',
    title: 'The Inflation Shock',
    briefing:
      'A major geopolitical conflict has disrupted global energy supplies. Oil and gas prices have surged, pushing production costs higher across the economy. Inflation has risen to dangerous levels, household purchasing power is falling, and businesses are becoming increasingly cautious. Policymakers must bring inflation under control without causing a severe recession.',
    startingIndicators: {
      inflation: 11.0,
      unemployment: 4.0,
      gdpGrowth: 0.5,
      marketConfidence: 55,
      debtToGdp: 75,
      bankingStability: 70,
      policyRate: 3.0,
      currencyStrength: 50,
    },
    steps: [
      {
        stepNumber: 1,
        question: 'Inflation is at 11%. What is your immediate monetary policy response?',
        choices: [
          {
            id: 'a',
            label: 'Aggressively raise interest rates',
            isCorrect: true,
            feedback:
              'Correct. Aggressively raising interest rates signals a credible commitment to price stability. Inflation expectations fall, the currency strengthens as capital inflows rise, and market confidence improves. Higher borrowing costs reduce investment and consumer spending, dragging GDP growth down slightly and pushing unemployment higher — the classic monetary policy trade-off.',
            indicatorChanges: {
              inflation: -2.5,
              gdpGrowth: -1.0,
              unemployment: 0.6,
              marketConfidence: 13,
              currencyStrength: 11,
              policyRate: 2.5,
            },
          },
          {
            id: 'b',
            label: 'Cut interest rates',
            isCorrect: false,
            feedback:
              'Incorrect. Cutting rates during high inflation is a serious policy error. Lower borrowing costs stimulate demand, pushing inflation even higher. Market confidence collapses as investors lose faith in the central bank\'s commitment to price stability.',
            indicatorChanges: {
              inflation: 2.2,
              gdpGrowth: 0.7,
              marketConfidence: -15,
              currencyStrength: -12,
              policyRate: -1.5,
            },
          },
          {
            id: 'c',
            label: 'Begin Quantitative Easing',
            isCorrect: false,
            feedback:
              'Incorrect. QE injects money into the economy, increasing aggregate demand and worsening inflation. This is the wrong tool when inflation is already at 11%.',
            indicatorChanges: {
              inflation: 1.8,
              gdpGrowth: 0.4,
              marketConfidence: -10,
              debtToGdp: 3,
            },
          },
          {
            id: 'd',
            label: 'Increase government spending',
            isCorrect: false,
            feedback:
              'Incorrect. Fiscal stimulus adds to aggregate demand in an already overheating economy, worsening inflation. This is a procyclical policy error.',
            indicatorChanges: {
              inflation: 1.5,
              gdpGrowth: 0.5,
              debtToGdp: 4,
              marketConfidence: -8,
            },
          },
        ],
      },
      {
        stepNumber: 2,
        question: 'Inflation is falling but households are struggling with the cost of living. What fiscal support do you provide?',
        choices: [
          {
            id: 'a',
            label: 'Temporary targeted support for low-income households',
            isCorrect: true,
            feedback:
              'Correct. Targeted support helps the most vulnerable without significantly adding to aggregate demand. It is fiscally responsible and does not undermine the monetary tightening already in place.',
            indicatorChanges: {
              marketConfidence: 8,
              unemployment: -0.2,
              debtToGdp: 2,
            },
          },
          {
            id: 'b',
            label: 'Large nationwide infrastructure boom',
            isCorrect: false,
            feedback:
              'Incorrect. A large infrastructure programme significantly increases aggregate demand, working against the monetary tightening and risking a resurgence of inflation.',
            indicatorChanges: {
              inflation: 1.2,
              gdpGrowth: 1.0,
              debtToGdp: 6,
              marketConfidence: -5,
            },
          },
          {
            id: 'c',
            label: 'Across-the-board tax cuts',
            isCorrect: false,
            feedback:
              'Incorrect. Broad tax cuts increase disposable income for all households, boosting aggregate demand and worsening inflation. This contradicts the tight monetary policy stance.',
            indicatorChanges: {
              inflation: 1.0,
              gdpGrowth: 0.6,
              debtToGdp: 5,
              marketConfidence: -7,
            },
          },
          {
            id: 'd',
            label: 'Increase public sector wages significantly',
            isCorrect: false,
            feedback:
              'Incorrect. Large public sector wage increases raise government spending and can trigger wage-price spirals, embedding inflation further into the economy.',
            indicatorChanges: {
              inflation: 0.8,
              debtToGdp: 3,
              marketConfidence: -4,
              unemployment: -0.1,
            },
          },
        ],
      },
      {
        stepNumber: 3,
        question: 'Unemployment has risen as the economy slows. How do you address the labour market?',
        choices: [
          {
            id: 'a',
            label: 'Government-funded retraining programmes',
            isCorrect: true,
            feedback:
              'Correct. Retraining programmes improve the supply side of the labour market, helping workers transition into new sectors. This reduces structural unemployment without adding to inflationary demand pressure.',
            indicatorChanges: {
              unemployment: -0.4,
              gdpGrowth: 0.3,
              marketConfidence: 6,
              debtToGdp: 1,
            },
          },
          {
            id: 'b',
            label: 'Increase unemployment benefits permanently',
            isCorrect: false,
            feedback:
              'Incorrect. Permanently higher benefits increase the replacement ratio, reducing the incentive to seek work and potentially raising structural unemployment over time.',
            indicatorChanges: {
              debtToGdp: 3,
              marketConfidence: -5,
              unemployment: 0.2,
            },
          },
          {
            id: 'c',
            label: 'Nationalise major industries',
            isCorrect: false,
            feedback:
              'Incorrect. Nationalisation is a drastic structural intervention that reduces market confidence, increases government debt, and does not address the cyclical unemployment caused by the inflation shock.',
            indicatorChanges: {
              marketConfidence: -12,
              debtToGdp: 5,
              gdpGrowth: -0.5,
            },
          },
          {
            id: 'd',
            label: 'Introduce price controls',
            isCorrect: false,
            feedback:
              'Incorrect. Price controls create shortages, distort market signals, and do not address the underlying causes of inflation. They damage business confidence and reduce investment.',
            indicatorChanges: {
              inflation: -0.5,
              marketConfidence: -10,
              gdpGrowth: -0.8,
              bankingStability: -5,
            },
          },
        ],
      },
      {
        stepNumber: 4,
        question: 'The economy is stabilising. What long-term policy do you implement to sustain recovery?',
        choices: [
          {
            id: 'a',
            label: 'Incentives for business investment and productivity',
            isCorrect: true,
            feedback:
              'Correct. Supply-side incentives for investment and productivity boost long-run aggregate supply, supporting non-inflationary growth. This is the appropriate long-term response after an inflation shock.',
            indicatorChanges: {
              gdpGrowth: 0.8,
              unemployment: -0.3,
              marketConfidence: 10,
              inflation: -0.3,
            },
          },
          {
            id: 'b',
            label: 'Restart Quantitative Easing',
            isCorrect: false,
            feedback:
              'Incorrect. Restarting QE while inflation is still above target risks reigniting price pressures. It sends a confusing signal to markets about the central bank\'s commitment to price stability.',
            indicatorChanges: {
              inflation: 0.9,
              marketConfidence: -8,
              gdpGrowth: 0.3,
            },
          },
          {
            id: 'c',
            label: 'Large increase in government borrowing',
            isCorrect: false,
            feedback:
              'Incorrect. Increasing borrowing at this stage raises debt-to-GDP and risks undermining the fiscal credibility needed to sustain recovery. Markets would react negatively.',
            indicatorChanges: {
              debtToGdp: 7,
              marketConfidence: -9,
              inflation: 0.5,
            },
          },
          {
            id: 'd',
            label: 'Artificially cap interest rates',
            isCorrect: false,
            feedback:
              'Incorrect. Capping interest rates removes the central bank\'s ability to respond to future inflationary pressures. It distorts credit markets and reduces the effectiveness of monetary policy.',
            indicatorChanges: {
              inflation: 0.7,
              marketConfidence: -11,
              bankingStability: -6,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'sovereign-debt-spiral',
    title: 'The Sovereign Debt Spiral',
    briefing:
      'Years of excessive government borrowing have pushed debt levels to unsustainable levels. Investors are demanding higher returns to hold government bonds, confidence is collapsing, and the currency is weakening. The banking sector is heavily exposed to public debt and financial stability is becoming a serious concern.',
    startingIndicators: {
      inflation: 4.5,
      unemployment: 5.5,
      gdpGrowth: 0.0,
      marketConfidence: 35,
      debtToGdp: 125,
      bankingStability: 55,
      policyRate: 3.0,
      currencyStrength: 40,
    },
    steps: [
      {
        stepNumber: 1,
        question: 'Bond markets are losing confidence. What is your immediate fiscal response?',
        choices: [
          {
            id: 'a',
            label: 'Credible spending reduction plan',
            isCorrect: true,
            feedback:
              'Correct. A credible fiscal consolidation plan signals to bond markets that the government is serious about reducing debt. Yields fall, confidence improves, and the currency stabilises. Short-term growth suffers but long-run sustainability is restored.',
            indicatorChanges: {
              debtToGdp: -6,
              marketConfidence: 15,
              currencyStrength: 10,
              gdpGrowth: -0.8,
              unemployment: 0.5,
            },
          },
          {
            id: 'b',
            label: 'Increase welfare spending',
            isCorrect: false,
            feedback:
              'Incorrect. Increasing welfare spending when debt is already at 125% of GDP worsens the fiscal position and accelerates the debt spiral. Bond markets react negatively.',
            indicatorChanges: {
              debtToGdp: 5,
              marketConfidence: -12,
              currencyStrength: -6,
              inflation: 0.5,
            },
          },
          {
            id: 'c',
            label: 'Large tax cuts',
            isCorrect: false,
            feedback:
              'Incorrect. Tax cuts reduce government revenue, worsening the deficit and increasing debt. This is the opposite of what is needed during a sovereign debt crisis.',
            indicatorChanges: {
              debtToGdp: 7,
              marketConfidence: -15,
              currencyStrength: -8,
              gdpGrowth: 0.2,
            },
          },
          {
            id: 'd',
            label: 'Major borrowing programme',
            isCorrect: false,
            feedback:
              'Incorrect. Borrowing more when debt is already unsustainable is catastrophic. Bond yields spike further, the currency collapses, and banking stability deteriorates sharply.',
            indicatorChanges: {
              debtToGdp: 10,
              marketConfidence: -20,
              currencyStrength: -10,
              bankingStability: -8,
            },
          },
        ],
      },
      {
        stepNumber: 2,
        question: 'Banks are heavily exposed to government bonds and are under pressure. How do you stabilise the banking sector?',
        choices: [
          {
            id: 'a',
            label: 'Emergency liquidity support for banks',
            isCorrect: true,
            feedback:
              'Correct. Emergency liquidity support prevents a banking crisis from compounding the sovereign debt problem. It stabilises the financial system and prevents a credit crunch that would deepen the recession.',
            indicatorChanges: {
              bankingStability: 12,
              marketConfidence: 8,
              gdpGrowth: 0.3,
              debtToGdp: 2,
            },
          },
          {
            id: 'b',
            label: 'Do nothing',
            isCorrect: false,
            feedback:
              'Incorrect. Inaction allows the banking crisis to deepen. Banks begin to fail, credit dries up, and the economy contracts sharply. Market confidence collapses further.',
            indicatorChanges: {
              bankingStability: -15,
              marketConfidence: -18,
              gdpGrowth: -1.5,
              unemployment: 1.2,
            },
          },
          {
            id: 'c',
            label: 'Increase pensions',
            isCorrect: false,
            feedback:
              'Incorrect. Increasing pensions does nothing to address banking sector stress and worsens the fiscal position, adding to the debt spiral.',
            indicatorChanges: {
              debtToGdp: 3,
              marketConfidence: -6,
              bankingStability: -3,
            },
          },
          {
            id: 'd',
            label: 'Introduce price ceilings',
            isCorrect: false,
            feedback:
              'Incorrect. Price ceilings do not address banking sector stress. They distort markets, reduce investment, and damage business confidence without stabilising the financial system.',
            indicatorChanges: {
              marketConfidence: -8,
              gdpGrowth: -0.5,
              bankingStability: -4,
            },
          },
        ],
      },
      {
        stepNumber: 3,
        question: 'The economy is stagnating. How do you stimulate growth without worsening the debt position?',
        choices: [
          {
            id: 'a',
            label: 'Targeted infrastructure investment',
            isCorrect: true,
            feedback:
              'Correct. Targeted infrastructure investment improves long-run productive capacity and can generate returns that justify the spending. It supports growth without the broad demand stimulus that would worsen inflation or debt.',
            indicatorChanges: {
              gdpGrowth: 0.6,
              unemployment: -0.4,
              marketConfidence: 7,
              debtToGdp: 2,
            },
          },
          {
            id: 'b',
            label: 'Increase VAT significantly',
            isCorrect: false,
            feedback:
              'Incorrect. A large VAT increase reduces consumer spending and worsens the recession. While it raises revenue, the contractionary effect on growth is severe and politically damaging.',
            indicatorChanges: {
              gdpGrowth: -1.0,
              unemployment: 0.8,
              inflation: 0.6,
              marketConfidence: -5,
            },
          },
          {
            id: 'c',
            label: 'Reduce exports through tariffs',
            isCorrect: false,
            feedback:
              'Incorrect. Tariffs that reduce exports damage the current account, weaken the currency further, and reduce GDP. This is counterproductive during a debt crisis.',
            indicatorChanges: {
              gdpGrowth: -0.7,
              currencyStrength: -5,
              marketConfidence: -8,
            },
          },
          {
            id: 'd',
            label: 'Raise interest rates',
            isCorrect: false,
            feedback:
              'Incorrect. Raising interest rates during a debt crisis increases the cost of servicing existing debt, worsening the fiscal position and deepening the recession.',
            indicatorChanges: {
              debtToGdp: 4,
              gdpGrowth: -0.8,
              unemployment: 0.6,
              policyRate: 1.5,
            },
          },
        ],
      },
      {
        stepNumber: 4,
        question: 'Stability is returning. What long-term strategy do you adopt to prevent a future debt crisis?',
        choices: [
          {
            id: 'a',
            label: 'Long-term debt reduction strategy',
            isCorrect: true,
            feedback:
              'Correct. A credible long-term debt reduction strategy — combining fiscal discipline with growth-enhancing reforms — restores market confidence sustainably. It signals that the government is committed to fiscal responsibility over the long run.',
            indicatorChanges: {
              debtToGdp: -8,
              marketConfidence: 14,
              currencyStrength: 8,
              gdpGrowth: 0.4,
            },
          },
          {
            id: 'b',
            label: 'New borrowing-funded stimulus',
            isCorrect: false,
            feedback:
              'Incorrect. Returning to borrowing-funded stimulus after a debt crisis immediately undermines the credibility gained. Bond markets would react negatively and yields would rise again.',
            indicatorChanges: {
              debtToGdp: 8,
              marketConfidence: -14,
              currencyStrength: -7,
              inflation: 0.6,
            },
          },
          {
            id: 'c',
            label: 'Permanent subsidies to all industries',
            isCorrect: false,
            feedback:
              'Incorrect. Permanent broad subsidies are fiscally unsustainable and distort market allocation of resources. They increase government spending without improving long-run productivity.',
            indicatorChanges: {
              debtToGdp: 6,
              marketConfidence: -10,
              gdpGrowth: 0.2,
            },
          },
          {
            id: 'd',
            label: 'Unlimited Quantitative Easing',
            isCorrect: false,
            feedback:
              'Incorrect. Unlimited QE monetises the debt, risking hyperinflation and a complete collapse of currency credibility. This is the most dangerous option available.',
            indicatorChanges: {
              inflation: 2.5,
              marketConfidence: -18,
              currencyStrength: -12,
              bankingStability: -5,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'housing-bubble-collapse',
    title: 'The Housing Bubble Collapse',
    briefing:
      'A decade of cheap credit fuelled a massive housing boom. House prices rose far beyond sustainable levels and banks became increasingly exposed to risky mortgage lending. The bubble has now burst. Property prices are falling rapidly, banks are under pressure, and consumer confidence has collapsed.',
    startingIndicators: {
      inflation: 2.0,
      unemployment: 4.0,
      gdpGrowth: 2.5,
      marketConfidence: 60,
      debtToGdp: 80,
      bankingStability: 35,
      policyRate: 4.0,
      currencyStrength: 55,
    },
    steps: [
      {
        stepNumber: 1,
        question: 'Banks are under severe stress from falling house prices. What is your immediate response?',
        choices: [
          {
            id: 'a',
            label: 'Emergency liquidity injections',
            isCorrect: true,
            feedback:
              'Correct. Emergency liquidity injections prevent a banking crisis from spiralling into a full financial collapse. By providing banks with short-term funding, you prevent a credit crunch that would devastate the broader economy.',
            indicatorChanges: {
              bankingStability: 15,
              marketConfidence: 12,
              gdpGrowth: 0.3,
              debtToGdp: 3,
            },
          },
          {
            id: 'b',
            label: 'Increase interest rates',
            isCorrect: false,
            feedback:
              'Incorrect. Raising interest rates during a housing collapse increases mortgage costs, accelerating defaults and deepening the banking crisis. This is exactly the wrong monetary policy response.',
            indicatorChanges: {
              bankingStability: -10,
              gdpGrowth: -1.2,
              unemployment: 0.8,
              marketConfidence: -12,
              policyRate: 1.5,
            },
          },
          {
            id: 'c',
            label: 'Increase corporation tax',
            isCorrect: false,
            feedback:
              'Incorrect. Raising corporation tax reduces business investment and profits, worsening the economic downturn without addressing the banking sector stress at the heart of the crisis.',
            indicatorChanges: {
              gdpGrowth: -0.8,
              marketConfidence: -10,
              unemployment: 0.5,
            },
          },
          {
            id: 'd',
            label: 'Reduce government spending',
            isCorrect: false,
            feedback:
              'Incorrect. Fiscal austerity during a financial crisis reduces aggregate demand and deepens the recession. It does nothing to stabilise the banking sector.',
            indicatorChanges: {
              gdpGrowth: -1.0,
              unemployment: 0.7,
              marketConfidence: -8,
              debtToGdp: -2,
            },
          },
        ],
      },
      {
        stepNumber: 2,
        question: 'Consumer spending has collapsed and the economy is contracting. What monetary policy do you implement?',
        choices: [
          {
            id: 'a',
            label: 'Significant interest rate reduction',
            isCorrect: true,
            feedback:
              'Correct. Cutting interest rates reduces mortgage costs, eases the burden on indebted households, and stimulates borrowing and investment. This is the appropriate monetary response to a demand-side collapse.',
            indicatorChanges: {
              gdpGrowth: 0.8,
              marketConfidence: 10,
              unemployment: -0.3,
              inflation: 0.4,
              policyRate: -2.0,
              currencyStrength: -5,
            },
          },
          {
            id: 'b',
            label: 'Increase VAT',
            isCorrect: false,
            feedback:
              'Incorrect. Raising VAT reduces consumer spending further, deepening the recession. This is a procyclical fiscal policy that worsens the downturn.',
            indicatorChanges: {
              gdpGrowth: -0.9,
              unemployment: 0.6,
              inflation: 0.5,
              marketConfidence: -8,
            },
          },
          {
            id: 'c',
            label: 'Reduce exports',
            isCorrect: false,
            feedback:
              'Incorrect. Reducing exports through tariffs or restrictions damages the current account and reduces GDP. This worsens the economic contraction.',
            indicatorChanges: {
              gdpGrowth: -0.6,
              currencyStrength: -4,
              marketConfidence: -7,
            },
          },
          {
            id: 'd',
            label: 'Tighten monetary policy',
            isCorrect: false,
            feedback:
              'Incorrect. Tightening monetary policy during a housing collapse and recession is a serious error. Higher rates increase mortgage defaults, worsen banking stress, and deepen the downturn.',
            indicatorChanges: {
              bankingStability: -8,
              gdpGrowth: -1.1,
              unemployment: 0.9,
              marketConfidence: -10,
              policyRate: 1.0,
            },
          },
        ],
      },
      {
        stepNumber: 3,
        question: 'Interest rates are low but credit is still tight. How do you further stimulate the economy?',
        choices: [
          {
            id: 'a',
            label: 'Quantitative Easing',
            isCorrect: true,
            feedback:
              'Correct. When interest rates are already low, QE provides additional monetary stimulus by purchasing financial assets, increasing liquidity, and encouraging lending. It is the appropriate unconventional monetary tool in this situation.',
            indicatorChanges: {
              gdpGrowth: 0.7,
              marketConfidence: 9,
              bankingStability: 8,
              inflation: 0.5,
              currencyStrength: -4,
            },
          },
          {
            id: 'b',
            label: 'Fiscal austerity',
            isCorrect: false,
            feedback:
              'Incorrect. Austerity during a recession reduces aggregate demand and deepens the downturn. The fiscal multiplier works in reverse — spending cuts contract the economy further.',
            indicatorChanges: {
              gdpGrowth: -1.2,
              unemployment: 0.9,
              marketConfidence: -7,
              debtToGdp: -3,
            },
          },
          {
            id: 'c',
            label: 'Increase income tax',
            isCorrect: false,
            feedback:
              'Incorrect. Raising income tax reduces household disposable income, cutting consumer spending and deepening the recession. This is the wrong fiscal response during a downturn.',
            indicatorChanges: {
              gdpGrowth: -0.8,
              unemployment: 0.5,
              marketConfidence: -6,
            },
          },
          {
            id: 'd',
            label: 'Raise interest rates',
            isCorrect: false,
            feedback:
              'Incorrect. Raising rates when the economy is already in recession and banks are under stress is deeply counterproductive. It increases the cost of borrowing and worsens the credit crunch.',
            indicatorChanges: {
              bankingStability: -7,
              gdpGrowth: -1.0,
              unemployment: 0.7,
              policyRate: 1.5,
              marketConfidence: -9,
            },
          },
        ],
      },
      {
        stepNumber: 4,
        question: 'The economy is recovering. What structural reform do you implement to prevent a future housing bubble?',
        choices: [
          {
            id: 'a',
            label: 'Stronger mortgage lending regulation',
            isCorrect: true,
            feedback:
              'Correct. Tighter mortgage regulation — such as loan-to-value limits and affordability checks — prevents excessive risk-taking by banks and households. This addresses the root cause of the housing bubble without distorting the broader economy.',
            indicatorChanges: {
              bankingStability: 12,
              marketConfidence: 10,
              gdpGrowth: 0.3,
              debtToGdp: -1,
            },
          },
          {
            id: 'b',
            label: 'Remove lending restrictions',
            isCorrect: false,
            feedback:
              'Incorrect. Removing lending restrictions after a housing bubble collapse recreates the conditions for the next bubble. Banks would return to reckless lending, building up systemic risk again.',
            indicatorChanges: {
              bankingStability: -10,
              marketConfidence: -8,
              gdpGrowth: 0.5,
              debtToGdp: 3,
            },
          },
          {
            id: 'c',
            label: 'Subsidise speculative property purchases',
            isCorrect: false,
            feedback:
              'Incorrect. Subsidising speculative property purchases re-inflates the housing bubble. This is precisely the behaviour that caused the crisis in the first place.',
            indicatorChanges: {
              bankingStability: -8,
              debtToGdp: 4,
              marketConfidence: -6,
              inflation: 0.4,
            },
          },
          {
            id: 'd',
            label: 'Encourage higher household debt',
            isCorrect: false,
            feedback:
              'Incorrect. Encouraging households to take on more debt after a debt-driven crisis is extremely dangerous. It rebuilds the financial fragility that caused the collapse.',
            indicatorChanges: {
              bankingStability: -9,
              marketConfidence: -10,
              debtToGdp: 5,
              gdpGrowth: 0.3,
            },
          },
        ],
      },
    ],
  },
];

// ─── Indicator Config ─────────────────────────────────────────────────────────

interface IndicatorConfig {
  key: keyof EconomicIndicators;
  label: string;
  unit: string;
  goodDirection: 'up' | 'down' | 'mid';
  decimals: number;
}

const INDICATOR_CONFIGS: IndicatorConfig[] = [
  { key: 'inflation', label: 'Inflation', unit: '%', goodDirection: 'down', decimals: 1 },
  { key: 'unemployment', label: 'Unemployment', unit: '%', goodDirection: 'down', decimals: 1 },
  { key: 'gdpGrowth', label: 'GDP Growth', unit: '%', goodDirection: 'up', decimals: 1 },
  { key: 'marketConfidence', label: 'Market Confidence', unit: '/100', goodDirection: 'up', decimals: 0 },
  { key: 'debtToGdp', label: 'Debt/GDP', unit: '%', goodDirection: 'down', decimals: 0 },
  { key: 'bankingStability', label: 'Banking Stability', unit: '/100', goodDirection: 'up', decimals: 0 },
  { key: 'policyRate', label: 'Policy Rate', unit: '%', goodDirection: 'mid', decimals: 1 },
  { key: 'currencyStrength', label: 'Currency Strength', unit: '/100', goodDirection: 'up', decimals: 0 },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

function applyIndicatorChanges(
  current: EconomicIndicators,
  changes: Partial<EconomicIndicators>
): EconomicIndicators {
  const next = { ...current };
  for (const key of Object.keys(changes) as (keyof EconomicIndicators)[]) {
    if (changes[key] !== undefined) {
      next[key] = parseFloat((current[key] + (changes[key] as number)).toFixed(2));
    }
  }
  return next;
}

function getPerformanceRating(hp: number): { label: string; color: string } {
  if (hp === 400) return { label: 'Master Economist', color: 'text-emerald-400' };
  if (hp >= 300) return { label: 'Senior Policy Adviser', color: 'text-blue-400' };
  if (hp >= 200) return { label: 'Economic Analyst', color: 'text-amber-400' };
  return { label: 'Policy Apprentice', color: 'text-red-400' };
}

// ─── Indicator Panel Component ────────────────────────────────────────────────

function IndicatorPanel({
  indicators,
  baseline,
  prevIndicators,
}: {
  indicators: EconomicIndicators;
  baseline: EconomicIndicators;
  prevIndicators: EconomicIndicators | null;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Economic Indicators</h3>
        <div className="flex items-center gap-3 text-xs text-zinc-600">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500/60 inline-block" />
            Improved
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500/60 inline-block" />
            Worsened
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {INDICATOR_CONFIGS.map((cfg) => {
          const val = indicators[cfg.key];
          const prev = prevIndicators ? prevIndicators[cfg.key] : null;
          const base = baseline[cfg.key];
          const stepDelta = prev !== null ? parseFloat((val - prev).toFixed(2)) : 0;
          const hasChange = prev !== null && Math.abs(stepDelta) >= 0.01;
          const baselineDelta = parseFloat((val - base).toFixed(2));

          let flashClass = 'bg-zinc-800/60 border-zinc-700/50';
          let valueColor = 'text-zinc-100';
          let deltaColor = 'text-zinc-600';

          if (hasChange) {
            const isGood =
              cfg.goodDirection === 'up'
                ? stepDelta > 0
                : cfg.goodDirection === 'down'
                ? stepDelta < 0
                : null;
            if (isGood === true) {
              flashClass = 'bg-emerald-500/10 border-emerald-500/30';
              valueColor = 'text-emerald-400';
              deltaColor = 'text-emerald-400';
            } else if (isGood === false) {
              flashClass = 'bg-red-500/10 border-red-500/30';
              valueColor = 'text-red-400';
              deltaColor = 'text-red-400';
            } else {
              deltaColor = 'text-zinc-400';
            }
          }

          const baselineDeltaColor =
            Math.abs(baselineDelta) < 0.01
              ? 'text-zinc-700'
              : cfg.goodDirection === 'up'
              ? baselineDelta > 0
                ? 'text-emerald-500/60' :'text-red-500/60'
              : cfg.goodDirection === 'down'
              ? baselineDelta < 0
                ? 'text-emerald-500/60' :'text-red-500/60' :'text-zinc-500';

          return (
            <div
              key={cfg.key}
              className={`rounded-lg border p-3 transition-all duration-500 ${flashClass}`}
            >
              <p className="text-xs text-zinc-500 mb-1 leading-none">{cfg.label}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className={`text-xl font-bold font-mono tabular-nums ${valueColor}`}>
                  {val.toFixed(cfg.decimals)}
                </span>
                <span className="text-xs text-zinc-600">{cfg.unit}</span>
              </div>
              {hasChange && (
                <div className={`flex items-center gap-0.5 text-xs font-mono font-semibold ${deltaColor}`}>
                  {stepDelta > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  <span>
                    {stepDelta > 0 ? '+' : ''}
                    {stepDelta.toFixed(cfg.decimals)}
                    {cfg.unit === '/100' ? '' : cfg.unit}
                  </span>
                </div>
              )}
              <div className={`text-xs font-mono ${baselineDeltaColor}`}>
                {Math.abs(baselineDelta) < 0.01 ? (
                  <span className="text-zinc-700">— vs start</span>
                ) : (
                  <span>
                    {baselineDelta > 0 ? '+' : ''}
                    {baselineDelta.toFixed(cfg.decimals)}
                    {cfg.unit === '/100' ? '' : cfg.unit} vs start
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Crisis Overview Component ────────────────────────────────────────────────

function CrisisOverview({
  crisis,
  stepRecords,
  totalHp,
  onReturn,
}: {
  crisis: CrisisData;
  stepRecords: StepRecord[];
  totalHp: number;
  onReturn: () => void;
}) {
  const rating = getPerformanceRating(totalHp);
  const finalIndicators = stepRecords[stepRecords.length - 1]?.indicatorsAfter ?? crisis.startingIndicators;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-medium uppercase tracking-wide">
          Crisis Complete
        </div>
        <h1 className="text-3xl font-bold text-zinc-100">{crisis.title}</h1>
        <p className="text-zinc-500 text-sm">Crisis Overview</p>
      </div>

      {/* Final HP + Rating */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center space-y-2">
        <p className="text-xs text-zinc-500 uppercase tracking-widest">Final Score</p>
        <div className="text-5xl font-black font-mono text-zinc-100">
          {totalHp} <span className="text-2xl text-zinc-500">/ 400 HP</span>
        </div>
        <div className={`text-lg font-bold ${rating.color}`}>{rating.label}</div>
        <div className="mt-3 grid grid-cols-4 gap-2 text-xs text-zinc-600">
          <div className={`p-2 rounded-lg border ${totalHp === 400 ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400' : 'border-zinc-800'}`}>
            <div className="font-bold text-sm">400 HP</div>
            <div>Master Economist</div>
          </div>
          <div className={`p-2 rounded-lg border ${totalHp >= 300 && totalHp < 400 ? 'border-blue-500/30 bg-blue-500/5 text-blue-400' : 'border-zinc-800'}`}>
            <div className="font-bold text-sm">300–399</div>
            <div>Senior Policy Adviser</div>
          </div>
          <div className={`p-2 rounded-lg border ${totalHp >= 200 && totalHp < 300 ? 'border-amber-500/30 bg-amber-500/5 text-amber-400' : 'border-zinc-800'}`}>
            <div className="font-bold text-sm">200–299</div>
            <div>Economic Analyst</div>
          </div>
          <div className={`p-2 rounded-lg border ${totalHp < 200 ? 'border-red-500/30 bg-red-500/5 text-red-400' : 'border-zinc-800'}`}>
            <div className="font-bold text-sm">0–199</div>
            <div>Policy Apprentice</div>
          </div>
        </div>
      </div>

      {/* Crisis Summary */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-2">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">Crisis Summary</h2>
        <p className="text-sm text-zinc-400 leading-relaxed">{crisis.briefing}</p>
      </div>

      {/* Player Decisions */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">Your Decisions</h2>
        <div className="space-y-2">
          {stepRecords.map((record) => (
            <div
              key={record.stepNumber}
              className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                {record.stepNumber}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-200">{record.chosenLabel}</p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-1.5">
                {record.wasCorrectFirstAttempt ? (
                  <CheckCircle size={14} className="text-emerald-400" />
                ) : (
                  <XCircle size={14} className="text-red-400" />
                )}
                <span className={`text-xs font-mono font-bold ${record.hpEarned > 0 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  +{record.hpEarned} HP
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Economic Outcome */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">Economic Outcome</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {INDICATOR_CONFIGS.map((cfg) => {
            const start = crisis.startingIndicators[cfg.key];
            const end = finalIndicators[cfg.key];
            const delta = parseFloat((end - start).toFixed(2));
            const isGood =
              cfg.goodDirection === 'up'
                ? delta > 0
                : cfg.goodDirection === 'down'
                ? delta < 0
                : null;
            let deltaColor =
              isGood === true
                ? 'text-emerald-400'
                : isGood === false
                ? 'text-red-400' :'text-zinc-400';

            return (
              <div key={cfg.key} className="bg-zinc-800/50 rounded-lg border border-zinc-700/50 p-3">
                <p className="text-xs text-zinc-500 mb-1">{cfg.label}</p>
                <div className="flex items-center gap-1 font-mono text-xs">
                  <span className="text-zinc-500">{start.toFixed(cfg.decimals)}{cfg.unit === '/100' ? '' : cfg.unit}</span>
                  <span className="text-zinc-700">→</span>
                  <span className="text-zinc-200 font-semibold">{end.toFixed(cfg.decimals)}{cfg.unit === '/100' ? '' : cfg.unit}</span>
                </div>
                {Math.abs(delta) >= 0.01 && (
                  <div className={`text-xs font-mono font-semibold mt-0.5 flex items-center gap-0.5 ${deltaColor}`}>
                    {delta > 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                    {delta > 0 ? '+' : ''}{delta.toFixed(cfg.decimals)}{cfg.unit === '/100' ? '' : cfg.unit}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Return Button */}
      <div className="text-center">
        <button
          onClick={onReturn}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-xl transition-all text-sm"
        >
          <RefreshCw size={14} />
          Return to Crisis Lab
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Screen = 'lobby' | 'simulation' | 'overview';

export default function CrisisLabPage() {
  const [screen, setScreen] = useState<Screen>('lobby');
  const [activeCrisis, setActiveCrisis] = useState<CrisisData | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [indicators, setIndicators] = useState<EconomicIndicators | null>(null);
  const [prevIndicators, setPrevIndicators] = useState<EconomicIndicators | null>(null);
  const [stepRecords, setStepRecords] = useState<StepRecord[]>([]);
  const [totalHp, setTotalHp] = useState(0);

  // Per-step state
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);
  const [stepHadWrongAttempt, setStepHadWrongAttempt] = useState(false);
  const [stepConfirmed, setStepConfirmed] = useState(false);

  const startCrisis = (crisis: CrisisData) => {
    setActiveCrisis(crisis);
    setCurrentStepIndex(0);
    setIndicators({ ...crisis.startingIndicators });
    setPrevIndicators(null);
    setStepRecords([]);
    setTotalHp(0);
    setSelectedChoice(null);
    setFeedback(null);
    setStepHadWrongAttempt(false);
    setStepConfirmed(false);
    setScreen('simulation');
  };

  const generateRandomCrisis = () => {
    const idx = Math.floor(Math.random() * CRISES.length);
    startCrisis(CRISES[idx]);
  };

  const handleChoiceSelect = (choiceId: string) => {
    if (stepConfirmed) return;
    setSelectedChoice(choiceId);
    setFeedback(null);
  };

  const handleConfirm = () => {
    if (!selectedChoice || !activeCrisis || !indicators) return;
    const step = activeCrisis.steps[currentStepIndex];
    const choice = step.choices.find((c) => c.id === selectedChoice);
    if (!choice) return;

    if (!choice.isCorrect) {
      // Wrong answer — show feedback, allow retry
      setStepHadWrongAttempt(true);
      setFeedback({ text: choice.feedback, isCorrect: false });
      setSelectedChoice(null);
      return;
    }

    // Correct answer
    const hpEarned = stepHadWrongAttempt ? 0 : 100;
    const indicatorsBefore = { ...indicators };
    const indicatorsAfter = applyIndicatorChanges(indicators, choice.indicatorChanges);

    const record: StepRecord = {
      stepNumber: step.stepNumber,
      chosenLabel: choice.label,
      wasCorrectFirstAttempt: !stepHadWrongAttempt,
      hpEarned,
      indicatorsBefore,
      indicatorsAfter,
    };

    const newRecords = [...stepRecords, record];
    const newHp = totalHp + hpEarned;

    setPrevIndicators(indicatorsBefore);
    setIndicators(indicatorsAfter);
    setStepRecords(newRecords);
    setTotalHp(newHp);
    setFeedback({ text: choice.feedback, isCorrect: true });
    setStepConfirmed(true);

    // After Step 4, go to overview
    if (currentStepIndex === 3) {
      setTimeout(() => {
        setScreen('overview');
      }, 1800);
    } else {
      setTimeout(() => {
        setCurrentStepIndex((i) => i + 1);
        setSelectedChoice(null);
        setFeedback(null);
        setStepHadWrongAttempt(false);
        setStepConfirmed(false);
      }, 1800);
    }
  };

  const handleReturn = () => {
    setScreen('lobby');
    setActiveCrisis(null);
    setIndicators(null);
    setPrevIndicators(null);
    setStepRecords([]);
    setTotalHp(0);
    setSelectedChoice(null);
    setFeedback(null);
    setStepHadWrongAttempt(false);
    setStepConfirmed(false);
    setCurrentStepIndex(0);
  };

  // ── Overview Screen ──
  if (screen === 'overview' && activeCrisis) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-zinc-950">
          <CrisisOverview
            crisis={activeCrisis}
            stepRecords={stepRecords}
            totalHp={totalHp}
            onReturn={handleReturn}
          />
        </div>
      </AppLayout>
    );
  }

  // ── Simulation Screen ──
  if (screen === 'simulation' && activeCrisis && indicators) {
    const step = activeCrisis.steps[currentStepIndex];

    return (
      <AppLayout>
        <div className="min-h-screen bg-zinc-950">
          <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReturn}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  ← Crisis Lab
                </button>
                <div className="w-px h-4 bg-zinc-700" />
                <div>
                  <h1 className="text-lg font-bold text-zinc-100 leading-none">{activeCrisis.title}</h1>
                  <p className="text-xs text-zinc-500 mt-0.5">Step {currentStepIndex + 1} of 4</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* HP display */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg">
                  <span className="text-xs text-zinc-500">HP</span>
                  <span className="text-sm font-bold font-mono text-emerald-400">{totalHp}</span>
                  <span className="text-xs text-zinc-600">/ {(currentStepIndex) * 100} max so far</span>
                </div>
                {/* Step progress */}
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`w-6 h-1.5 rounded-full transition-all ${
                        i < currentStepIndex
                          ? 'bg-emerald-500'
                          : i === currentStepIndex
                          ? 'bg-emerald-400 animate-pulse' :'bg-zinc-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              {/* Left: Briefing + Decision */}
              <div className="xl:col-span-1 space-y-4">
                {/* Briefing (only on step 1) */}
                {currentStepIndex === 0 && (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle size={14} className="text-amber-400" />
                      <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Crisis Briefing</h2>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">{activeCrisis.briefing}</p>
                  </div>
                )}

                {/* Decision Panel */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">
                      Step {step.stepNumber} — Decision
                    </h2>
                    <span className="text-xs text-zinc-600 font-mono">4 options</span>
                  </div>
                  <p className="text-sm text-zinc-300 font-medium leading-snug">{step.question}</p>

                  {/* Feedback banner */}
                  {feedback && (
                    <div
                      className={`rounded-lg border p-3 text-xs leading-relaxed ${
                        feedback.isCorrect
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' :'bg-red-500/10 border-red-500/30 text-red-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 font-semibold">
                        {feedback.isCorrect ? (
                          <><CheckCircle size={12} /> Correct</>
                        ) : (
                          <><XCircle size={12} /> Incorrect — try again</>
                        )}
                      </div>
                      {feedback.text}
                    </div>
                  )}

                  {/* Choices */}
                  <div className="space-y-2">
                    {step.choices.map((choice) => {
                      const isSelected = selectedChoice === choice.id;
                      return (
                        <button
                          key={choice.id}
                          onClick={() => handleChoiceSelect(choice.id)}
                          disabled={stepConfirmed}
                          className={`w-full text-left rounded-lg border p-3 transition-all duration-150 ${
                            isSelected
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-zinc-100' :'bg-zinc-800/50 border-zinc-700/60 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                          } ${stepConfirmed ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div
                              className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                isSelected ? 'border-emerald-400 bg-emerald-400' : 'border-zinc-600'
                              }`}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="text-sm font-medium">{choice.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleConfirm}
                    disabled={!selectedChoice || stepConfirmed}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      selectedChoice && !stepConfirmed
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950' :'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700'
                    }`}
                  >
                    {stepConfirmed ? (
                      feedback?.isCorrect ? (
                        currentStepIndex === 3 ? 'Completing crisis...' : 'Advancing...'
                      ) : (
                        'Implementing...'
                      )
                    ) : (
                      <>
                        <ChevronRight size={14} />
                        Confirm Decision
                      </>
                    )}
                  </button>

                  {stepHadWrongAttempt && !stepConfirmed && (
                    <p className="text-xs text-amber-400/70 text-center">
                      ⚠ A wrong attempt was made — this step will award 0 HP
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Indicators */}
              <div className="xl:col-span-2">
                <IndicatorPanel
                  indicators={indicators}
                  baseline={activeCrisis.startingIndicators}
                  prevIndicators={prevIndicators}
                />

                {/* Step history */}
                {stepRecords.length > 0 && (
                  <div className="mt-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
                    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Decision History</h3>
                    {stepRecords.map((r) => (
                      <div key={r.stepNumber} className="flex items-center gap-3 text-xs">
                        <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold flex-shrink-0">
                          {r.stepNumber}
                        </span>
                        <span className="text-zinc-400 flex-1">{r.chosenLabel}</span>
                        <span className={`font-mono font-bold ${r.hpEarned > 0 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                          +{r.hpEarned} HP
                        </span>
                        {r.wasCorrectFirstAttempt ? (
                          <CheckCircle size={12} className="text-emerald-400" />
                        ) : (
                          <XCircle size={12} className="text-red-400" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // ── Lobby Screen ──
  return (
    <AppLayout>
      <div className="min-h-screen bg-zinc-950">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-8 py-8 space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <Cpu size={20} className="text-emerald-400" />
                </div>
                <h1 className="text-2xl font-bold text-zinc-100">Crisis Lab</h1>
              </div>
              <p className="text-sm text-zinc-500">
                Step into the hot seat. Make policy decisions under pressure and watch economic indicators respond in real time.
              </p>
            </div>
            <button
              onClick={generateRandomCrisis}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-semibold rounded-xl transition-all active:scale-95"
            >
              <Zap size={14} />
              Generate Crisis
            </button>
          </div>

          {/* Crisis Cards */}
          <div className="space-y-4">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">Available Simulations</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CRISES.map((crisis) => (
                <button
                  key={crisis.id}
                  onClick={() => startCrisis(crisis)}
                  className="text-left bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/80 rounded-2xl p-5 transition-all duration-150 group space-y-3"
                >
                  <div>
                    <h3 className="text-base font-bold text-zinc-100 group-hover:text-white mb-1">
                      {crisis.title}
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3">{crisis.briefing}</p>
                  </div>

                  {/* Starting indicators preview */}
                  <div className="pt-3 border-t border-zinc-800 grid grid-cols-2 gap-2">
                    {[
                      { label: 'Inflation', value: `${crisis.startingIndicators.inflation}%` },
                      { label: 'GDP Growth', value: `${crisis.startingIndicators.gdpGrowth}%` },
                      { label: 'Confidence', value: `${crisis.startingIndicators.marketConfidence}/100` },
                      { label: 'Banking', value: `${crisis.startingIndicators.bankingStability}/100` },
                    ].map((ind) => (
                      <div key={ind.label} className="flex items-center justify-between">
                        <span className="text-xs text-zinc-600">{ind.label}</span>
                        <span className="text-xs font-mono font-semibold text-zinc-300">{ind.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-600">4 steps · 4 choices each</span>
                    <span className="text-emerald-400 font-medium group-hover:translate-x-0.5 transition-transform">
                      Start →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* HP Rules */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">How Scoring Works</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-500">
              <div className="flex items-start gap-2">
                <CheckCircle size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-300 mb-0.5">Correct first attempt</p>
                  <p>+100 HP awarded for the step</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <XCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-300 mb-0.5">Any wrong attempt</p>
                  <p>Step permanently awards 0 HP, even if you later select the correct answer</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Minus size={14} className="text-zinc-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-300 mb-0.5">Maximum score</p>
                  <p>400 HP (4 steps × 100 HP each)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
