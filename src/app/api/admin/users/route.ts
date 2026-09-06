import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { withMiddleware, createResponse } from '@/lib/apiMiddleware';
import { RATE_LIMIT_CONFIGS } from '@/lib/rateLimit';

// GET - Fetch all users (admin only)
export const GET = withMiddleware(
  async (request) => {
    try {
      await connectDB();

      const users = await User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();

      const stats = {
        total: users.length,
        admin: users.filter(u => u.role === 'admin').length,
        users: users.filter(u => u.role === 'user').length,
      };

      return createResponse({ success: true, users, stats });
    } catch (error: any) {
      console.error('Fetch users error:', error);
      return createResponse({ error: error.message || 'Failed to fetch users' }, 500);
    }
  },
  {
    rateLimit: RATE_LIMIT_CONFIGS.authenticated,
    requireAuth: true,
  }
);
