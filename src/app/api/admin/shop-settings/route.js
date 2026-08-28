import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { getShopSettings, setShopSettings } from '@/lib/shopSettings';
import { logActivity } from '@/lib/activity';
import { deleteUploadUrls, isManagedUploadUrl } from '@/lib/uploadAssets';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const settings = await getShopSettings();
  return NextResponse.json(settings);
}

export async function PUT(req) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const { settings, removedUrls } = await setShopSettings(body);

    const removed = (removedUrls || []).filter(isManagedUploadUrl);
    if (removed.length) {
      await deleteUploadUrls(removed);
    }

    await logActivity({
      session,
      action: 'UPDATE',
      entity: 'siteSetting',
      entityId: 'shop-settings',
      summary: 'Updated shop promo and homepage section settings',
    });

    return NextResponse.json(settings);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || 'Failed to update shop settings' },
      { status: 400 }
    );
  }
}
