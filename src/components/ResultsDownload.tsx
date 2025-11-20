import React from 'react';
import { useApp } from '../context/AppContext';
import { excelHandler } from '../utils/excelHandler';
import { SUCCESS_MESSAGES } from '../constants/errors';

interface ResultsDownloadProps {
  isProcessing: boolean;
}

export const ResultsDownload: React.FC<ResultsDownloadProps> = ({ isProcessing }) => {
  const { fileData, results, errors, isProcessing: globalIsProcessing } = useApp();
  const [showMessage, setShowMessage] = React.useState(false);

  const hasResults = results && results.length > 0;
  const totalRows = fileData?.rows.length || 0;
  const totalErrors = errors.size;
  const totalSuccess = (results?.length || 0) - totalErrors;

  const handleDownload = () => {
    if (!fileData || !results) return;

    excelHandler.downloadResults(fileData, results, fileData.filename);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  if (!hasResults) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          {globalIsProcessing
            ? 'Processing in progress...'
            : 'No results yet. Start an evaluation to generate results.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Evaluation Complete!
      </h2>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-4">
          <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Total Rows</p>
          <p className="font-semibold text-blue-900 dark:text-blue-200 text-lg">
            {totalRows}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded p-4">
          <p className="text-xs text-green-600 dark:text-green-400 mb-1">Successful</p>
          <p className="font-semibold text-green-900 dark:text-green-200 text-lg">
            {totalSuccess}
          </p>
        </div>
        <div className={`rounded p-4 ${totalErrors > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
          <p className={`text-xs mb-1 ${totalErrors > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
            Errors
          </p>
          <p className={`font-semibold text-lg ${totalErrors > 0 ? 'text-red-900 dark:text-red-200' : 'text-gray-900 dark:text-gray-200'}`}>
            {totalErrors}
          </p>
        </div>
      </div>

      {/* Error Details */}
      {totalErrors > 0 && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4">
          <p className="text-sm font-semibold text-red-900 dark:text-red-200 mb-2">
            Failed Rows ({totalErrors})
          </p>
          <div className="max-h-32 overflow-y-auto">
            <ul className="text-xs text-red-800 dark:text-red-300 space-y-1">
              {Array.from(errors.entries()).map(([rowIndex, error]) => (
                <li key={rowIndex}>
                  Row {rowIndex + 1}: {error}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={!hasResults || isProcessing}
        className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded transition-colors font-medium mb-4"
      >
        Download Results as XLSX
      </button>

      {showMessage && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded p-3 text-center text-sm text-green-800 dark:text-green-200">
          ✓ {SUCCESS_MESSAGES.RESULTS_DOWNLOADED}
        </div>
      )}

      {totalErrors > 0 && (
        <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
          <p>
            Rows with errors are marked with ERROR messages. You can review and
            re-process them separately.
          </p>
        </div>
      )}
    </div>
  );
};
