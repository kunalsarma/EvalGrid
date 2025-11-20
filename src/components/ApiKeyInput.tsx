import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WARNING_MESSAGES } from '../constants/errors';

export const ApiKeyInput: React.FC = () => {
  const { apiKey, setApiKey } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  const handleSave = () => {
    if (tempKey.trim()) {
      setApiKey(tempKey.trim());
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        API Configuration
      </h2>

      <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded p-3 text-sm text-red-800 dark:text-red-200">
        <p className="font-semibold mb-1">Security Warning</p>
        <p>{WARNING_MESSAGES.API_KEY_STORAGE}</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Google AI Studio API Key
        </label>
        <div className="flex gap-2">
          <input
            type={isVisible ? 'text' : 'password'}
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder="Enter your Google AI Studio API key"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
          >
            {isVisible ? 'Hide' : 'Show'}
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Get your API key at{' '}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Google AI Studio
          </a>
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={!tempKey.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded transition-colors text-sm font-medium"
        >
          Save API Key
        </button>
        {apiKey && (
          <span className="flex items-center text-sm text-green-600 dark:text-green-400">
            ✓ API Key configured
          </span>
        )}
      </div>
    </div>
  );
};
