import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken, setAuthCookie } from '@/lib/auth';
import { withMiddleware, createResponse } from '@/lib/apiMiddleware';
import { RATE_LIMIT_CONFIGS } from '@/lib/rateLimit';
import { registerSchema } from '@/lib/validation';

export const POST = withMiddleware(
  async (request, { body }) => {
    try {
      await connectDB();

      const { email, password, name, phone } = body;

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return createResponse({ error: 'Email already registered' }, 409);
      }

      // Create user (first user is admin)
      const userCount = await User.countDocuments();
      const role = userCount === 0 ? 'admin' : 'user';

      const user = await User.create({
        email: email.toLowerCase(),
        password,
        name,
        phone,
        role,
      });

      // Generate token
      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      });

      // Create response with cookie
      const response = createResponse(
        {
          success: true,
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
        201
      );

      return setAuthCookie(response, token);
    } catch (error: any) {
      console.error('Registration error:', error);
      return createResponse(
        { error: error.message || 'Registration failed' },
        500
      );
    }
  },
  {
    rateLimit: RATE_LIMIT_CONFIGS.auth,
    validationSchema: registerSchema,
  }
);
