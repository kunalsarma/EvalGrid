import { GoogleGenerativeAI } from '@google/generative-ai';
import { RateLimits } from '../types';
import { BaseEvaluator } from './baseEvaluator';

export class GeminiEvaluator extends BaseEvaluator {
  private client: GoogleGenerativeAI;
  private modelId: string;

  constructor(apiKey: string, modelId: string, rateLimits: RateLimits) {
    super(rateLimits);
    this.client = new GoogleGenerativeAI(apiKey);
    this.modelId = modelId;
  }

  protected async evaluateRow(prompt: string): Promise<string> {
    const model = this.client.getGenerativeModel({ model: this.modelId });

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Validate response is not empty
    if (!text) {
      throw new Error('Empty response from API');
    }

    return text;
  }
}
