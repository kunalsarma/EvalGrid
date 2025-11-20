import React from 'react';
import { useApp } from '../context/AppContext';
import { MODELS } from '../constants/models';
import { ERROR_MESSAGES } from '../constants/errors';

interface ProcessingControlProps {
  onStart: () => Promise<void>;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
}

export const ProcessingControl: React.FC<ProcessingControlProps> = ({
  onStart,
  onPause,
  onResume,
  onCancel,
}) => {
  const { fileData, fields, apiKey, isProcessing, isPaused } = useApp();
  const [isStarting, setIsStarting] = React.useState(false);

  const isValid = fileData && fields.length > 0 && apiKey && fields.every((f) => f.name && f.targetColumn && f.scoreValues.length > 0);

  const getValidationError = (): string | null => {
    if (!fileData) return 'Please upload a file first';
    if (fields.length === 0) return 'Please configure at least one evaluation field';
    if (!apiKey) return 'Please provide your Google AI Studio API key';
    if (!fields.every((f) => f.name)) return 'All fields must have a name';
    if (!fields.every((f) => f.targetColumn)) return 'All fields must have a target column';
    if (!fields.every((f) => f.scoreValues.length > 0)) return 'All fields must have at least one score value';
    if (!fields.every((f) => f.scoreValues.every((s) => s.value && s.description))) {
      return 'All score values must have a value and description';
    }
    return null;
  };

  const validationError = getValidationError();

  const handleStart = async () => {
    setIsStarting(true);
    try {
      await onStart();
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Start Evaluation
      </h2>

      {validationError && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded p-4 text-red-800 dark:text-red-200 text-sm">
          {validationError}
        </div>
      )}

      {fileData && !isProcessing && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          <p className="font-semibold mb-2">Ready to evaluate:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>{fileData.rows.length} rows</li>
            <li>{fields.length} evaluation field{fields.length !== 1 ? 's' : ''}</li>
            <li>
              Estimated time: ~
              {Math.ceil((fileData.rows.length * fields.length * 5) / 60)} minutes
            </li>
          </ul>
        </div>
      )}

      <div className="flex gap-2">
        {!isProcessing ? (
          <button
            onClick={handleStart}
            disabled={!isValid || isStarting}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded transition-colors font-medium"
          >
            {isStarting ? 'Starting...' : 'Start Evaluation'}
          </button>
        ) : (
          <>
            {!isPaused ? (
              <button
                onClick={onPause}
                className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors font-medium"
              >
                Pause
              </button>
            ) : (
              <button
                onClick={onResume}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded transition-colors font-medium"
              >
                Resume
              </button>
            )}
            <button
              onClick={onCancel}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded transition-colors font-medium"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};
