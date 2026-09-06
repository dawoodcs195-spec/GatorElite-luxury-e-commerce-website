import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const VIEWER_PASSWORD = process.env.VIEWER_PASSWORD || '';
const SECRET = process.env.SESSION_SECRET || '';

const hasLegacyAuth = !!(ADMIN_PASSWORD && VIEWER_PASSWORD && SECRET);

type Role = "admin" | "viewer";

function createToken(role: Role, password: string): string {
  const payload = JSON.stringify({ role, auth: true, ts: Date.now() });
  const signature = crypto.createHmac("sha256", SECRET).update(payload + password).digest("hex");
  return Buffer.from(payload).toString("base64") + "." + signature;
}

function decodeAndVerify(token: string): { valid: boolean; role?: Role } {
  if (!hasLegacyAuth) return { valid: false };
  try {
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

// POST /api/auth - login (legacy)
export async function POST(req: NextRequest) {
  if (!hasLegacyAuth) {
    return NextResponse.json({ error: "Legacy auth not configured" }, { status: 501 });
  }
  try {
    const body = await req.json();
    const { password } = body;
    let role: Role | null = null;
    if (password === ADMIN_PASSWORD) role = "admin";
    else if (password === VIEWER_PASSWORD) role = "viewer";
    if (!role) return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    const token = createToken(role, password);
    const response = NextResponse.json({ success: true, role });
    response.cookies.set("admin_token", token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "lax", maxAge: 60 * 60 * 24, path: "/",
    });
    return response;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// GET /api/auth - check if logged in + get role (legacy)
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return NextResponse.json({ authenticated: false });
  const result = decodeAndVerify(token);
  if (!result.valid) return NextResponse.json({ authenticated: false });
  return NextResponse.json({ authenticated: true, role: result.role });
}

// DELETE /api/auth - logout (legacy)
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_token", "", { maxAge: 0, path: "/" });
  return response;
}
