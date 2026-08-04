import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireStaff } from '@/lib/admin';
import { logActivity } from '@/lib/activity';

const TYPES = new Set(['PRODUCT', 'PROJECT']);

export async function GET(req) {
  const { error } = await requireStaff();
  if (error) return error;

  const type = new URL(req.url).searchParams.get('type');
  const where = TYPES.has(type) ? { type } : {};
  const categories = await prisma.category.findMany({
    where,
    orderBy: [{ type: 'asc' }, { name: 'asc' }],
  });
  return NextResponse.json(categories);
}

export async function POST(req) {
  const { session, error } = await requireStaff();
  if (error) return error;

  try {
    const body = await req.json();
    const name = body.name?.trim();
    const type = body.type;
    if (!name || !TYPES.has(type)) {
      return NextResponse.json({ error: 'Name and type (PRODUCT|PROJECT) required' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: { name, type },
    });

    await logActivity({
      session,
      action: 'CREATE',
      entity: 'category',
      entityId: category.id,
      summary: `Created ${type.toLowerCase()} category “${name}”`,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'That category already exists' }, { status: 409 });
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

    const name = body.name.trim();
    const category = await prisma.category.update({
      where: { id: body.id },
      data: { name },
    });

    // Rename on existing records so filters stay consistent
    if (existing.name !== name) {
      if (existing.type === 'PRODUCT') {
        await prisma.product.updateMany({
          where: { category: existing.name },
          data: { category: name },
        });
      } else {
        await prisma.project.updateMany({
          where: { category: existing.name },
          data: { category: name },
        });
      }
    }

    await logActivity({
      session,
      action: 'UPDATE',
      entity: 'category',
      entityId: category.id,
      summary: `Renamed ${existing.type.toLowerCase()} category “${existing.name}” → “${name}”`,
    });

    return NextResponse.json(category);
  } catch (err) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'That category already exists' }, { status: 409 });
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

    const inUse =
      existing.type === 'PRODUCT'
        ? await prisma.product.count({ where: { category: existing.name } })
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
