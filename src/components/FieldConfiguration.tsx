import React from 'react';
import { useApp } from '../context/AppContext';
import { FieldConfigCard } from './FieldConfigCard';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const FieldConfiguration: React.FC = () => {
  const { fileData, fields, addField, removeField, clearFields } = useApp();

  const handleAddField = () => {
    const newField = {
      id: generateId(),
      name: '',
      description: '',
      targetColumn: '',
      contextColumns: [],
      scoreValues: [],
    };
    addField(newField);
  };

  if (!fileData) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Please upload a file first to configure evaluation fields.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Evaluation Fields
        </h2>
        <div className="flex gap-2">
          {fields.length > 0 && (
            <button
              onClick={clearFields}
              className="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-sm"
            >
              Clear All
            </button>
          )}
          <button
            onClick={handleAddField}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors text-sm font-medium"
          >
            + Add Field
          </button>
        </div>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="mb-4">No evaluation fields configured yet.</p>
          <button
            onClick={handleAddField}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors text-sm font-medium"
          >
            Add Your First Field
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <FieldConfigCard
              key={field.id}
              field={field}
              columns={fileData.headers}
              fieldIndex={index}
              allFields={fields}
              onRemove={() => removeField(field.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
