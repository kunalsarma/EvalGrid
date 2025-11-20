import { EvaluationField, FileData, RateLimits } from '../types';
import { promptBuilder } from './promptBuilder';
import { RateLimitManager, retryWithBackoff } from './rateLimitManager';

export abstract class BaseEvaluator {
    protected rateLimitManager: RateLimitManager;
    protected isCancelled: boolean = false;

    constructor(rateLimits: RateLimits) {
        this.rateLimitManager = new RateLimitManager(rateLimits);
    }

    /**
     * Evaluate a single row with the given prompt.
     * This must be implemented by each provider-specific evaluator.
     */
    protected abstract evaluateRow(prompt: string): Promise<string>;

    /**
     * Evaluate all rows for a given field.
     * This method is shared across all evaluators.
     */
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
