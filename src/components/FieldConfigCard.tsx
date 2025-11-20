import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EvaluationField, ContextColumn, ScoreValue } from '../types';
import { ScoreValueInput } from './ScoreValueInput';
import { ContextColumnSelector } from './ContextColumnSelector';

interface FieldConfigCardProps {
  field: EvaluationField;
  columns: string[];
  fieldIndex: number;
  onRemove: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const FieldConfigCard: React.FC<FieldConfigCardProps> = ({
  field,
  columns,
  fieldIndex,
  onRemove,
}) => {
  const { updateField } = useApp();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleUpdate = (updates: Partial<EvaluationField>) => {
    updateField(field.id, { ...field, ...updates });
  };

  const handleAddScoreValue = () => {
    const newScore: ScoreValue = {
      id: generateId(),
      value: '',
      description: '',
    };
    handleUpdate({ scoreValues: [...field.scoreValues, newScore] });
  };

  const handleRemoveScoreValue = (scoreId: string) => {
    handleUpdate({
      scoreValues: field.scoreValues.filter((s) => s.id !== scoreId),
    });
  };

  const handleUpdateScoreValue = (scoreId: string, updates: Partial<ScoreValue>) => {
    handleUpdate({
      scoreValues: field.scoreValues.map((s) =>
        s.id === scoreId ? { ...s, ...updates } : s
      ),
    });
  };

  const handleAddContextColumn = () => {
    const newContext: ContextColumn = {
      column: '',
      description: '',
    };
    handleUpdate({ contextColumns: [...field.contextColumns, newContext] });
  };

  const handleRemoveContextColumn = (index: number) => {
    handleUpdate({
      contextColumns: field.contextColumns.filter((_, i) => i !== index),
    });
  };

  const handleUpdateContextColumn = (
    index: number,
    updates: Partial<ContextColumn>
  ) => {
    handleUpdate({
      contextColumns: field.contextColumns.map((c, i) =>
        i === index ? { ...c, ...updates } : c
      ),
    });
  };

  const isValid =
    field.name.trim() &&
    field.targetColumn &&
    field.scoreValues.length > 0 &&
    field.scoreValues.every((s) => s.value && s.description);

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className="bg-gray-100 dark:bg-gray-800 px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {field.name || `Field ${fieldIndex + 1}`}
          </h3>
          {field.targetColumn && (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Target: {field.targetColumn}
            </p>
          )}
          {!isValid && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              ⚠ Incomplete configuration
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isValid && <span className="text-green-600 dark:text-green-400">✓</span>}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="px-3 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-sm"
          >
            Delete
          </button>
          <span className="text-gray-500">{isExpanded ? '▼' : '▶'}</span>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-300 dark:border-gray-700 space-y-4">
          {/* Field Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Field Name *
            </label>
            <input
              type="text"
              value={field.name}
              onChange={(e) => handleUpdate({ name: e.target.value })}
              placeholder="e.g., Accuracy, Tone Appropriateness"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Field Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Field Description
            </label>
            <textarea
              value={field.description}
              onChange={(e) => handleUpdate({ description: e.target.value })}
              placeholder="Describe what this field evaluates and how the LLM should assess it"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Target Column */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Target Column to Evaluate *
            </label>
            <select
              value={field.targetColumn}
              onChange={(e) => handleUpdate({ targetColumn: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Select a column...</option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Context Columns */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Context Columns (with descriptions)
              </label>
              <button
                onClick={handleAddContextColumn}
                className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50"
              >
                + Add
              </button>
            </div>

            <div className="space-y-3">
              {field.contextColumns.map((ctx, index) => (
                <ContextColumnSelector
                  key={index}
                  column={ctx}
                  availableColumns={columns.filter(
                    (col) =>
                      col !== field.targetColumn &&
                      !field.contextColumns.some(
                        (c, i) => i !== index && c.column === col
                      )
                  )}
                  onUpdate={(updates) => handleUpdateContextColumn(index, updates)}
                  onRemove={() => handleRemoveContextColumn(index)}
                />
              ))}
            </div>
          </div>

          {/* Score Values */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Score Values *
              </label>
              <button
                onClick={handleAddScoreValue}
                className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50"
              >
                + Add Score
              </button>
            </div>

            <div className="space-y-3">
              {field.scoreValues.map((score) => (
                <ScoreValueInput
                  key={score.id}
                  score={score}
                  onUpdate={(updates) => handleUpdateScoreValue(score.id, updates)}
                  onRemove={() => handleRemoveScoreValue(score.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
