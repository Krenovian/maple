import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireStaff } from '@/lib/admin';
import { logActivity } from '@/lib/activity';

export async function GET() {
  const { error } = await requireStaff();
  if (error) return error;
  const leads = await prisma.orderLead.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(leads);
}

export async function PATCH(req) {
  const { session, error } = await requireStaff();
  if (error) return error;

  try {
    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ error: 'id and status required' }, { status: 400 });
    }
    const lead = await prisma.orderLead.update({
      where: { id: body.id },
      data: { status: body.status },
    });
    await logActivity({
      session,
      action: 'STATUS',
      entity: 'orderLead',
      entityId: lead.id,
      summary: `Order lead ${lead.name} → ${lead.status}`,
    });
    return NextResponse.json(lead);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { session, error } = await requireStaff();
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    const existing = await prisma.orderLead.findUnique({ where: { id } });
    await prisma.orderLead.delete({ where: { id } });
    await logActivity({
      session,
      action: 'DELETE',
      entity: 'orderLead',
      entityId: id,
      summary: `Deleted order lead “${existing?.name || id}”`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
