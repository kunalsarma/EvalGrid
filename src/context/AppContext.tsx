import React, { createContext, useState, useCallback, useEffect } from 'react';
import { EvaluationField, FileData, ProcessingProgress, ApiKeys, ModelProvider } from '../types';
import { storage, sessionData } from '../utils/storage';

interface AppContextType {
  // File state
  fileData: FileData | null;
  setFileData: (data: FileData | null) => void;

  // Configuration state
  fields: EvaluationField[];
  addField: (field: EvaluationField) => void;
  updateField: (id: string, field: EvaluationField) => void;
  removeField: (id: string) => void;
  clearFields: () => void;

  // API and model state
  apiKeys: ApiKeys;
  setApiKey: (provider: ModelProvider, key: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedTier: string;
  setSelectedTier: (tier: string) => void;

  // Processing state
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
  isPaused: boolean;
  setIsPaused: (value: boolean) => void;
  progress: ProcessingProgress | null;
  setProgress: (progress: ProcessingProgress | null) => void;

  // Results
  results: Record<string, any>[] | null;
  setResults: (results: Record<string, any>[] | null) => void;
  errors: Map<number, string>;
  setErrors: (errors: Map<number, string>) => void;

  // Clear all data
  clearAllData: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // File state
  const [fileData, setFileData] = useState<FileData | null>(null);

  // Configuration state
  const [fields, setFields] = useState<EvaluationField[]>(() => {
    return storage.getFieldConfigs();
  });

  // API and model state
  const [apiKeys, setApiKeysState] = useState<ApiKeys>(storage.getApiKeys());
  const [selectedModel, setSelectedModelState] = useState<string>(
    storage.getSelectedModel()
  );
  const [selectedTier, setSelectedTierState] = useState<string>(
    storage.getSelectedTier()
  );

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);

  // Results
  const [results, setResults] = useState<Record<string, any>[] | null>(null);
  const [errors, setErrors] = useState<Map<number, string>>(new Map());

  // Sync fields to localStorage
  useEffect(() => {
    storage.setFieldConfigs(fields);
  }, [fields]);

  // Sync API keys to localStorage
  const setApiKey = useCallback((provider: ModelProvider, key: string) => {
    setApiKeysState(prev => ({ ...prev, [provider]: key }));
    storage.setApiKey(provider, key);
  }, []);

  // Sync selected model to localStorage
  const setSelectedModel = useCallback((model: string) => {
    setSelectedModelState(model);
    storage.setSelectedModel(model);
  }, []);

  // Sync selected tier to localStorage
  const setSelectedTier = useCallback((tier: string) => {
    setSelectedTierState(tier);
    storage.setSelectedTier(tier);
  }, []);

  const addField = useCallback((field: EvaluationField) => {
    setFields((prev) => [...prev, field]);
  }, []);

  const updateField = useCallback((id: string, field: EvaluationField) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? field : f))
    );
  }, []);

  const removeField = useCallback((id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearFields = useCallback(() => {
    setFields([]);
  }, []);

  const clearAllData = useCallback(() => {
    setFileData(null);
    setFields([]);
    setApiKeysState({});
    setSelectedModelState('gemini-2-5-flash');
    setSelectedTierState('free');
    setIsProcessing(false);
    setIsPaused(false);
    setProgress(null);
    setResults(null);
    setErrors(new Map());
    storage.clearAll();
    sessionData.clearAll();
  }, []);

  const value: AppContextType = {
    fileData,
    setFileData,
    fields,
    addField,
    updateField,
    removeField,
    clearFields,
    apiKeys,
    setApiKey,
    selectedModel,
    setSelectedModel,
    selectedTier,
    setSelectedTier,
    isProcessing,
    setIsProcessing,
    isPaused,
    setIsPaused,
    progress,
    setProgress,
    results,
    setResults,
    errors,
    setErrors,
    clearAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
