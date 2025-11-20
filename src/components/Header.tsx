import React from 'react';
import { useApp } from '../context/AppContext';
import { MODELS, TIER_OPTIONS } from '../constants/models';

export const Header: React.FC = () => {
  const { selectedModel, setSelectedModel, selectedTier, setSelectedTier, clearAllData } = useApp();

  const currentModel = MODELS[selectedModel];
  const currentLimits = currentModel?.tiers[selectedTier as keyof typeof currentModel.tiers];

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data including your API key?')) {
      clearAllData();
      window.location.reload();
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        {/* Title and Model Selector Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EvalGrid</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">LLM-Powered Data Evaluation</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Model Selector */}
            <div className="flex-1 sm:flex-none">
              <label className="block text-xs text-gray-700 dark:text-gray-400 mb-1">Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {Object.entries(MODELS).map(([key, model]) => (
                  <option key={key} value={key}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tier Selector */}
            <div className="flex-1 sm:flex-none">
              <label className="block text-xs text-gray-700 dark:text-gray-400 mb-1">Tier</label>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {TIER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Data Button */}
            <div className="flex items-end">
              <button
                onClick={handleClearData}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                title="Clear all data including API key"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Rate Limits Info Row */}
        {currentLimits && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded p-3 text-sm text-gray-700 dark:text-gray-300">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-gray-600 dark:text-gray-500">RPM:</span> {currentLimits.rpm}/min
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-500">TPM:</span> {currentLimits.tpm.toLocaleString()}/min
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-gray-600 dark:text-gray-500">RPD:</span> {currentLimits.rpd > 0 ? `${currentLimits.rpd}/day` : 'Unlimited'}
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-500 mt-2">
              {currentModel?.description}
            </p>
          </div>
        )}
      </div>
    </header>
  );
};
