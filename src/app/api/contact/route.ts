import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContactMessage from '@/models/ContactMessage';
import { withMiddleware, createResponse } from '@/lib/apiMiddleware';
import { RATE_LIMIT_CONFIGS } from '@/lib/rateLimit';
import { contactSchema } from '@/lib/validation';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendContactEmail(data: { name: string; email: string; message: string }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials not configured — skipping email notification');
    return;
  }

  await transporter.sendMail({
    from: `"GatorÉlite Website" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
    replyTo: data.email,
    subject: `New Contact Message from ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #C8A96E;">New Contact Message</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <hr style="border: 1px solid #eee;" />
        <p>${data.message.replace(/\n/g, '<br/>')}</p>
      </div>
    `,
  });
}

// POST - Submit contact message
export const POST = withMiddleware(
  async (request, { body }) => {
    try {
      await connectDB();

      // Save to database
      const contactMessage = await ContactMessage.create({
        name: body.name,
        email: body.email,
        message: body.message,
      });

      // Send email notification (non-blocking)
      sendContactEmail(body).catch((err) =>
        console.error('Failed to send contact email:', err)
      );

      return createResponse(
        {
          success: true,
          message: 'Your message has been received. We will get back to you shortly.',
        },
        201
      );
    } catch (error: any) {
      console.error('Contact form error:', error);
      return createResponse(
        { error: error.message || 'Failed to send message' },
        500
      );
    }
  },
  {
    rateLimit: RATE_LIMIT_CONFIGS.auth,
    validationSchema: contactSchema,
  }
);

// GET - Fetch all messages (admin only)
export const GET = withMiddleware(
  async (request) => {
    try {
      await connectDB();

      const messages = await ContactMessage.find()
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      return createResponse({
        success: true,
        messages,
        total: await ContactMessage.countDocuments(),
      });
    } catch (error: any) {
      console.error('Fetch messages error:', error);
      return createResponse(
        { error: error.message || 'Failed to fetch messages' },
        500
      );
    }
  },
  {
    rateLimit: RATE_LIMIT_CONFIGS.authenticated,
    requireAuth: true,
  }
);
