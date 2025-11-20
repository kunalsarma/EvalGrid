import { RateLimits } from '../types';

export class RateLimitManager {
  private rpm: number;
  private tpm: number;
  private rpd: number;
  private requestTimestamps: number[] = [];
  private tokenUsage: number = 0;
  private dailyRequestCount: number = 0;
  private lastResetDate: string = new Date().toISOString().split('T')[0];

  constructor(limits: RateLimits) {
    this.rpm = limits.rpm;
    this.tpm = limits.tpm;
    this.rpd = limits.rpd;
  }

  calculateDelayMs(): number {
    // Calculate delay to maintain RPM limit (with 10% safety margin)
    if (this.rpm <= 0) return 0;
    return Math.ceil((60000 / this.rpm) * 1.1);
  }

  async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const currentDate = new Date().toISOString().split('T')[0];

    // Reset daily counter if date changed
    if (currentDate !== this.lastResetDate) {
      this.dailyRequestCount = 0;
      this.lastResetDate = currentDate;
    }

    // Check RPD limit
    if (this.rpd > 0 && this.dailyRequestCount >= this.rpd) {
      throw new Error(
        `Daily request limit (${this.rpd}) exceeded. Limit resets at midnight Pacific Time.`
      );
    }

    // Remove timestamps older than 1 minute
    this.requestTimestamps = this.requestTimestamps.filter(
      (timestamp) => now - timestamp < 60000
    );

    // Wait if we've hit RPM limit
    if (this.requestTimestamps.length >= this.rpm) {
      const oldestTimestamp = this.requestTimestamps[0];
      const waitTime = 60000 - (now - oldestTimestamp) + 100; // 100ms buffer
      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    // Track this request
    this.requestTimestamps.push(Date.now());
    this.dailyRequestCount++;
  }

  updateTokenUsage(tokens: number): void {
    this.tokenUsage += tokens;
  }

  getTokenUsagePercentage(): number {
    if (this.tpm <= 0) return 0;
    return (this.tokenUsage / this.tpm) * 100;
  }

  canMakeRequest(estimatedTokens: number = 1000): boolean {
    // Check if adding estimated tokens would exceed TPM
    if (this.tpm > 0 && this.tokenUsage + estimatedTokens > this.tpm) {
      return false;
    }

    // Check if we've hit RPM limit in this minute
    const now = Date.now();
    const recentRequests = this.requestTimestamps.filter(
      (timestamp) => now - timestamp < 60000
    ).length;

    return recentRequests < this.rpm;
  }

  getRemainingDailyRequests(): number {
    if (this.rpd <= 0) return -1; // No limit
    return Math.max(0, this.rpd - this.dailyRequestCount);
  }

  reset(): void {
    this.requestTimestamps = [];
    this.tokenUsage = 0;
    this.dailyRequestCount = 0;
  }
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  isRateLimit: boolean = false
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Check if it's a rate limit error
      if (
        error instanceof Error &&
        (error.message.includes('429') || error.message.includes('rate limit'))
      ) {
        // Exponential backoff for rate limits: 1s, 2s, 4s, etc.
        const backoffMs = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      } else if (attempt < maxRetries - 1) {
        // Regular exponential backoff for other errors
        const backoffMs = Math.pow(2, attempt) * 500;
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}
