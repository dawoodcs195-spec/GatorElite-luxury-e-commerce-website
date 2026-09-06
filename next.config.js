/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gatorelite.com';

const securityHeaders = [
  // Prevent clickjacking
  { key: 'X-Frame-Options', value: 'DENY' },
  
  // Prevent MIME sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  
  // XSS protection (legacy browsers)
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  
  // Referrer policy
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  
  // Permissions policy - disable unused browser features
  { 
    key: 'Permissions-Policy', 
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()' 
  },
  
  // Content Security Policy - prevents XSS and code injection
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https: http:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://va.vercel-scripts.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
  
  // HSTS - force HTTPS (only in production)
  ...(isProd ? [{
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  }] : []),
  
  // Prevent search engines from caching sensitive pages
  { key: 'X-Robots-Tag', value: 'none' },
];

const nextConfig = {
  // Image optimization
  images: { 
    unoptimized: true,
    domains: ['localhost'],
  },
  
  // External packages
  serverExternalPackages: ['mongoose', 'cloudinary'],
  
  // Security headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: securityHeaders,
    },
    // API routes - stricter CORS
    {
      source: '/api/(.*)',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: isProd ? SITE_URL : '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        { key: 'Access-Control-Allow-Credentials', value: 'true' },
        { key: 'Access-Control-Max-Age', value: '86400' },
      ],
    },
  ],
  
  // Redirect HTTP to HTTPS in production
  async redirects() {
    if (!isProd) return [];
    return [
      {
        source: '/(.*)',
        has: [{ type: 'host', value: 'gatorelite.com' }],
        destination: 'https://www.gatorelite.com/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
