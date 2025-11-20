import Anthropic from '@anthropic-ai/sdk';
import { RateLimits } from '../types';
import { BaseEvaluator } from './baseEvaluator';

export class ClaudeEvaluator extends BaseEvaluator {
    private client: Anthropic;
    private modelId: string;

    constructor(apiKey: string, modelId: string, rateLimits: RateLimits) {
        super(rateLimits);
        this.client = new Anthropic({ apiKey });
        this.modelId = modelId;
    }

    protected async evaluateRow(prompt: string): Promise<string> {
        const message = await this.client.messages.create({
            model: this.modelId,
            max_tokens: 1024,
            messages: [{
                role: 'user',
                content: prompt
            }]
        });

        // Extract text from response
        const textContent = message.content.find(c => c.type === 'text');
        if (!textContent || textContent.type !== 'text') {
            throw new Error('No text content in response');
        }

        const text = textContent.text.trim();

        // Validate response is not empty
        if (!text) {
            throw new Error('Empty response from API');
        }

        return text;
    }
}
