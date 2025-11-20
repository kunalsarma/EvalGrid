export const ERROR_MESSAGES = {
  INVALID_FILE: 'Invalid file format. Please upload an XLSX file.',
  NO_HEADERS: 'File must contain headers in the first row.',
  NO_DATA: 'File must contain at least one row of data.',
  MISSING_FIELD_NAME: 'Please provide a name for the evaluation field.',
  MISSING_TARGET_COLUMN: 'Please select a target column to evaluate.',
  NO_SCORE_VALUES: 'Please add at least one score value.',
  MISSING_API_KEY: 'Please provide your Google AI Studio API key.',
  INVALID_API_KEY: 'Invalid API key. Please check and try again.',
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  API_ERROR: 'API error occurred. Please try again.',
  RATE_LIMIT_ERROR: 'Rate limit exceeded. Retrying...',
  NO_FILE_UPLOADED: 'Please upload a file first.',
  NO_FIELDS_CONFIGURED: 'Please configure at least one evaluation field.',
  EVALUATION_ERROR: 'Error during evaluation. Some rows may have failed.',
};

export const WARNING_MESSAGES = {
  API_KEY_STORAGE: 'Your API key is stored in browser localStorage. Only use this on trusted devices.',
  DATA_PRIVACY: 'Your uploaded data will be sent to Google\'s API for evaluation.',
  APPROACHING_DAILY_LIMIT: 'You are approaching your daily request limit.',
  LONG_PROCESSING_TIME: 'This evaluation may take a long time. Consider using a faster model.',
};

export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: 'File uploaded successfully.',
  EVALUATION_COMPLETE: 'Evaluation complete!',
  RESULTS_DOWNLOADED: 'Results downloaded successfully.',
  CONFIGURATION_SAVED: 'Configuration saved to browser.',
};
