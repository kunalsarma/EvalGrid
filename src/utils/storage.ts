import { EvaluationField, FileData, ProcessingProgress } from '../types';

const STORAGE_KEYS = {
  API_KEY: 'evalgrid_api_key',
  SELECTED_MODEL: 'evalgrid_selected_model',
  SELECTED_TIER: 'evalgrid_selected_tier',
  FIELD_CONFIGS: 'evalgrid_field_configs',
  CURRENT_FILE: 'evalgrid_current_file',
  PROCESSING_PROGRESS: 'evalgrid_processing_progress',
};

// localStorage utilities
export const storage = {
  getApiKey: (): string => {
    return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
  },

  setApiKey: (key: string): void => {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key);
  },

  clearApiKey: (): void => {
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
  },

  getSelectedModel: (): string => {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL) || 'gemini-2-5-flash';
  },

  setSelectedModel: (model: string): void => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL, model);
  },

  getSelectedTier: (): string => {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_TIER) || 'free';
  },

  setSelectedTier: (tier: string): void => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_TIER, tier);
  },

  getFieldConfigs: (): EvaluationField[] => {
    const data = localStorage.getItem(STORAGE_KEYS.FIELD_CONFIGS);
    return data ? JSON.parse(data) : [];
  },

  setFieldConfigs: (fields: EvaluationField[]): void => {
    localStorage.setItem(STORAGE_KEYS.FIELD_CONFIGS, JSON.stringify(fields));
  },

  clearFieldConfigs: (): void => {
    localStorage.removeItem(STORAGE_KEYS.FIELD_CONFIGS);
  },

  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};

// sessionStorage utilities
export const sessionData = {
  getCurrentFile: (): FileData | null => {
    const data = sessionStorage.getItem(STORAGE_KEYS.CURRENT_FILE);
    return data ? JSON.parse(data) : null;
  },

  setCurrentFile: (file: FileData): void => {
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_FILE, JSON.stringify(file));
  },

  clearCurrentFile: (): void => {
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_FILE);
  },

  getProcessingProgress: (): ProcessingProgress | null => {
    const data = sessionStorage.getItem(STORAGE_KEYS.PROCESSING_PROGRESS);
    return data ? JSON.parse(data) : null;
  },

  setProcessingProgress: (progress: ProcessingProgress): void => {
    sessionStorage.setItem(STORAGE_KEYS.PROCESSING_PROGRESS, JSON.stringify(progress));
  },

  clearProcessingProgress: (): void => {
    sessionStorage.removeItem(STORAGE_KEYS.PROCESSING_PROGRESS);
  },

  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      sessionStorage.removeItem(key);
    });
  },
};
