import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken, setAuthCookie } from '@/lib/auth';
import { withMiddleware, createResponse } from '@/lib/apiMiddleware';
import { RATE_LIMIT_CONFIGS } from '@/lib/rateLimit';
import { loginSchema } from '@/lib/validation';

export const POST = withMiddleware(
  async (request, { body }) => {
    try {
      await connectDB();

      const { email, password } = body;

      // Find user with password field
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      
      if (!user) {
        // Use generic error message to prevent email enumeration
        return createResponse({ error: 'Invalid email or password' }, 401);
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        // Use generic error message
        return createResponse({ error: 'Invalid email or password' }, 401);
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      });

      // Create response with cookie
      const response = createResponse({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
        },
      });

      return setAuthCookie(response, token);
    } catch (error: any) {
      console.error('Login error:', error);
      return createResponse(
        { error: error.message || 'Login failed' },
        500
      );
    }
  },
  {
    rateLimit: RATE_LIMIT_CONFIGS.auth,
    validationSchema: loginSchema,
  }
);
