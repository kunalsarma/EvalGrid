import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { ApiKeyInput } from './components/ApiKeyInput';
import { FieldConfiguration } from './components/FieldConfiguration';
import { ProcessingControl } from './components/ProcessingControl';
import { ProgressBar } from './components/ProgressBar';
import { ResultsDownload } from './components/ResultsDownload';
import { useApp } from './context/AppContext';
import { excelHandler } from './utils/excelHandler';
import { GeminiEvaluator } from './utils/geminiEvaluator';
import { MODELS } from './constants/models';
import { ProcessingProgress } from './types';

export const App: React.FC = () => {
  const {
    fileData,
    fields,
    apiKey,
    selectedModel,
    selectedTier,
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
  } = useApp();

  const [error, setError] = useState<string>('');
  const [evaluator, setEvaluator] = useState<GeminiEvaluator | null>(null);

  const handleStartEvaluation = useCallback(async () => {
    if (!fileData || !apiKey || fields.length === 0) {
      setError('Please configure all required fields');
      return;
    }

    setError('');
    setIsProcessing(true);
    setProgress({
      currentField: 0,
      currentRow: 0,
      totalRows: fileData.rows.length,
      totalFields: fields.length,
      startTime: Date.now(),
      successCount: 0,
      errorCount: 0,
      errors: new Map(),
    });

    try {
      const modelConfig = MODELS[selectedModel];
      const rateLimits = modelConfig.tiers[selectedTier as keyof typeof modelConfig.tiers];

      const newEvaluator = new GeminiEvaluator(apiKey, modelConfig.modelId, rateLimits);
      setEvaluator(newEvaluator);

      const allResults: Record<string, any>[] = new Array(fileData.rows.length)
        .fill(null)
        .map(() => ({}));
      const allErrors = new Map<number, string>();

      for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
        if (!isProcessing) break;

        const field = fields[fieldIndex];

        try {
          const fieldResults = await newEvaluator.evaluateField(
            field,
            fileData,
            (currentRow, totalRows) => {
              if (progress) {
                setProgress({
                  ...progress,
                  currentField: fieldIndex,
                  currentRow,
                  successCount: currentRow,
                  errorCount: 0,
                });
              }
            }
          );

          // Merge field results
          fieldResults.forEach((result, index) => {
            Object.assign(allResults[index], result);
            const fieldScore = result[`${field.name}_Score`];
            if (fieldScore && fieldScore.includes('ERROR')) {
              allErrors.set(index, fieldScore);
            }
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          setError(`Error processing field "${field.name}": ${message}`);
          break;
        }
      }

      setResults(allResults);
      setErrors(allErrors);
      if (progress) {
        setProgress({
          ...progress,
          currentField: fields.length,
          currentRow: fileData.rows.length,
          successCount: fileData.rows.length - allErrors.size,
          errorCount: allErrors.size,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error during evaluation';
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  }, [fileData, fields, apiKey, selectedModel, selectedTier, setIsProcessing, setProgress, setResults, setErrors, isProcessing]);

  const handlePause = useCallback(() => {
    setIsPaused(true);
  }, [setIsPaused]);

  const handleResume = useCallback(() => {
    setIsPaused(false);
  }, [setIsPaused]);

  const handleCancel = useCallback(() => {
    evaluator?.cancel();
    setIsProcessing(false);
    setProgress(null);
  }, [evaluator, setIsProcessing, setProgress]);

  const currentField = progress ? fields[progress.currentField] : undefined;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
              <p className="font-semibold mb-1">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* File Upload */}
          <FileUpload onTemplateDownload={() => excelHandler.downloadTemplate()} />

          {/* API Key Input */}
          <ApiKeyInput />

          {/* Evaluation Field Configuration */}
          <FieldConfiguration />

          {/* Processing Control */}
          <ProcessingControl
            onStart={handleStartEvaluation}
            onPause={handlePause}
            onResume={handleResume}
            onCancel={handleCancel}
          />

          {/* Progress Bar */}
          {progress && (
            <ProgressBar progress={progress} fieldName={currentField?.name} />
          )}

          {/* Results Download */}
          <ResultsDownload isProcessing={isProcessing} />
        </div>
      </main>
    </div>
  );
};
