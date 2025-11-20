import React, { useMemo } from 'react';
import { ProcessingProgress } from '../types';

interface ProgressBarProps {
  progress: ProcessingProgress;
  fieldName?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, fieldName }) => {
  const {
    currentField,
    currentRow,
    totalRows,
    totalFields,
    startTime,
    successCount,
    errorCount,
  } = progress;

  const stats = useMemo(() => {
    const elapsedMs = Date.now() - startTime;
    const elapsedSeconds = Math.floor(elapsedMs / 1000);
    const rowsProcessed = successCount + errorCount;
    const rowsPerSecond = rowsProcessed / (elapsedSeconds || 1);
    const remainingRows = totalRows * totalFields - rowsProcessed;
    const estimatedRemainingSeconds = Math.ceil(remainingRows / (rowsPerSecond || 1));

    const percentage = Math.round((rowsProcessed / (totalRows * totalFields)) * 100);

    const formatTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
      }
      if (minutes > 0) {
        return `${minutes}m ${secs}s`;
      }
      return `${secs}s`;
    };

    return {
      percentage,
      elapsedTime: formatTime(elapsedSeconds),
      estimatedRemaining: formatTime(estimatedRemainingSeconds),
      rowsPerMinute: Math.round(rowsPerSecond * 60),
    };
  }, [progress, startTime]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Processing Progress
      </h2>

      {/* Field Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Field {currentField + 1} of {totalFields}
            </p>
            {fieldName && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{fieldName}</p>
            )}
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {stats.percentage}%
          </p>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          Row {currentRow} of {totalRows}
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Processed</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {successCount + errorCount}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded p-3">
          <p className="text-xs text-green-600 dark:text-green-400 mb-1">Successful</p>
          <p className="font-semibold text-green-900 dark:text-green-200">
            {successCount}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded p-3">
          <p className="text-xs text-red-600 dark:text-red-400 mb-1">Errors</p>
          <p className="font-semibold text-red-900 dark:text-red-200">{errorCount}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3">
          <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Speed</p>
          <p className="font-semibold text-blue-900 dark:text-blue-200">
            {stats.rowsPerMinute} rows/min
          </p>
        </div>
      </div>

      {/* Time Info */}
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>Elapsed: {stats.elapsedTime}</span>
        <span>Remaining: {stats.estimatedRemaining}</span>
      </div>
    </div>
  );
};
