import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { getSiteImages, setSiteImages } from '@/lib/siteSettings';
import { logActivity } from '@/lib/activity';
import { revalidatePublicSite } from '@/lib/revalidatePublic';
import { deleteUploadUrls, isManagedUploadUrl } from '@/lib/uploadAssets';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const images = await getSiteImages();
  return NextResponse.json(images);
}

export async function PUT(req) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const { images, removedUrls } = await setSiteImages(body);

    const removed = (removedUrls || []).filter(isManagedUploadUrl);
    if (removed.length) {
      await deleteUploadUrls(removed);
    }

    await logActivity({
      session,
      action: 'UPDATE',
      entity: 'siteSetting',
      entityId: 'site-images',
      summary: 'Updated site section images',
    });

    revalidatePublicSite();

    return NextResponse.json(images);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || 'Failed to update site settings' },
      { status: 400 }
    );
  }
}
