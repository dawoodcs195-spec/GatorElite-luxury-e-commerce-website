/**
 * Rate Limiter with IP + Account tracking and Exponential Backoff
 * 
 * All thresholds are configurable via environment variables:
 * - RATE_LIMIT_AUTH_WINDOW_MS: Auth rate limit window (default: 900000 = 15min)
 * - RATE_LIMIT_AUTH_MAX_IP: Max requests per IP for auth routes (default: 5)
 * - RATE_LIMIT_AUTH_MAX_ACCOUNT: Max requests per account for auth routes (default: 3)
 * - RATE_LIMIT_PUBLIC_WINDOW_MS: Public rate limit window (default: 60000 = 1min)
 * - RATE_LIMIT_PUBLIC_MAX: Max requests for public routes (default: 60)
 * - RATE_LIMIT_AUTHENTICATED_WINDOW_MS: Authenticated rate limit window (default: 60000 = 1min)
 * - RATE_LIMIT_AUTHENTICATED_MAX: Max requests for authenticated routes (default: 120)
 * - RATE_LIMIT_BACKOFF_BASE_MS: Base backoff time (default: 60000 = 1min)
 * - RATE_LIMIT_BACKOFF_MAX_MS: Max backoff time (default: 3600000 = 1hour)
 */

import { NextRequest, NextResponse } from 'next/server';

// ─── Configuration ──────────────────────────────────────────────────────────

export interface RateLimitConfig {
  /** Window duration in milliseconds */
  windowMs: number;
  /** Maximum requests per window for IP-based limiting */
  maxPerIp: number;
  /** Maximum requests per window for account-based limiting (optional) */
  maxPerAccount?: number;
  /** Base backoff time in milliseconds for exponential backoff */
  backoffBaseMs: number;
  /** Maximum backoff time in milliseconds */
  backoffMaxMs: number;
  /** Key prefix for storage */
  keyPrefix: string;
}

// Default configurations for different endpoint types
export const RATE_LIMIT_CONFIGS = {
  /** Strict limits for authentication routes (login, register, password reset) */
  auth: {
    windowMs: parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS || '900000', 10), // 15 minutes
    maxPerIp: parseInt(process.env.RATE_LIMIT_AUTH_MAX_IP || '5', 10),
    maxPerAccount: parseInt(process.env.RATE_LIMIT_AUTH_MAX_ACCOUNT || '3', 10),
    backoffBaseMs: parseInt(process.env.RATE_LIMIT_BACKOFF_BASE_MS || '60000', 10), // 1 minute
    backoffMaxMs: parseInt(process.env.RATE_LIMIT_BACKOFF_MAX_MS || '3600000', 10), // 1 hour
    keyPrefix: 'rl:auth',
  },

  /** Moderate limits for public endpoints (product listings, search) */
  public: {
    windowMs: parseInt(process.env.RATE_LIMIT_PUBLIC_WINDOW_MS || '60000', 10), // 1 minute
    maxPerIp: parseInt(process.env.RATE_LIMIT_PUBLIC_MAX || '60', 10),
    backoffBaseMs: parseInt(process.env.RATE_LIMIT_BACKOFF_BASE_MS || '60000', 10),
    backoffMaxMs: parseInt(process.env.RATE_LIMIT_BACKOFF_MAX_MS || '3600000', 10),
    keyPrefix: 'rl:public',
  },

  /** Looser limits for authenticated user actions */
  authenticated: {
    windowMs: parseInt(process.env.RATE_LIMIT_AUTHENTICATED_WINDOW_MS || '60000', 10), // 1 minute
    maxPerIp: parseInt(process.env.RATE_LIMIT_AUTHENTICATED_MAX || '120', 10),
    backoffBaseMs: parseInt(process.env.RATE_LIMIT_BACKOFF_BASE_MS || '60000', 10),
    backoffMaxMs: parseInt(process.env.RATE_LIMIT_BACKOFF_MAX_MS || '3600000', 10),
    keyPrefix: 'rl:authd',
  },
} as const;

// ─── In-Memory Store (production should use Redis) ──────────────────────────

interface RateLimitEntry {
  /** Timestamp of first request in current window */
  windowStart: number;
  /** Number of requests in current window */
  count: number;
  /** Current backoff multiplier (doubles on each violation) */
  backoffMultiplier: number;
  /** Timestamp when rate limit expires (after backoff) */
  blockedUntil: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(store.entries());
  for (const [key, entry] of entries) {
    if (now > entry.windowStart + entry.backoffMultiplier * 60000) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

// ─── Helper Functions ───────────────────────────────────────────────────────

/**
 * Get client IP from request
 */
function getClientIp(request: NextRequest): string {
  // Check various headers for real IP (behind proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  // Fallback to localhost
  return '127.0.0.1';
}

/**
 * Calculate backoff time with exponential increase
 */
function calculateBackoff(
  backoffMultiplier: number,
  backoffBaseMs: number,
  backoffMaxMs: number
): number {
  return Math.min(backoffBaseMs * Math.pow(2, backoffMultiplier - 1), backoffMaxMs);
}

// ─── Main Rate Limit Function ───────────────────────────────────────────────

export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Number of requests remaining in current window */
  remaining: number;
  /** Time until rate limit resets (in seconds) */
  resetIn: number;
  /** Total limit for current window */
  limit: number;
  /** Retry after time in seconds (only if blocked) */
  retryAfter?: number;
  /** Whether this is an IP or account block */
  blockedBy?: 'ip' | 'account';
}

/**
 * Check rate limit for a request
 * 
 * @param request - NextRequest object
 * @param config - Rate limit configuration
 * @param accountId - Optional account ID for account-based limiting
 * @returns RateLimitResult
 */
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  accountId?: string
): RateLimitResult {
  const now = Date.now();
  const ip = getClientIp(request);
  
  // Check IP-based rate limit
  const ipKey = `${config.keyPrefix}:ip:${ip}`;
  const ipResult = checkKey(ipKey, config, now);
  
  if (!ipResult.allowed) {
    return { ...ipResult, blockedBy: 'ip' };
  }
  
  // Check account-based rate limit if accountId provided
  if (accountId && config.maxPerAccount) {
    const accountKey = `${config.keyPrefix}:acct:${accountId}`;
    const accountResult = checkKey(accountKey, {
      ...config,
      maxPerIp: config.maxPerAccount,
    }, now);
    
    if (!accountResult.allowed) {
      return { ...accountResult, blockedBy: 'account' };
    }
    
    // Return the more restrictive result
    return ipResult.remaining < accountResult.remaining ? ipResult : accountResult;
  }
  
  return ipResult;
}

/**
 * Check rate limit for a specific key
 */
function checkKey(
  key: string,
  config: RateLimitConfig,
  now: number
): RateLimitResult {
  const entry = store.get(key);
  
  // No entry or window expired - create new entry
  if (!entry || now > entry.windowStart + config.windowMs) {
    const newEntry: RateLimitEntry = {
      windowStart: now,
      count: 1,
      backoffMultiplier: 1,
      blockedUntil: 0,
    };
    store.set(key, newEntry);
    
    return {
      allowed: true,
      remaining: config.maxPerIp - 1,
      resetIn: Math.ceil(config.windowMs / 1000),
      limit: config.maxPerIp,
    };
  }
  
  // Check if currently blocked due to backoff
  if (entry.blockedUntil > now) {
    const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((entry.windowStart + config.windowMs - now) / 1000),
      limit: config.maxPerIp,
      retryAfter,
    };
  }
  
  // Increment counter
  entry.count++;
  
  // Check if limit exceeded
  if (entry.count > config.maxPerIp) {
    // Calculate backoff
    const backoffMs = calculateBackoff(
      entry.backoffMultiplier,
      config.backoffBaseMs,
      config.backoffMaxMs
    );
    
    // Apply backoff - double the multiplier for next violation
    entry.blockedUntil = now + backoffMs;
    entry.backoffMultiplier *= 2;
    
    const retryAfter = Math.ceil(backoffMs / 1000);
    
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((entry.windowStart + config.windowMs - now) / 1000),
      limit: config.maxPerIp,
      retryAfter,
    };
  }
  
  // Within limits
  return {
    allowed: true,
    remaining: config.maxPerIp - entry.count,
    resetIn: Math.ceil((entry.windowStart + config.windowMs - now) / 1000),
    limit: config.maxPerIp,
  };
}

/**
 * Reset rate limit for a specific key (e.g., after successful password change)
 */
export function resetRateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  accountId?: string
): void {
  const ip = getClientIp(request);
  const ipKey = `${config.keyPrefix}:ip:${ip}`;
  store.delete(ipKey);
  
  if (accountId) {
    const accountKey = `${config.keyPrefix}:acct:${accountId}`;
    store.delete(accountKey);
  }
}

/**
 * Add rate limit headers to response
 */
export function addRateLimitHeaders(
  result: RateLimitResult,
  headers: Headers
): Headers {
  headers.set('X-RateLimit-Limit', result.limit.toString());
  headers.set('X-RateLimit-Remaining', result.remaining.toString());
  headers.set('X-RateLimit-Reset', result.resetIn.toString());
  
  if (result.retryAfter) {
    headers.set('Retry-After', result.retryAfter.toString());
  }
  
  return headers;
}

/**
 * Create rate limit error response
 */
export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  const message = result.blockedBy === 'account'
    ? 'Too many attempts for this account. Please try again later.'
    : 'Too many requests from this IP. Please try again later.';
  
  return NextResponse.json(
    {
      error: 'Rate limit exceeded',
      message,
      retryAfter: result.retryAfter,
    },
    {
      status: 429,
      headers: {
        'Retry-After': (result.retryAfter || 60).toString(),
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': '0',
      },
    }
  );
}
