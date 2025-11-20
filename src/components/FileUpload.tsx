import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { excelHandler } from '../utils/excelHandler';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, WARNING_MESSAGES } from '../constants/errors';

interface FileUploadProps {
  onTemplateDownload: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onTemplateDownload }) => {
  const { fileData, setFileData, setResults, setProgress, setErrors } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError('');

    try {
      if (!file.name.endsWith('.xlsx')) {
        throw new Error(ERROR_MESSAGES.INVALID_FILE);
      }

      const data = await excelHandler.parseFile(file);
      setFileData(data);

      // Clear previous evaluation results when a new file is loaded
      setResults(null);
      setProgress(null);
      setErrors(new Map());
    } catch (err) {
      const message = err instanceof Error ? err.message : ERROR_MESSAGES.INVALID_FILE;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">File Upload</h2>
        <button
          onClick={onTemplateDownload}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm font-medium"
        >
          Download Template
        </button>
      </div>

      {fileData ? (
        <div className="mb-4">
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded p-4 mb-4">
            <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2">
              File Loaded: {fileData.filename}
            </h3>
            <p className="text-sm text-green-800 dark:text-green-300 mb-3">
              Rows: {fileData.rows.length} | Columns: {fileData.headers.length}
            </p>
            <div className="mb-3">
              <p className="text-xs font-semibold text-green-800 dark:text-green-300 mb-2">
                Detected Columns:
              </p>
              <div className="flex flex-wrap gap-2">
                {fileData.headers.map((header) => (
                  <span
                    key={header}
                    className="px-2 py-1 bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-100 rounded text-xs"
                  >
                    {header}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                fileInputRef.current?.click();
              }}
              className="text-sm text-green-600 dark:text-green-400 hover:underline"
            >
              Replace file
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded p-3">
            <p className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
              Privacy Notice
            </p>
            <p>{WARNING_MESSAGES.DATA_PRIVACY}</p>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin h-6 w-6 text-blue-600 dark:text-blue-400">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v9m0 0H3m9 0h9m-6-9a9 9 0 110 18 9 9 0 010-18z"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-3"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v24a4 4 0 004 4h24a4 4 0 004-4V20"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M40 8l-12 12m0 0l-4-4m4 4l4-4"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Drag and drop your XLSX file here
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  or click to select a file
                </p>
              </>
            )}
          </div>

          {error && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded p-4 text-red-800 dark:text-red-200 text-sm">
              {error}
            </div>
          )}
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
};
