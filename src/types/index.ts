export interface ScoreValue {
  id: string;
  value: string;
  description: string;
}

export interface ContextColumn {
  column: string;
  description: string;
}

export interface EvaluationField {
  id: string;
  name: string;
  description: string;
  targetColumn: string;
  contextColumns: ContextColumn[];
  scoreValues: ScoreValue[];
}

export interface FileData {
  headers: string[];
  rows: Record<string, any>[];
  filename: string;
}

export interface ProcessingProgress {
  currentField: number;
  currentRow: number;
  totalRows: number;
  totalFields: number;
  startTime: number;
  successCount: number;
  errorCount: number;
  errors: Map<number, string>;
}

export type ModelProvider = 'google' | 'anthropic' | 'openai';

export interface ApiKeys {
  google?: string;
  anthropic?: string;
  openai?: string;
}

export interface ModelConfig {
  name: string;
  description: string;
  modelId: string;
  provider: ModelProvider;
  tiers: Record<string, RateLimits>;
}

export interface RateLimits {
  rpm: number;
  tpm: number;
  rpd: number;
}
