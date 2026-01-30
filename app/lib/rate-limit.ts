import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
  prefix: "ratelimit:login",
});

export async function checkRateLimit(identifier: string, ipAddrs?: string) {
  const identifierKey = `rate-limit:${identifier}`;
  const ipKey = ipAddrs ? `rate-limit-ip:${ipAddrs}` : null;

  const { success, reset } = await loginRateLimit.limit(identifierKey);

  if (!success && ipKey) {
    const { success: ipSuccess } = await loginRateLimit.limit(ipKey);
    if (!ipSuccess) {
      const minutes = Math.ceil((reset - Date.now()) / 1000 / 60);
      throw new Error(
        `Too many login attempts. Try again in ${minutes} minute${
          minutes !== 1 ? "s" : ""
        }.`,
      );
    }
  }
}
