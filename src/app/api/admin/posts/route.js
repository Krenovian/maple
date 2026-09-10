import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireStaff, slugify } from '@/lib/admin';
import { logActivity } from '@/lib/activity';
import {
  collectEntityImageUrls,
  collectRemovedUploadUrls,
  deleteUploadUrls,
} from '@/lib/uploadAssets';

function postPayload(body) {
  const published = Boolean(body.published);
  return {
    title: body.title?.trim(),
    excerpt: body.excerpt?.trim() || null,
    content: body.content?.trim(),
    image: body.image || null,
    imageAlt: body.imageAlt?.trim() || null,
    authorName: body.authorName?.trim() || null,
    published,
    publishedAt: published
      ? body.publishedAt
        ? new Date(body.publishedAt)
        : new Date()
      : null,
    featured: Boolean(body.featured),
    metaTitle: body.metaTitle?.trim() || null,
    metaDescription: body.metaDescription?.trim() || null,
  };
}

export async function GET() {
  const { error } = await requireStaff();
  if (error) return error;

  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(posts);
}

export async function POST(req) {
  const { session, error } = await requireStaff();
  if (error) return error;

  try {
    const body = await req.json();
    const data = postPayload(body);
    if (!data.title || !data.content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const base = slugify(body.slug || data.title);
    let slug = base || `post-${Date.now()}`;
    const exists = await prisma.post.findUnique({ where: { slug } });
    if (exists) slug = `${slug}-${Date.now().toString(36)}`;

    const post = await prisma.post.create({
      data: { ...data, slug },
    });

    await logActivity({
      session,
      action: 'CREATE',
      entity: 'post',
      entityId: post.id,
      summary: `Created blog post “${post.title}”`,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function PUT(req) {
  const { session, error } = await requireStaff();
  if (error) return error;

  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const existing = await prisma.post.findUnique({ where: { id: body.id } });
    if (!existing) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    const data = postPayload(body);
    const beforeUrls = collectEntityImageUrls(existing);
    const afterUrls = collectEntityImageUrls({ image: data.image });
    const removedUrls = collectRemovedUploadUrls(beforeUrls, afterUrls);

    const post = await prisma.post.update({
      where: { id: body.id },
      data,
    });

    if (removedUrls.length) {
      await deleteUploadUrls(removedUrls);
    }

    await logActivity({
      session,
      action: 'UPDATE',
      entity: 'post',
      entityId: post.id,
      summary: `Updated blog post “${post.title}”`,
    });

    return NextResponse.json(post);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { session, error } = await requireStaff();
  if (error) return error;

  try {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const existing = await prisma.post.findUnique({ where: { id } });
    await prisma.post.delete({ where: { id } });

    if (existing) {
      await deleteUploadUrls(collectEntityImageUrls(existing));
    }

    await logActivity({
      session,
      action: 'DELETE',
      entity: 'post',
      entityId: id,
      summary: `Deleted blog post “${existing?.title || id}”`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
