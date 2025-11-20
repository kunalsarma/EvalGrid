import React from 'react';
import { ScoreValue } from '../types';

interface ScoreValueInputProps {
  score: ScoreValue;
  onUpdate: (updates: Partial<ScoreValue>) => void;
  onRemove: () => void;
}

export const ScoreValueInput: React.FC<ScoreValueInputProps> = ({
  score,
  onUpdate,
  onRemove,
}) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
      <div className="flex gap-3 items-start mb-2">
        <div className="flex-1">
          <input
            type="text"
            value={score.value}
            onChange={(e) => onUpdate({ value: e.target.value })}
            placeholder="Score value (e.g., 1, 3, 5)"
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>
        <button
          onClick={onRemove}
          className="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-sm"
        >
          Remove
        </button>
      </div>

      <textarea
        value={score.description}
        onChange={(e) => onUpdate({ description: e.target.value })}
        placeholder="Define when to assign this score"
        rows={2}
        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
      />
    </div>
  );
};
