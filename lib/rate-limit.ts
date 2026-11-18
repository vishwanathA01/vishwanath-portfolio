/**
 * Tiny in-memory sliding-window limiter (per server instance).
 * Good enough to slow down abuse of public endpoints on a personal site.
 */
const buckets = new Map<string, number[]>();

export function clientIp(req: Request) {
  return (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
}

/** Records one hit for `key` and returns true when it exceeds `max` hits within `windowMs`. */
export function rateLimited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (buckets.get(key) || []).filter(t => now - t < windowMs);
  const limited = recent.length >= max;
  if (!limited) recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 5000) buckets.clear();
  return limited;
}

/** Clears the hits recorded for `key` (e.g. after a successful login). */
export function resetLimit(key: string) {
  buckets.delete(key);
}
