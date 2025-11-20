import * as XLSX from 'xlsx';
import { FileData } from '../types';
import { ERROR_MESSAGES } from '../constants/errors';

export const excelHandler = {
  parseFile: (file: File): Promise<FileData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) {
            reject(new Error(ERROR_MESSAGES.INVALID_FILE));
            return;
          }

          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];

          if (!worksheet) {
            reject(new Error(ERROR_MESSAGES.INVALID_FILE));
            return;
          }

          const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

          if (jsonData.length === 0) {
            reject(new Error(ERROR_MESSAGES.NO_DATA));
            return;
          }

          const headers = Object.keys(jsonData[0]);
          if (headers.length === 0) {
            reject(new Error(ERROR_MESSAGES.NO_HEADERS));
            return;
          }

          resolve({
            headers,
            rows: jsonData,
            filename: file.name.replace('.xlsx', ''),
          });
        } catch (error) {
          reject(new Error(ERROR_MESSAGES.INVALID_FILE));
        }
      };

      reader.onerror = () => {
        reject(new Error(ERROR_MESSAGES.INVALID_FILE));
      };

      reader.readAsArrayBuffer(file);
    });
  },

  createTemplate: (): ArrayBuffer => {
    const data = [
      { 'customer message': 'Sample customer message', 'template reply': 'Sample template reply', 'rephrased reply': 'Sample rephrased reply' }
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;
  },

  downloadTemplate: (): void => {
    const template = excelHandler.createTemplate();
    const blob = new Blob([template], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'evalgrid_template.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  downloadResults: (fileData: FileData, results: Record<string, any>[], originalFilename: string): void => {
    // Combine original data with results
    const combinedData = fileData.rows.map((row, index) => ({
      ...row,
      ...results[index],
    }));

    const worksheet = XLSX.utils.json_to_sheet(combinedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `evalgrid_${originalFilename}_${timestamp}.xlsx`;

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};
