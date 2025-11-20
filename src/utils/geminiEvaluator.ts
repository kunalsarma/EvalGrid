import { GoogleGenerativeAI } from '@google/generative-ai';
import { EvaluationField, FileData } from '../types';
import { promptBuilder } from './promptBuilder';
import { RateLimitManager, retryWithBackoff } from './rateLimitManager';
import { RateLimits } from '../types';

export class GeminiEvaluator {
  private client: GoogleGenerativeAI;
  private modelId: string;
  private rateLimitManager: RateLimitManager;
  private isCancelled: boolean = false;

  constructor(apiKey: string, modelId: string, rateLimits: RateLimits) {
    this.client = new GoogleGenerativeAI(apiKey);
    this.modelId = modelId;
    this.rateLimitManager = new RateLimitManager(rateLimits);
  }

  async evaluateField(
    field: EvaluationField,
    fileData: FileData,
    onProgress?: (rowIndex: number, totalRows: number) => void
  ): Promise<Record<string, any>[]> {
    const results: Record<string, any>[] = new Array(fileData.rows.length).fill(null).map(() => ({}));
    const columnName = `${field.name}_Score`;

    for (let i = 0; i < fileData.rows.length; i++) {
      if (this.isCancelled) {
        throw new Error('Evaluation cancelled by user');
      }

      const row = fileData.rows[i];

      try {
        await this.rateLimitManager.waitForRateLimit();

        const prompt = promptBuilder.buildEvaluationPrompt(field, row, fileData);
        const score = await retryWithBackoff(async () => {
          return await this.evaluateRow(prompt);
        });

        results[i][columnName] = score;
      } catch (error) {
        results[i][columnName] = `ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }

      if (onProgress) {
        onProgress(i + 1, fileData.rows.length);
      }
    }

    return results;
  }

  private async evaluateRow(prompt: string): Promise<string> {
    const model = this.client.getGenerativeModel({ model: this.modelId });

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Validate response is not empty
    if (!text) {
      throw new Error('Empty response from API');
    }

    return text;
  }

  cancel(): void {
    this.isCancelled = true;
  }

  getTokenUsagePercentage(): number {
    return this.rateLimitManager.getTokenUsagePercentage();
  }

  getRemainingDailyRequests(): number {
    return this.rateLimitManager.getRemainingDailyRequests();
  }

  getDelayMs(): number {
    return this.rateLimitManager.calculateDelayMs();
  }
}
