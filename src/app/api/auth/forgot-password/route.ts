import crypto from 'crypto';
import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import PasswordReset from '@/models/PasswordReset';
import { withMiddleware, createResponse } from '@/lib/apiMiddleware';
import { RATE_LIMIT_CONFIGS } from '@/lib/rateLimit';
import { forgotPasswordSchema } from '@/lib/validation';

export const POST = withMiddleware(
  async (request, { body }) => {
    try {
      await connectDB();

      const { email } = body;

      // Find user
      const user = await User.findOne({ email: email.toLowerCase() });

      // Always return success to prevent email enumeration
      if (!user) {
        return createResponse({
          success: true,
          message: 'If an account with that email exists, a reset link has been sent.',
        });
      }

      // Invalidate any existing reset tokens for this user
      await PasswordReset.updateMany(
        { userId: user._id, used: false },
        { used: true }
      );

      // Generate secure reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

      // Store hashed token (expire in 1 hour)
      await PasswordReset.create({
        userId: user._id,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      });

      // Send reset email
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

      await transporter.sendMail({
        from: `"GatorÉlite" <${process.env.SMTP_USER || 'noreply@gatorelite.com'}>`,
        to: user.email,
        subject: 'Reset Your Password — GatorÉlite',
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #F5F0E8; padding: 40px;">
            <h1 style="font-family: Georgia, serif; color: #C9A96E; font-size: 28px; text-align: center; margin-bottom: 8px;">GatorÉlite</h1>
            <div style="height: 1px; background: linear-gradient(90deg, transparent, #C9A96E, transparent); margin: 24px 0;"></div>
            <h2 style="color: #F5F0E8; font-size: 22px; font-family: Georgia, serif;">Password Reset Request</h2>
            <p style="color: #A09882; line-height: 1.6; font-size: 14px;">
              We received a request to reset the password for your GatorÉlite account.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #C9A96E, #B87333); color: #0A0A0A; text-decoration: none; padding: 14px 36px; font-size: 12px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">
                Reset Password
              </a>
            </div>
            <p style="color: #6B6355; font-size: 12px; line-height: 1.6;">
              This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.
            </p>
            <div style="height: 1px; background: linear-gradient(90deg, transparent, #5C3A21, transparent); margin: 32px 0;"></div>
            <p style="color: #5C4A3A; font-size: 11px; text-align: center;">
              &copy; ${new Date().getFullYear()} GatorÉlite. Handcrafted with precision.
            </p>
          </div>
        `,
      });

      return createResponse({
        success: true,
        message: 'If an account with that email exists, a reset link has been sent.',
      });
    } catch (error: any) {
      console.error('Forgot password error:', error);
      // Still return success to prevent information leakage
      return createResponse({
        success: true,
        message: 'If an account with that email exists, a reset link has been sent.',
      });
    }
  },
  {
    rateLimit: RATE_LIMIT_CONFIGS.auth,
    validationSchema: forgotPasswordSchema,
  }
);
