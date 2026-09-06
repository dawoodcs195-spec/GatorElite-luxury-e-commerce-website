import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Legacy admin_token middleware - only active when env vars are configured.
// The app primarily uses JWT auth via gatorelite_token cookie + apiMiddleware.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const VIEWER_PASSWORD = process.env.VIEWER_PASSWORD || '';
const SECRET = process.env.SESSION_SECRET || '';

const hasLegacyAuth = !!(ADMIN_PASSWORD && VIEWER_PASSWORD && SECRET);

function decodeToken(token: string): { valid: boolean; role?: string } {
  if (!hasLegacyAuth) return { valid: false };
  try {
    const crypto = require("crypto");
    const [payloadB64, signature] = token.split(".");
    if (!payloadB64 || !signature) return { valid: false };
    const payload = Buffer.from(payloadB64, "base64").toString();
    const data = JSON.parse(payload);
    const expectedAdmin = crypto.createHmac("sha256", SECRET).update(payload + ADMIN_PASSWORD).digest("hex");
    const expectedViewer = crypto.createHmac("sha256", SECRET).update(payload + VIEWER_PASSWORD).digest("hex");
    if (signature === expectedAdmin) return { valid: true, role: "admin" };
    if (signature === expectedViewer) return { valid: true, role: data.role || "viewer" };
    return { valid: false };
  } catch {
    return { valid: false };
  }
}

export function middleware(request: NextRequest) {
  if (!hasLegacyAuth) return NextResponse.next();
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) {
    const token = request.cookies.get("admin_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const result = decodeToken(token);
    if (!result.valid) return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    if (request.method !== "GET" && request.method !== "HEAD" && result.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/products/:path*", "/api/upload/:path*", "/api/seed/:path*"],
};
