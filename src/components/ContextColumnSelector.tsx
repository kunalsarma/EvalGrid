import React from 'react';
import { ContextColumn } from '../types';

interface ContextColumnSelectorProps {
  column: ContextColumn;
  availableColumns: string[];
  onUpdate: (updates: Partial<ContextColumn>) => void;
  onRemove: () => void;
}

export const ContextColumnSelector: React.FC<ContextColumnSelectorProps> = ({
  column,
  availableColumns,
  onUpdate,
  onRemove,
}) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
      <div className="flex gap-3 items-start mb-2">
        <div className="flex-1">
          <select
            value={column.column}
            onChange={(e) => onUpdate({ column: e.target.value })}
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 text-sm"
          >
            <option value="">Select a column...</option>
            {availableColumns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={onRemove}
          className="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-sm"
        >
          Remove
        </button>
      </div>

      <textarea
        value={column.description}
        onChange={(e) => onUpdate({ description: e.target.value })}
        placeholder="Describe what this column contains and how it should inform the evaluation"
        rows={2}
        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
      />
    </div>
  );
};
