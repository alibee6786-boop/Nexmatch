// Simple rate limiter utility: uses Redis if REDIS_URL is set, otherwise falls back to in-memory Map.

import Redis from "ioredis";

let redis: Redis | null = null;
if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
}

type LimitResult = { allowed: boolean; remaining: number; reset: number };

const memoryStore = new Map<string, { count: number; expiresAt: number }>();

export async function rateLimit(key: string, limit = 5, windowSec = 60 * 60): Promise<LimitResult> {
  if (redis) {
    // Use Redis INCR with EXPIRE
    const redisKey = `rate:${key}`;
    const val = await redis.incr(redisKey);
    if (val === 1) {
      await redis.expire(redisKey, windowSec);
    }
    const ttl = await redis.ttl(redisKey);
    const remaining = Math.max(0, limit - val);
    return { allowed: val <= limit, remaining, reset: ttl };
  }

  const now = Date.now();
  const entry = memoryStore.get(key);
  if (!entry || entry.expiresAt < now) {
    memoryStore.set(key, { count: 1, expiresAt: now + windowSec * 1000 });
    return { allowed: true, remaining: limit - 1, reset: windowSec };
  }

  entry.count += 1;
  memoryStore.set(key, entry);
  const remaining = Math.max(0, limit - entry.count);
  const reset = Math.ceil((entry.expiresAt - now) / 1000);
  return { allowed: entry.count <= limit, remaining, reset };
}
