import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import { withMiddleware, createResponse } from '@/lib/apiMiddleware';
import { RATE_LIMIT_CONFIGS } from '@/lib/rateLimit';
import { z } from 'zod';
import { createReviewSchema } from '@/lib/validation';
import { createErrorResponse, getErrorMessage, ERROR_MESSAGES } from '@/lib/errors';

// GET - Fetch reviews for a product
export const GET = withMiddleware(
  async (request) => {
    try {
      await connectDB();
      const { searchParams } = new URL(request.url);
      const productId = searchParams.get('productId');

      if (!productId) {
        return createErrorResponse(null, 'Product ID is required', 400);
      }

      const reviews = await Review.find({ productId })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      // Calculate stats
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

      // Rating distribution
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      reviews.forEach((r) => {
        distribution[r.rating as keyof typeof distribution]++;
      });

      return NextResponse.json({
        reviews,
        stats: {
          total: totalReviews,
          average: Math.round(averageRating * 10) / 10,
          distribution,
        },
      });
    } catch (e) {
      return createErrorResponse(e, getErrorMessage(e));
    }
  },
  {
    rateLimit: RATE_LIMIT_CONFIGS.public,
  }
);

// POST - Submit a review
export const POST = withMiddleware(
  async (request, { body, user }) => {
    try {
      await connectDB();

      const { productId, rating, comment } = body;

      // Check if user already reviewed this product
      const existing = await Review.findOne({
        productId,
        userId: user!.id,
      });

      if (existing) {
        return createErrorResponse(null, 'You have already reviewed this product', 409);
      }

      // Create review
      const review = await Review.create({
        productId,
        userId: user!.id,
        userName: user!.name,
        rating,
        comment: comment || '',
      });

      // Update product's average rating
      const allReviews = await Review.find({ productId }).lean();
      const totalReviews = allReviews.length;
      const avgRating = totalReviews > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : rating;

      await Product.findByIdAndUpdate(productId, {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: totalReviews,
      });

      return NextResponse.json({
        success: true,
        review: {
          _id: review._id,
          rating: review.rating,
          comment: review.comment,
          userName: review.userName,
          createdAt: review.createdAt,
        },
      }, { status: 201 });
    } catch (e) {
      return createErrorResponse(e, getErrorMessage(e));
    }
  },
  {
    rateLimit: RATE_LIMIT_CONFIGS.authenticated,
    requireAuth: true,
    validationSchema: z.object({
      productId: z.string().min(1),
      rating: z.number().int().min(1).max(5),
      comment: z.string().max(2000).optional().or(z.literal('')),
    }),
  }
);
