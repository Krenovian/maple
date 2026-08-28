import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireStaff, slugify } from '@/lib/admin';
import { logActivity } from '@/lib/activity';
import { parseJsonArray, parseSpecs } from '@/lib/catalog';
import {
  collectEntityImageUrls,
  collectRemovedUploadUrls,
  deleteUploadUrls,
} from '@/lib/uploadAssets';

function productImageUrlsFromBody(body) {
  const gallery = Array.isArray(body.gallery)
    ? body.gallery.filter(Boolean)
    : parseJsonArray(body.images);
  return [body.image, ...gallery].filter(Boolean);
}

function productPayload(body) {
  const gallery = Array.isArray(body.gallery)
    ? body.gallery.filter(Boolean)
    : parseJsonArray(body.images);
  const specs = Array.isArray(body.specs) ? parseSpecs(body.specs) : parseSpecs(body.specs);

  return {
    name: body.name?.trim(),
    description: body.description,
    category: body.category,
    price: body.price || null,
    image: body.image,
    imageAlt: body.imageAlt?.trim() || null,
    images: gallery.length ? JSON.stringify(gallery) : null,
    specs: specs.length ? JSON.stringify(specs) : null,
    leadTime: body.leadTime?.trim() || null,
    featured: Boolean(body.featured),
    metaTitle: body.metaTitle?.trim() || null,
    metaDescription: body.metaDescription?.trim() || null,
  };
}

export async function GET() {
  const { error } = await requireStaff();
  if (error) return error;
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(products);
}

export async function POST(req) {
  const { session, error } = await requireStaff();
  if (error) return error;

  try {
    const body = await req.json();
    const name = body.name?.trim();
    if (!name || !body.description || !body.image || !body.category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const base = slugify(body.slug || name);
    let slug = base || `product-${Date.now()}`;
    const exists = await prisma.product.findUnique({ where: { slug } });
    if (exists) slug = `${slug}-${Date.now().toString(36)}`;

    const data = productPayload({ ...body, name, inStock: body.inStock !== false, featured: Boolean(body.featured) });
    const product = await prisma.product.create({
      data: { ...data, slug, inStock: body.inStock !== false, featured: Boolean(body.featured) },
    });

    await logActivity({
      session,
      action: 'CREATE',
      entity: 'product',
      entityId: product.id,
      summary: `Created product “${product.name}”`,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(req) {
  const { session, error } = await requireStaff();
  if (error) return error;

  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const existing = await prisma.product.findUnique({ where: { id: body.id } });
    const beforeUrls = collectEntityImageUrls(existing);
    const afterUrls = productImageUrlsFromBody(body);
    const removedUrls = collectRemovedUploadUrls(beforeUrls, afterUrls);

    const data = productPayload({ ...body, inStock: Boolean(body.inStock), featured: Boolean(body.featured) });
    const product = await prisma.product.update({
      where: { id: body.id },
      data: { ...data, inStock: Boolean(body.inStock), featured: Boolean(body.featured) },
    });

    if (removedUrls.length) {
      await deleteUploadUrls(removedUrls);
    }

    await logActivity({
      session,
      action: 'UPDATE',
      entity: 'product',
      entityId: product.id,
      summary: `Updated product “${product.name}”`,
    });

    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { session, error } = await requireStaff();
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const existing = await prisma.product.findUnique({ where: { id } });
    await prisma.product.delete({ where: { id } });

    if (existing) {
      await deleteUploadUrls(collectEntityImageUrls(existing));
    }

    await logActivity({
      session,
      action: 'DELETE',
      entity: 'product',
      entityId: id,
      summary: `Deleted product “${existing?.name || id}”`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
