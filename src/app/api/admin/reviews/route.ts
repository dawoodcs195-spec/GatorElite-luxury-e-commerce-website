import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import { withMiddleware, createResponse } from '@/lib/apiMiddleware';
import { RATE_LIMIT_CONFIGS } from '@/lib/rateLimit';

// GET - Fetch all reviews (admin only)
export const GET = withMiddleware(
  async (request) => {
    try {
      await connectDB();

      const reviews = await Review.find()
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();

      const stats = {
        total: reviews.length,
        average: reviews.length > 0
          ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
          : 0,
        distribution: {
          5: reviews.filter(r => r.rating === 5).length,
          4: reviews.filter(r => r.rating === 4).length,
          3: reviews.filter(r => r.rating === 3).length,
          2: reviews.filter(r => r.rating === 2).length,
          1: reviews.filter(r => r.rating === 1).length,
        },
      };

      return createResponse({ success: true, reviews, stats });
    } catch (error: any) {
      console.error('Fetch reviews error:', error);
      return createResponse({ error: error.message || 'Failed to fetch reviews' }, 500);
    }
  },
  {
    rateLimit: RATE_LIMIT_CONFIGS.authenticated,
    requireAuth: true,
  }
);
