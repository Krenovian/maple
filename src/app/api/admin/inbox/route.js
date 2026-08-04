import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireStaff } from '@/lib/admin';
import { logActivity } from '@/lib/activity';

export async function PATCH(req) {
  const { session, error } = await requireStaff();
  if (error) return error;

  try {
    const body = await req.json();
    if (!body.id || !body.type || !body.status) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (body.type === 'inquiry') {
      const item = await prisma.inquiry.update({
        where: { id: body.id },
        data: { status: body.status },
      });
      await logActivity({
        session,
        action: 'STATUS',
        entity: 'inquiry',
        entityId: item.id,
        summary: `Inquiry ${item.name} → ${item.status}`,
      });
      return NextResponse.json(item);
    }

    if (body.type === 'message') {
      const item = await prisma.contactMessage.update({
        where: { id: body.id },
        data: { status: body.status },
      });
      await logActivity({
        session,
        action: 'STATUS',
        entity: 'contactMessage',
        entityId: item.id,
        summary: `Message ${item.name} → ${item.status}`,
      });
      return NextResponse.json(item);
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { session, error } = await requireStaff();
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');
    if (!id || !type) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

    if (type === 'inquiry') {
      await prisma.inquiry.delete({ where: { id } });
      await logActivity({
        session,
        action: 'DELETE',
        entity: 'inquiry',
        entityId: id,
        summary: `Deleted inquiry ${id}`,
      });
    } else if (type === 'message') {
      await prisma.contactMessage.delete({ where: { id } });
      await logActivity({
        session,
        action: 'DELETE',
        entity: 'contactMessage',
        entityId: id,
        summary: `Deleted contact message ${id}`,
      });
    } else return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
