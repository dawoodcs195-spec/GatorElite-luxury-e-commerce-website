/**
 * API Middleware Helper
 * 
 * Combines rate limiting, input validation, and authentication checks.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  checkRateLimit,
  addRateLimitHeaders,
  createRateLimitResponse,
  RATE_LIMIT_CONFIGS,
  RateLimitConfig,
} from './rateLimit';
import { validate, ValidationResult } from './validation';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface MiddlewareOptions {
  /** Rate limit config to use */
  rateLimit?: RateLimitConfig | false;
  /** Zod schema for request body validation */
  validationSchema?: z.ZodTypeAny;
  /** Whether authentication is required */
  requireAuth?: boolean;
  /** Required role for access */
  requiredRole?: 'admin' | 'user';
  /** Whether to extract user from JWT token */
  extractUser?: boolean;
}

export interface RequestContext {
  /** Validated and parsed request body */
  body?: any;
  /** Authenticated user (if requireAuth or extractUser is true) */
  user?: AuthUser;
  /** Rate limit result */
  rateLimitResult?: ReturnType<typeof checkRateLimit>;
}

// ─── Middleware Functions ────────────────────────────────────────────────────

/**
 * Extract and verify JWT token from request
 */
function extractUser(request: NextRequest): AuthUser | null {
  try {
    const token = request.cookies.get('gatorelite_token')?.value;
    
    if (!token) {
      return null;
    }
    
    // JWT payload uses 'userId', map it to 'id' for AuthUser
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.userId || decoded.id,
      email: decoded.email,
      name: decoded.name || '',
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

/**
 * Main middleware function that applies rate limiting, validation, and auth checks
 */
export async function apiMiddleware(
  request: NextRequest,
  options: MiddlewareOptions = {}
): Promise<{ context: RequestContext; error?: NextResponse }> {
  const {
    rateLimit = RATE_LIMIT_CONFIGS.public,
    validationSchema,
    requireAuth = false,
    requiredRole,
    extractUser: shouldExtractUser = false,
  } = options;

  const context: RequestContext = {};

  // ── Rate Limiting ──────────────────────────────────────────────────────
  if (rateLimit !== false) {
    // Extract user first if needed for account-based rate limiting
    let accountId: string | undefined;
    
    if (rateLimit === RATE_LIMIT_CONFIGS.auth) {
      // For auth routes, try to extract email from body for account-based limiting
      try {
        const body = await request.clone().json();
        if (body.email) {
          accountId = body.email.toLowerCase();
        }
      } catch {
        // Body might not be JSON, that's okay
      }
    } else if (requireAuth || shouldExtractUser) {
      // For authenticated routes, use user ID
      const user = extractUser(request);
      if (user) {
        accountId = user.id;
      }
    }

    const rateLimitResult = checkRateLimit(request, rateLimit, accountId);
    context.rateLimitResult = rateLimitResult;

    if (!rateLimitResult.allowed) {
      return {
        context,
        error: createRateLimitResponse(rateLimitResult),
      };
    }
  }

  // ── Authentication ─────────────────────────────────────────────────────
  if (requireAuth || shouldExtractUser) {
    const user = extractUser(request);
    
    if (requireAuth && !user) {
      return {
        context,
        error: NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        ),
      };
    }

    if (requiredRole && user?.role !== requiredRole) {
      return {
        context,
        error: NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        ),
      };
    }

    context.user = user || undefined;
  }

  // ── Input Validation ───────────────────────────────────────────────────
  if (validationSchema && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
    try {
      const body = await request.json();
      const validation = validate(validationSchema, body);

      if (!validation.success) {
        return {
          context,
          error: NextResponse.json(
            {
              error: validation.error,
              details: 'details' in validation ? validation.details : [],
            },
            { status: 400 }
          ),
        };
      }

      context.body = validation.data;
    } catch {
      return {
        context,
        error: NextResponse.json(
          { error: 'Invalid JSON body' },
          { status: 400 }
        ),
      };
    }
  }

  // ── Success ────────────────────────────────────────────────────────────
  return { context };
}

/**
 * Create a response with rate limit headers
 */
export function createResponse(
  data: any,
  status: number = 200,
  rateLimitResult?: ReturnType<typeof checkRateLimit>
): NextResponse {
  const response = NextResponse.json(data, { status });

  if (rateLimitResult) {
    addRateLimitHeaders(rateLimitResult, response.headers);
  }

  return response;
}

/**
 * Helper to wrap API route handlers with middleware
 */
export function withMiddleware(
  handler: (
    request: NextRequest,
    context: RequestContext
  ) => Promise<NextResponse>,
  options: MiddlewareOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const { context, error } = await apiMiddleware(request, options);

    if (error) {
      return error;
    }

    return handler(request, context);
  };
}
