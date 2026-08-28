import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireStaff } from '@/lib/admin';
import { logActivity } from '@/lib/activity';
import {
  getCategoryPath,
  replaceCategoryPathPrefix,
} from '@/lib/categoryTree';
import { deleteUploadUrls, isManagedUploadUrl } from '@/lib/uploadAssets';

const TYPES = new Set(['PRODUCT', 'PROJECT']);

function categoryPayload(body) {
  return {
    name: body.name?.trim(),
    image: body.image || null,
    imageAlt: body.imageAlt?.trim() || null,
    parentId: body.parentId || null,
    sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
  };
}

async function productsUsingCategoryTree(category, allCategories) {
  const path = getCategoryPath(category.id, allCategories);
  const products = await prisma.product.findMany({
    where: { category: { not: '' } },
    select: { id: true, category: true },
  });

  return products.filter(
    (product) =>
      product.category === path ||
      product.category === category.name ||
      product.category.startsWith(`${path} ›`) ||
      product.category.startsWith(`${category.name} ›`)
  );
}

export async function GET(req) {
  const { error } = await requireStaff();
  if (error) return error;

  const type = new URL(req.url).searchParams.get('type');
  const where = TYPES.has(type) ? { type } : {};
  const categories = await prisma.category.findMany({
    where,
    orderBy: [{ type: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
  });
  return NextResponse.json(categories);
}

export async function POST(req) {
  const { session, error } = await requireStaff();
  if (error) return error;

  try {
    const body = await req.json();
    const type = body.type;
    const data = categoryPayload(body);
    if (!data.name || !TYPES.has(type)) {
      return NextResponse.json({ error: 'Name and type (PRODUCT|PROJECT) required' }, { status: 400 });
    }

    if (data.parentId) {
      const parent = await prisma.category.findUnique({ where: { id: data.parentId } });
      if (!parent || parent.type !== type) {
        return NextResponse.json({ error: 'Invalid parent category' }, { status: 400 });
      }
    }

    const category = await prisma.category.create({
      data: { ...data, type },
    });

    await logActivity({
      session,
      action: 'CREATE',
      entity: 'category',
      entityId: category.id,
      summary: `Created ${type.toLowerCase()} category “${data.name}”`,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'That category already exists at this level' }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(req) {
  const { session, error } = await requireStaff();
  if (error) return error;

  try {
    const body = await req.json();
    if (!body.id || !body.name?.trim()) {
      return NextResponse.json({ error: 'id and name required' }, { status: 400 });
    }

    const existing = await prisma.category.findUnique({ where: { id: body.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const data = categoryPayload(body);
    const allCategories = await prisma.category.findMany({
      where: { type: existing.type },
    });

    if (data.parentId === body.id) {
      return NextResponse.json({ error: 'A category cannot be its own parent' }, { status: 400 });
    }

    if (data.parentId) {
      const parent = allCategories.find((category) => category.id === data.parentId);
      if (!parent) {
        return NextResponse.json({ error: 'Invalid parent category' }, { status: 400 });
      }
    }

    const oldPath = getCategoryPath(existing.id, allCategories);
    const removedImage =
      existing.image && existing.image !== data.image && isManagedUploadUrl(existing.image)
        ? existing.image
        : null;

    const category = await prisma.category.update({
      where: { id: body.id },
      data,
    });

    const nextCategories = allCategories.map((item) =>
      item.id === category.id ? category : item
    );
    const newPath = getCategoryPath(category.id, nextCategories);

    if (existing.name !== data.name || existing.parentId !== data.parentId) {
      if (existing.type === 'PRODUCT') {
        const products = await prisma.product.findMany({ select: { id: true, category: true } });
        await Promise.all(
          products.map((product) => {
            const nextCategory = replaceCategoryPathPrefix(product.category, oldPath, newPath);
            if (nextCategory === product.category) return null;
            return prisma.product.update({
              where: { id: product.id },
              data: { category: nextCategory },
            });
          })
        );
      } else {
        await prisma.project.updateMany({
          where: { category: existing.name },
          data: { category: data.name },
        });
      }
    }

    if (removedImage) {
      await deleteUploadUrls([removedImage]);
    }

    await logActivity({
      session,
      action: 'UPDATE',
      entity: 'category',
      entityId: category.id,
      summary: `Updated ${existing.type.toLowerCase()} category “${existing.name}”`,
    });

    return NextResponse.json(category);
  } catch (err) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'That category already exists at this level' }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { session, error } = await requireStaff();
  if (error) return error;

  try {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const childCount = await prisma.category.count({ where: { parentId: id } });
    if (childCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete a category that still has subcategories. Remove or move them first.' },
        { status: 409 }
      );
    }

    const allCategories = await prisma.category.findMany({ where: { type: existing.type } });
    const inUse =
      existing.type === 'PRODUCT'
        ? (await productsUsingCategoryTree(existing, allCategories)).length
        : await prisma.project.count({ where: { category: existing.name } });

    if (inUse > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete “${existing.name}” — used by ${inUse} ${
            existing.type === 'PRODUCT' ? 'product' : 'project'
          }${inUse === 1 ? '' : 's'}. Reassign them first.`,
        },
        { status: 409 }
      );
    }

    await prisma.category.delete({ where: { id } });

    if (existing.image && isManagedUploadUrl(existing.image)) {
      await deleteUploadUrls([existing.image]);
    }

    await logActivity({
      session,
      action: 'DELETE',
      entity: 'category',
      entityId: id,
      summary: `Deleted ${existing.type.toLowerCase()} category “${existing.name}”`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
