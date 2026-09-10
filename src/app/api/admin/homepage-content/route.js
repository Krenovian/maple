import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { getHomepageContent, setHomepageContent } from '@/lib/siteContent';
import { logActivity } from '@/lib/activity';
import { revalidatePublicSite } from '@/lib/revalidatePublic';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const content = await getHomepageContent();
  return NextResponse.json(content.raw);
}

export async function PUT(req) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const content = await setHomepageContent(body);

    await logActivity({
      session,
      action: 'UPDATE',
      entity: 'siteSetting',
      entityId: 'homepage-content',
      summary: 'Updated homepage Ethos and testimonial copy',
    });

    revalidatePublicSite();

    return NextResponse.json(content.raw);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || 'Failed to update homepage content' },
      { status: 400 }
    );
  }
}
