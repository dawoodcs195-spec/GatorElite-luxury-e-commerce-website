/**
 * Input Validation Schemas using Zod
 * 
 * All inputs are validated against strict schemas.
 * Invalid input is rejected, not sanitized.
 */

import { z } from 'zod';

// ─── Common Schemas ─────────────────────────────────────────────────────────

/** Email format validation */
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .max(255, 'Email must be at most 255 characters')
  .email('Invalid email format')
  .toLowerCase()
  .trim();

/** Password validation - minimum 6 characters */
const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(128, 'Password must be at most 128 characters');

/** Name validation */
const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must be at most 100 characters')
  .trim();

/** Phone number validation (optional) */
const phoneSchema = z
  .string()
  .max(20, 'Phone must be at most 20 characters')
  .regex(/^[\d\s\-\+\(\)]*$/, 'Invalid phone format')
  .optional()
  .or(z.literal(''));

/** Slug validation */
const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(100, 'Slug must be at most 100 characters')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
  .trim();

/** Price validation */
const priceSchema = z
  .number()
  .positive('Price must be positive')
  .max(999999.99, 'Price must be less than 1,000,000')
  .transform((val) => Math.round(val * 100) / 100); // Round to 2 decimals

/** Rating validation (1-5) */
const ratingSchema = z
  .number()
  .int('Rating must be an integer')
  .min(1, 'Rating must be at least 1')
  .max(5, 'Rating must be at most 5');

/** URL validation */
const urlSchema = z
  .string()
  .max(2048, 'URL must be at most 2048 characters')
  .url('Invalid URL format')
  .optional()
  .or(z.literal(''));

/** Hex color validation */
const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format')
  .default('#0A0A0A');

// ─── Auth Schemas ───────────────────────────────────────────────────────────

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  phone: phoneSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
});

export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  phone: phoneSchema,
  address: z
    .object({
      street: z.string().max(200).optional().or(z.literal('')),
      city: z.string().max(100).optional().or(z.literal('')),
      state: z.string().max(100).optional().or(z.literal('')),
      zip: z.string().max(20).optional().or(z.literal('')),
      country: z.string().max(100).optional().or(z.literal('')),
    })
    .optional(),
});

// ─── Product Schemas ────────────────────────────────────────────────────────

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(200, 'Product name must be at most 200 characters')
    .trim(),
  slug: slugSchema.optional(),
  subtitle: z
    .string()
    .max(500, 'Subtitle must be at most 500 characters')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(5000, 'Description must be at most 5000 characters')
    .optional()
    .or(z.literal('')),
  price: priceSchema,
  priceFormatted: z.string().optional(),
  colorName: z
    .string()
    .max(50, 'Color name must be at most 50 characters')
    .optional()
    .or(z.literal('')),
  colorHex: hexColorSchema,
  bgColor: z
    .string()
    .max(50, 'Background color must be at most 50 characters')
    .optional()
    .or(z.literal('')),
  rating: ratingSchema.default(5),
  images: z
    .array(z.string().url('Invalid image URL').max(2048))
    .max(20, 'Maximum 20 images allowed')
    .default([]),
  sizes: z
    .array(z.string().max(10))
    .max(20, 'Maximum 20 sizes allowed')
    .optional()
    .default([]),
  features: z
    .array(z.string().max(200))
    .max(20, 'Maximum 20 features allowed')
    .optional()
    .default([]),
  specs: z
    .record(z.string(), z.string().max(200))
    .optional()
    .default({}),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export const updateProductSchema = createProductSchema.partial();

// ─── Cart Schemas ───────────────────────────────────────────────────────────

export const addToCartSchema = z.object({
  productId: z
    .string()
    .min(1, 'Product ID is required')
    .max(50, 'Invalid product ID'),
  size: z
    .string()
    .max(10, 'Size must be at most 10 characters')
    .optional()
    .or(z.literal('')),
  quantity: z
    .number()
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1')
    .max(10, 'Maximum 10 items per product')
    .default(1),
});

export const updateCartItemSchema = z.object({
  itemId: z
    .string()
    .min(1, 'Item ID is required')
    .max(50, 'Invalid item ID'),
  quantity: z
    .number()
    .int('Quantity must be an integer')
    .min(0, 'Quantity must be at least 0')
    .max(10, 'Maximum 10 items per product'),
});

// ─── Order Schemas ──────────────────────────────────────────────────────────

export const createOrderSchema = z.object({
  shipping: z.object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    address: z
      .string()
      .min(1, 'Address is required')
      .max(300, 'Address must be at most 300 characters')
      .trim(),
    city: z
      .string()
      .min(1, 'City is required')
      .max(100, 'City must be at most 100 characters')
      .trim(),
    state: z
      .string()
      .min(1, 'State is required')
      .max(100, 'State must be at most 100 characters')
      .trim(),
    zip: z
      .string()
      .min(1, 'ZIP code is required')
      .max(20, 'ZIP code must be at most 20 characters')
      .trim(),
    country: z
      .string()
      .min(1, 'Country is required')
      .max(100, 'Country must be at most 100 characters')
      .trim(),
  }),
  paymentMethod: z
    .enum(['card', 'paypal', 'bank'], {
      message: 'Invalid payment method',
    })
    .default('card'),
});

// ─── Contact Schemas ────────────────────────────────────────────────────────

export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z
    .string()
    .max(200, 'Subject must be at most 200 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be at most 5000 characters')
    .trim(),
});

// ─── Review Schemas ─────────────────────────────────────────────────────────

export const createReviewSchema = z.object({
  rating: ratingSchema,
  comment: z
    .string()
    .max(2000, 'Comment must be at most 2000 characters')
    .optional()
    .or(z.literal('')),
});

// ─── Validation Helper ──────────────────────────────────────────────────────

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; details: string[] };

/**
 * Validate data against a Zod schema
 * Returns structured error response
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const details = result.error.issues.map(
    (err: any) => `${err.path.join('.')}: ${err.message}`
  );
  
  return {
    success: false,
    error: 'Validation failed',
    details,
  };
}

/**
 * Create validation error response
 */
export function validationErrorResponse(
  validationResult: ValidationResult<never>
): Response {
  const error = validationResult.success ? 'Validation failed' : validationResult.error;
  const details = validationResult.success ? [] : validationResult.details;
  
  return new Response(
    JSON.stringify({ error, details }),
    {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
