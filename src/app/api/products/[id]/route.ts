import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { withMiddleware, createResponse } from '@/lib/apiMiddleware';
import { RATE_LIMIT_CONFIGS } from '@/lib/rateLimit';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id);
    if (!product) return createResponse({ error: 'Product not found' }, 404);
    return createResponse(product);
  } catch (e: any) {
    return createResponse({ error: e.message }, 500);
  }
}

export const PUT = withMiddleware(
  async (request, { body }) => {
    try {
      await connectDB();
      const url = new URL(request.url);
      const id = url.pathname.split('/').pop();
      const data = body || await request.json();
      const product = await Product.findByIdAndUpdate(id, data, { new: true });
      if (!product) return createResponse({ error: 'Product not found' }, 404);
      return createResponse(product);
    } catch (e: any) {
      return createResponse({ error: e.message }, 500);
    }
  },
  {
    rateLimit: RATE_LIMIT_CONFIGS.authenticated,
    requireAuth: true,
    requiredRole: 'admin',
  }
);

export const DELETE = withMiddleware(
  async (request) => {
    try {
      await connectDB();
      const url = new URL(request.url);
      const id = url.pathname.split('/').pop();
      await Product.findByIdAndDelete(id);
      return createResponse({ success: true });
    } catch (e: any) {
      return createResponse({ error: e.message }, 500);
    }
  },
  {
    rateLimit: RATE_LIMIT_CONFIGS.authenticated,
    requireAuth: true,
    requiredRole: 'admin',
  }
);
