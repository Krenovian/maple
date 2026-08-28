import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireStaff, slugify } from '@/lib/admin';
import { logActivity } from '@/lib/activity';
import {
  collectEntityImageUrls,
  collectRemovedUploadUrls,
  deleteUploadUrls,
} from '@/lib/uploadAssets';
import { parseJsonArray } from '@/lib/catalog';

function projectImageUrlsFromBody(body) {
  const gallery = Array.isArray(body.gallery)
    ? body.gallery.filter(Boolean)
    : parseJsonArray(body.images);
  return [body.image, ...gallery].filter(Boolean);
}

export async function GET() {
  const { error } = await requireStaff();
  if (error) return error;
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(projects);
}

export async function POST(req) {
  const { session, error } = await requireStaff();
  if (error) return error;

  try {
    const body = await req.json();
    const title = body.title?.trim();
    if (!title || !body.location || !body.description || !body.image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const base = slugify(body.slug || title);
    let slug = base || `project-${Date.now()}`;
    const exists = await prisma.project.findUnique({ where: { slug } });
    if (exists) slug = `${slug}-${Date.now().toString(36)}`;

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description: body.description,
        category: body.category || 'Residential',
        location: body.location,
        area: body.area || null,
        year: body.year || null,
        image: body.image,
        imageAlt: body.imageAlt?.trim() || null,
        images: Array.isArray(body.gallery)
          ? JSON.stringify(body.gallery.filter(Boolean))
          : body.images || null,
        featured: Boolean(body.featured),
        status: body.status || 'Completed',
        metaTitle: body.metaTitle?.trim() || null,
        metaDescription: body.metaDescription?.trim() || null,
      },
    });

    await logActivity({
      session,
      action: 'CREATE',
      entity: 'project',
      entityId: project.id,
      summary: `Created project “${project.title}”`,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(req) {
  const { session, error } = await requireStaff();
  if (error) return error;

  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const existing = await prisma.project.findUnique({ where: { id: body.id } });
    const beforeUrls = collectEntityImageUrls(existing);
    const afterUrls = projectImageUrlsFromBody(body);
    const removedUrls = collectRemovedUploadUrls(beforeUrls, afterUrls);

    const project = await prisma.project.update({
      where: { id: body.id },
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        location: body.location,
        area: body.area || null,
        year: body.year || null,
        image: body.image,
        imageAlt: body.imageAlt?.trim() || null,
        images: Array.isArray(body.gallery)
          ? JSON.stringify(body.gallery.filter(Boolean))
          : body.images ?? undefined,
        featured: Boolean(body.featured),
        status: body.status || 'Completed',
        metaTitle: body.metaTitle?.trim() || null,
        metaDescription: body.metaDescription?.trim() || null,
      },
    });

    if (removedUrls.length) {
      await deleteUploadUrls(removedUrls);
    }

    await logActivity({
      session,
      action: 'UPDATE',
      entity: 'project',
      entityId: project.id,
      summary: `Updated project “${project.title}”`,
    });

    return NextResponse.json(project);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { session, error } = await requireStaff();
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const existing = await prisma.project.findUnique({ where: { id } });
    await prisma.project.delete({ where: { id } });

    if (existing) {
      await deleteUploadUrls(collectEntityImageUrls(existing));
    }

    await logActivity({
      session,
      action: 'DELETE',
      entity: 'project',
      entityId: id,
      summary: `Deleted project “${existing?.title || id}”`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
