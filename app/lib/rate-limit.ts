import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Login rate limit: 5 attempts per 15 minutes
export const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
  prefix: "ratelimit:login",
});

// API rate limit: 100 requests per minute (for API routes)
export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
  prefix: "ratelimit:api",
});

// Helper function to check login rate limit
export async function checkLoginRateLimit(
  identifier: string
): Promise<{ success: boolean; remaining: number; reset: Date }> {
  const key = `login:${identifier.toLowerCase()}`;
  const result = await loginRateLimit.limit(key);

  return {
    success: result.success,
    remaining: result.remaining,
    reset: new Date(result.reset),
  };
}