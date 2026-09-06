import { NextRequest } from 'next/server';
import path from 'path';
import { createErrorResponse, ERROR_MESSAGES, logError } from '@/lib/errors';
import { uploadImage } from '@/lib/cloudinary';

// ─── Security Configuration ─────────────────────────────────────────────────

const MAX_FILE_SIZE = parseInt(process.env.UPLOAD_MAX_SIZE_MB || '5', 10) * 1024 * 1024; // 5MB default

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

// Magic bytes for file content validation
const MAGIC_BYTES: Record<string, number[]> = {
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/png': [0x89, 0x50, 0x4e, 0x47],
  'image/gif': [0x47, 0x49, 0x46, 0x38],
  'image/webp': [0x52, 0x49, 0x46, 0x46], // RIFF header
};



// ─── Validation Helpers ─────────────────────────────────────────────────────

function validateFileSize(size: number): string | null {
  if (size === 0) return 'File is empty';
  if (size > MAX_FILE_SIZE) return `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`;
  return null;
}

function validateFileExtension(filename: string): string | null {
  const ext = path.extname(filename).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return `Invalid file type. Allowed: ${Array.from(ALLOWED_EXTENSIONS).join(', ')}`;
  }
  return null;
}

function validateMimeType(mimeType: string): string | null {
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return `Invalid file type. Allowed image formats only`;
  }
  return null;
}

async function validateFileContent(buffer: ArrayBuffer): Promise<string | null> {
  const bytes = new Uint8Array(buffer.slice(0, 8));
  
  // Check magic bytes
  for (const [mimeType, magic] of Object.entries(MAGIC_BYTES)) {
    if (ALLOWED_MIME_TYPES.has(mimeType)) {
      const matches = magic.every((byte, i) => bytes[i] === byte);
      if (matches) return null; // Valid content matches expected type
    }
  }
  
  // Check for WebP (RIFF....WEBP)
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
    const webp = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
    if (webp === 'WEBP') return null;
  }
  
  return 'File content does not match expected image format';
}


// ─── POST Handler ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    // 1. Check file exists
    if (!file) {
      return createErrorResponse(null, 'No file provided', 400);
    }
    
    // 2. Validate file size
    const sizeError = validateFileSize(file.size);
    if (sizeError) {
      return createErrorResponse(null, sizeError, 400);
    }
    
    // 3. Validate file extension
    const extError = validateFileExtension(file.name);
    if (extError) {
      return createErrorResponse(null, extError, 400);
    }
    
    // 4. Validate MIME type
    const mimeError = validateMimeType(file.type);
    if (mimeError) {
      return createErrorResponse(null, mimeError, 400);
    }
    
    // 5. Read file content and validate
    const bytes = await file.arrayBuffer();
    const contentError = await validateFileContent(bytes);
    if (contentError) {
      return createErrorResponse(null, contentError, 400);
    }
    
    // 6. Upload to Cloudinary
    const result = await uploadImage(Buffer.from(bytes));
    
    // 7. Return Cloudinary URL
    return Response.json({
      success: true,
      url: result.url,
      filename: result.publicId,
    });
    
  } catch (error) {
    logError('Upload', error);
    return createErrorResponse(error, ERROR_MESSAGES.UPLOAD_FAILED);
  }
}
