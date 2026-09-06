import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { withMiddleware, createResponse } from '@/lib/apiMiddleware';
import { RATE_LIMIT_CONFIGS } from '@/lib/rateLimit';
import { createProductSchema } from '@/lib/validation';

// GET - Public, moderate rate limit
export const GET = withMiddleware(
  async (request) => {
    try {
      await connectDB();
      const { searchParams } = new URL(request.url);
      const slug = searchParams.get('slug');
      
      if (slug) {
        const product = await Product.findOne({ slug });
        if (!product) return createResponse({ error: 'Not found' }, 404);
        return createResponse(product);
      }
      
      const products = await Product.find({}).sort({ createdAt: -1 });
      return createResponse(products);
    } catch (e: any) {
      return createResponse({ error: e.message }, 500);
    }
  },
  {
    rateLimit: RATE_LIMIT_CONFIGS.public,
  }
);

// POST - Admin only, authenticated rate limit
export const POST = withMiddleware(
  async (request, { body }) => {
    try {
      await connectDB();
      const product = await Product.create(body);
      return createResponse(product, 201);
    } catch (e: any) {
      return createResponse({ error: e.message }, 500);
    }
  },
  {
    rateLimit: RATE_LIMIT_CONFIGS.authenticated,
    requireAuth: true,
    requiredRole: 'admin',
    validationSchema: createProductSchema,
  }
);
