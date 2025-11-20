import { ModelConfig } from '../types';

export const MODELS: Record<string, ModelConfig> = {
  'gemini-2-5-pro': {
    name: 'Gemini 2.5 Pro',
    description: 'Most capable, slower, lower rate limits',
    modelId: 'gemini-2.5-pro',
    tiers: {
      free: { rpm: 2, tpm: 125000, rpd: 50 },
      tier1: { rpm: 150, tpm: 2000000, rpd: 10000 },
      tier2: { rpm: 1000, tpm: 5000000, rpd: 50000 },
      tier3: { rpm: 2000, tpm: 8000000, rpd: -1 },
    }
  },
  'gemini-2-5-flash': {
    name: 'Gemini 2.5 Flash',
    description: 'Balanced performance (Recommended)',
    modelId: 'gemini-2.5-flash',
    tiers: {
      free: { rpm: 10, tpm: 250000, rpd: 250 },
      tier1: { rpm: 1000, tpm: 1000000, rpd: 10000 },
      tier2: { rpm: 2000, tpm: 3000000, rpd: 100000 },
      tier3: { rpm: 10000, tpm: 8000000, rpd: -1 },
    }
  },
  'gemini-2-5-flash-lite': {
    name: 'Gemini 2.5 Flash-Lite',
    description: 'Fastest, highest rate limits',
    modelId: 'gemini-2.5-flash-lite',
    tiers: {
      free: { rpm: 15, tpm: 250000, rpd: 1000 },
      tier1: { rpm: 4000, tpm: 4000000, rpd: -1 },
      tier2: { rpm: 10000, tpm: 10000000, rpd: -1 },
      tier3: { rpm: 30000, tpm: 30000000, rpd: -1 },
    }
  },
  'gemini-2-0-flash': {
    name: 'Gemini 2.0 Flash',
    description: 'High speed, good for high volume',
    modelId: 'gemini-2.0-flash',
    tiers: {
      free: { rpm: 15, tpm: 1000000, rpd: 200 },
      tier1: { rpm: 2000, tpm: 4000000, rpd: -1 },
      tier2: { rpm: 10000, tpm: 10000000, rpd: -1 },
      tier3: { rpm: 30000, tpm: 30000000, rpd: -1 },
    }
  },
  'gemini-2-0-flash-lite': {
    name: 'Gemini 2.0 Flash-Lite',
    description: 'Highest throughput',
    modelId: 'gemini-2.0-flash-lite',
    tiers: {
      free: { rpm: 30, tpm: 1000000, rpd: 200 },
      tier1: { rpm: 4000, tpm: 4000000, rpd: -1 },
      tier2: { rpm: 20000, tpm: 10000000, rpd: -1 },
      tier3: { rpm: 30000, tpm: 30000000, rpd: -1 },
    }
  },
};

export const TIER_OPTIONS = [
  { value: 'free', label: 'Free Tier' },
  { value: 'tier1', label: 'Tier 1 (Paid)' },
  { value: 'tier2', label: 'Tier 2 ($100+ spend)' },
  { value: 'tier3', label: 'Tier 3 ($500+ spend)' },
];

export const getModelRecommendation = (rowCount: number): string => {
  if (rowCount < 100) return 'Any model works well';
  if (rowCount < 500) return 'Flash or Flash-Lite recommended';
  return 'Flash-Lite or 2.0 Flash-Lite recommended';
};
