import { readFile, stat } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { getUploadAbsolutePath } from '@/lib/localUploads';

const EXT_MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
};

export async function GET(_req, { params }) {
  const { path: segments } = await params;
  const relativePath = Array.isArray(segments) ? segments.join('/') : segments;
  if (!relativePath) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const absolutePath = getUploadAbsolutePath(`/uploads/${relativePath}`);
  if (!absolutePath) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const fileStat = await stat(absolutePath);
    if (!fileStat.isFile()) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const bytes = await readFile(absolutePath);
    const ext = path.extname(absolutePath).toLowerCase();

    return new NextResponse(bytes, {
      headers: {
        'Content-Type': EXT_MIME[ext] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    console.error('Serve upload error:', err);
    return NextResponse.json({ error: 'Failed to read upload' }, { status: 500 });
  }
}
