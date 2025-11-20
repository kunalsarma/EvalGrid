import OpenAI from 'openai';
import { RateLimits } from '../types';
import { BaseEvaluator } from './baseEvaluator';

export class OpenAIEvaluator extends BaseEvaluator {
    private client: OpenAI;
    private modelId: string;

    constructor(apiKey: string, modelId: string, rateLimits: RateLimits) {
        super(rateLimits);
        this.client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
        this.modelId = modelId;
    }

    protected async evaluateRow(prompt: string): Promise<string> {
        const completion = await this.client.chat.completions.create({
            model: this.modelId,
            messages: [{
                role: 'user',
                content: prompt
            }],
            max_tokens: 1024,
        });

        const text = completion.choices[0]?.message?.content?.trim();

        // Validate response is not empty
        if (!text) {
            throw new Error('Empty response from API');
        }

        return text;
    }
}
