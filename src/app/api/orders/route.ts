import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { withMiddleware, createResponse } from '@/lib/apiMiddleware';
import { RATE_LIMIT_CONFIGS } from '@/lib/rateLimit';
import { z } from 'zod';
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

async function sendOrderEmail(orderData: {
  customerName: string;
  customerEmail: string;
  items: Array<{ name: string; price: number; quantity: number; size?: string; color?: string }>;
  totalAmount: number;
  shipping: { address: string; city: string; state?: string; zip?: string; country?: string };
}) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials not configured — skipping email notification');
    return;
  }

  const adminEmail = process.env.ORDER_EMAIL || process.env.SMTP_USER || 'dawood.cs195@gmail.com';

  const itemsHtml = orderData.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.size || '-'}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.color || '-'}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
        </tr>
      `
    )
    .join('');

  await transporter.sendMail({
    from: `"GatorÉlite Orders" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    replyTo: orderData.customerEmail,
    subject: `New Order from ${orderData.customerName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #C8A96E;">New Order Received</h2>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Customer Details</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${orderData.customerName}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${orderData.customerEmail}</p>
        </div>

        <h3 style="color: #333; margin-bottom: 10px;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #C8A96E; color: white;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: left;">Size</th>
              <th style="padding: 10px; text-align: left;">Color</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
              <td style="padding: 10px; text-align: right; font-weight: bold; color: #C8A96E;">$${orderData.totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Shipping Address</h3>
          <p style="margin: 5px 0;">${orderData.shipping.address}</p>
          <p style="margin: 5px 0;">${orderData.shipping.city}${orderData.shipping.state ? ', ' + orderData.shipping.state : ''} ${orderData.shipping.zip || ''}</p>
          <p style="margin: 5px 0;">${orderData.shipping.country || ''}</p>
        </div>
      </div>
    `,
  });
}

// GET - Fetch all orders (admin sees all, users see their own)
export const GET = withMiddleware(
  async (request, { user }) => {
    try {
      await connectDB();
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('userId');

      // Non-admins can only see their own orders
      const filter: any = {};
      if (user?.role === 'admin') {
        if (userId) filter.userId = userId;
      } else {
        filter.userId = user?.id;
      }

      const orders = await Order.find(filter)
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();

      const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        revenue: orders
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, o) => sum + o.totalAmount, 0),
      };

      return createResponse({ success: true, orders, stats });
    } catch (error: any) {
      console.error('Fetch orders error:', error);
      return createResponse({ error: error.message || 'Failed to fetch orders' }, 500);
    }
  },
  {
    rateLimit: RATE_LIMIT_CONFIGS.authenticated,
    requireAuth: true,
  }
);

// POST - Create a new order
export const POST = withMiddleware(
  async (request, { body }) => {
    try {
      await connectDB();

      const data = body;

      const order = await Order.create({
        userId: data.userId || undefined,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        items: data.items,
        totalAmount: data.totalAmount,
        shipping: data.shipping,
        status: 'pending',
      });

      // Send email notification (non-blocking)
      sendOrderEmail({
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        items: data.items,
        totalAmount: data.totalAmount,
        shipping: data.shipping,
      }).catch((err) => console.error('Failed to send order email:', err));

      return createResponse({ success: true, order }, 201);
    } catch (error: any) {
      console.error('Create order error:', error);
      return createResponse({ error: error.message || 'Failed to create order' }, 500);
    }
  },
  {
    rateLimit: RATE_LIMIT_CONFIGS.auth,
    validationSchema: z.object({
      customerName: z.string().min(1),
      customerEmail: z.string().email(),
      items: z.array(z.object({
        productId: z.string().min(1),
        name: z.string().min(1),
        price: z.number().min(0),
        quantity: z.number().int().min(1),
        size: z.string().optional().default(''),
        color: z.string().optional().default(''),
      })).min(1),
      totalAmount: z.number().min(0),
      shipping: z.object({
        address: z.string().min(1),
        city: z.string().min(1),
        state: z.string().optional().default(''),
        zip: z.string().optional().default(''),
        country: z.string().optional().default(''),
      }),
      userId: z.string().optional(),
    }),
  }
);

// PUT - Update order status (admin only)
export const PUT = withMiddleware(
  async (request, { body }) => {
    try {
      await connectDB();

      const data = body || await request.json();
      const { orderId, status } = data;
      if (!orderId || !status) {
        return createResponse({ error: 'orderId and status are required' }, 400);
      }

      const order = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );

      if (!order) {
        return createResponse({ error: 'Order not found' }, 404);
      }

      return createResponse({ success: true, order });
    } catch (error: any) {
      console.error('Update order error:', error);
      return createResponse({ error: error.message || 'Failed to update order' }, 500);
    }
  },
  {
    rateLimit: RATE_LIMIT_CONFIGS.authenticated,
    requireAuth: true,
  }
);
