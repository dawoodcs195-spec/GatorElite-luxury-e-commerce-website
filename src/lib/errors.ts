/**
 * Error Handling Utilities
 * 
 * Ensures users never see stack traces, internal file paths, or raw database errors.
 * All errors are logged server-side with full details.
 */

// ─── Safe Error Response ────────────────────────────────────────────────────

/**
 * Create a safe error response that never leaks internal details
 * @param error - The original error (logged server-side)
 * @param userMessage - Safe message to show to the user
 * @param status - HTTP status code
 */
import { NextResponse } from 'next/server';

export function createErrorResponse(
  error: unknown,
  userMessage: string,
  status: number = 500
): NextResponse {
  // Log full error details server-side for debugging
  logError('API Error', error);
  
  // Return generic message to client
  return NextResponse.json(
    { error: userMessage },
    { status }
  );
}

/**
 * Log error with full details (server-side only)
 */
export function logError(context: string, error: unknown): void {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${context}]`;
  
  if (error instanceof Error) {
    console.error(`${prefix} ${error.message}`);
    if (error.stack) {
      console.error(`${prefix} Stack: ${error.stack}`);
    }
  } else if (typeof error === 'string') {
    console.error(`${prefix} ${error}`);
  } else {
    console.error(`${prefix} Unknown error:`, error);
  }
}

// ─── User-Friendly Error Messages ───────────────────────────────────────────

export const ERROR_MESSAGES = {
  // Auth
  AUTH_REQUIRED: 'Authentication required',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'Email already registered',
  REGISTRATION_FAILED: 'Registration failed',
  LOGIN_FAILED: 'Login failed',
  LOGOUT_FAILED: 'Logout failed',
  TOKEN_EXPIRED: 'Session expired',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  
  // Profile
  PROFILE_FETCH_FAILED: 'Failed to load profile',
  PROFILE_UPDATE_FAILED: 'Failed to update profile',
  USER_NOT_FOUND: 'User not found',
  
  // Products
  PRODUCT_NOT_FOUND: 'Product not found',
  PRODUCTS_FETCH_FAILED: 'Failed to load products',
  PRODUCT_CREATE_FAILED: 'Failed to create product',
  PRODUCT_UPDATE_FAILED: 'Failed to update product',
  PRODUCT_DELETE_FAILED: 'Failed to delete product',
  
  // Upload
  UPLOAD_FAILED: 'Failed to upload file',
  INVALID_FILE_TYPE: 'Invalid file type',
  FILE_TOO_LARGE: 'File too large',
  
  // Orders
  ORDER_FAILED: 'Failed to process order',
  ORDER_NOT_FOUND: 'Order not found',
  
  // Seed
  SEED_FAILED: 'Failed to seed database',
  
  // Generic
  INTERNAL_ERROR: 'An error occurred',
  VALIDATION_ERROR: 'Invalid input',
  RATE_LIMITED: 'Too many requests',
} as const;

/**
 * Map common error types to user-friendly messages
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    
    // MongoDB errors
    if (msg.includes('e11000') || msg.includes('duplicate')) {
      return 'A record with that value already exists';
    }
    if (msg.includes('validation failed')) {
      return 'Invalid data provided';
    }
    if (msg.includes('casterror') || msg.includes('cast to')) {
      return 'Invalid ID format';
    }
    if (msg.includes('connect') || msg.includes('timeout')) {
      return 'Database connection error';
    }
    
    // JWT errors
    if (msg.includes('jwt') || msg.includes('token')) {
      return 'Session expired';
    }
    
    // File system errors
    if (msg.includes('enoent')) {
      return 'File not found';
    }
    if (msg.includes('eperm') || msg.includes('eacces')) {
      return 'Permission denied';
    }
  }
  
  return ERROR_MESSAGES.INTERNAL_ERROR;
}
