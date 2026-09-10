import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/admin';
import {
  deleteUploadedImages,
  getUploadRoot,
  getUploadSearchRoots,
  isManagedUploadUrl,
  saveUploadedImage,
} from '@/lib/localUploads';

export const runtime = 'nodejs';

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);

export async function GET() {
  const { error } = await requireStaff();
  if (error) return error;
  return NextResponse.json({
    configured: true,
    storage: 'local',
    writeRoot: getUploadRoot(),
    readRoots: getUploadSearchRoots(),
  });
}

export async function DELETE(req) {
  const { error } = await requireStaff();
  if (error) return error;

  try {
    const body = await req.json().catch(() => ({}));
    const urls = [
      ...(Array.isArray(body.urls) ? body.urls : []),
      ...(body.url ? [body.url] : []),
    ].filter(isManagedUploadUrl);

    if (!urls.length) {
      return NextResponse.json({ error: 'No uploaded image URL provided' }, { status: 400 });
    }

    const result = await deleteUploadedImages(urls);
    if (result.errors.length) {
      return NextResponse.json({ error: result.errors[0], ...result }, { status: 502 });
    }

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error('Upload delete error:', err);
    return NextResponse.json({ error: err.message || 'Delete failed' }, { status: 500 });
  }
}

export async function POST(req) {
  const { error } = await requireStaff();
  if (error) return error;

  try {
    const form = await req.formData();
    const file = form.get('file');
    const folder = String(form.get('folder') || 'maple');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { error: 'Only JPEG, PNG, WebP, GIF or AVIF images are allowed' },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Image must be under 8MB' }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const uploaded = await saveUploadedImage({
      bytes,
      mimeType: file.type,
      folder,
    });

    return NextResponse.json({
      url: uploaded.url,
      filename: uploaded.filename,
      bytes: uploaded.bytes,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
