import { ModelProvider, RateLimits } from '../types';
import { BaseEvaluator } from './baseEvaluator';
import { GeminiEvaluator } from './geminiEvaluator';
import { ClaudeEvaluator } from './claudeEvaluator';
import { OpenAIEvaluator } from './openaiEvaluator';

export function createEvaluator(
    provider: ModelProvider,
    apiKey: string,
    modelId: string,
    rateLimits: RateLimits
): BaseEvaluator {
    switch (provider) {
        case 'google':
            return new GeminiEvaluator(apiKey, modelId, rateLimits);
        case 'anthropic':
            return new ClaudeEvaluator(apiKey, modelId, rateLimits);
        case 'openai':
            return new OpenAIEvaluator(apiKey, modelId, rateLimits);
        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }
}
