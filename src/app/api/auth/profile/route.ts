import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { withMiddleware, createResponse } from '@/lib/apiMiddleware';
import { RATE_LIMIT_CONFIGS } from '@/lib/rateLimit';
import { updateProfileSchema } from '@/lib/validation';

// GET - Get current user profile
export const GET = withMiddleware(
  async (request, { user }) => {
    try {
      const dbUser = await User.findById(user!.id).select('-password');
      
      if (!dbUser) {
        return createResponse({ error: 'User not found' }, 404);
      }

      return createResponse({
        success: true,
        user: {
          id: dbUser._id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role,
          avatar: dbUser.avatar,
          phone: dbUser.phone,
          address: dbUser.address,
          isVerified: dbUser.isVerified,
          lastLogin: dbUser.lastLogin,
          createdAt: dbUser.createdAt,
        },
      });
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      return createResponse(
        { error: error.message || 'Failed to fetch profile' },
        500
      );
    }
  },
  {
    rateLimit: RATE_LIMIT_CONFIGS.authenticated,
    requireAuth: true,
  }
);

// PUT - Update current user profile
export const PUT = withMiddleware(
  async (request, { body, user }) => {
    try {
      await connectDB();

      const dbUser = await User.findById(user!.id);
      
      if (!dbUser) {
        return createResponse({ error: 'User not found' }, 404);
      }

      // Update fields
      if (body.name) dbUser.name = body.name;
      if (body.phone !== undefined) dbUser.phone = body.phone;
      if (body.address) dbUser.address = body.address;

      await dbUser.save();

      return createResponse({
        success: true,
        user: {
          id: dbUser._id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role,
          avatar: dbUser.avatar,
          phone: dbUser.phone,
          address: dbUser.address,
        },
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      return createResponse(
        { error: error.message || 'Failed to update profile' },
        500
      );
    }
  },
  {
    rateLimit: RATE_LIMIT_CONFIGS.authenticated,
    requireAuth: true,
    validationSchema: updateProfileSchema,
  }
);
