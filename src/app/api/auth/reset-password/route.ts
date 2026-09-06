import crypto from 'crypto';
import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import PasswordReset from '@/models/PasswordReset';
import { withMiddleware, createResponse } from '@/lib/apiMiddleware';
import { RATE_LIMIT_CONFIGS } from '@/lib/rateLimit';
import { resetPasswordSchema } from '@/lib/validation';

export const POST = withMiddleware(
  async (request, { body }) => {
    try {
      await connectDB();

      const { token, password } = body;

      // Hash the incoming token to match stored hash
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      // Find valid reset record
      const resetRecord = await PasswordReset.findOne({
        token: hashedToken,
        used: false,
        expiresAt: { $gt: new Date() },
      });

      if (!resetRecord) {
        return createResponse(
          { error: 'Invalid or expired reset link. Please request a new one.' },
          400
        );
      }

      // Find user and update password
      const user = await User.findById(resetRecord.userId);
      if (!user) {
        return createResponse(
          { error: 'Invalid or expired reset link. Please request a new one.' },
          400
        );
      }

      // Update password (the pre-save hook will hash it)
      user.password = password;
      await user.save();

      // Mark token as used
      resetRecord.used = true;
      await resetRecord.save();

      // Invalidate all other reset tokens for this user
      await PasswordReset.updateMany(
        { userId: user._id, used: false },
        { used: true }
      );

      return createResponse({
        success: true,
        message: 'Password updated successfully. You can now sign in with your new password.',
      });
    } catch (error: any) {
      console.error('Reset password error:', error);
      return createResponse(
        { error: 'Failed to reset password. Please try again.' },
        500
      );
    }
  },
  {
    rateLimit: RATE_LIMIT_CONFIGS.auth,
    validationSchema: resetPasswordSchema,
  }
);
